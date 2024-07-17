# 🐕 Governance Watchdog

- TODO: Fix local failure of secret manager

<!-- markdown-link-check-disable -->

A monorepo for our governance watchdog, a system that monitors Mento Governance events on-chain and sends notifications about them to Discord and Telegram. Mento Devs can view the [full project spec in our Notion.](https://www.notion.so/mentolabs/Governance-Watchdog-d168a8110a53430a90e2f5ab65f103f5?pvs=4)

<!-- markdown-link-check-enable -->

![Architecture Diagram](arch-diagram.png)

- [Requirements](#requirements)
- [Local Development of Cloud Function Code](#local-development-of-cloud-function-code)
- [Testing the Deployed Cloud Function](#testing-the-deployed-cloud-function)
- [Infra Setup (when project is deployed already)](#infra-setup-when-project-is-deployed-already)
- [First Time Infra Deployment via Terraform](#first-time-infra-deployment-via-terraform)
  - [Google Cloud Permission Requirements](#google-cloud-permission-requirements)
  - [Deployment from scratch](#deployment-from-scratch)
  - [Migrate Terraform State to Google Cloud](#migrate-terraform-state-to-google-cloud)
- [Updating the Cloud Function](#updating-the-cloud-function)
- [Teardown](#teardown)

## Requirements

1. Install Terraform

   ```sh
   # On macOS
   brew install terraform

   # For other systems, see https://developer.hashicorp.com/terraform/install
   ```

1. Authenticate with Google Cloud in your local shell

   ```sh
   gcloud auth login
   ```

1. Install trunk (one linter to rule them all)

   ```sh
   # For macOS
   brew install trunk-io

   # For other systems, check https://docs.trunk.io/check/usage
   ```

   Optionally, you can also install the [Trunk VS Code Extension](https://marketplace.visualstudio.com/items?itemName=Trunk.io)

1. Create a local `.env` file and fill in the required values

   ```sh
   cp .env.example .env
   ```

## Local Development of Cloud Function Code

- `npm install` (couldn't use `pnpm` because Google Cloud Build failed trying to install pnpm at the time of writing)
- `npm start` to start a local cloud function
- `npm test` to call the local cloud function with a mocked payload

  ```sh
  curl -H "Content-Type: application/json" -d @src/proposal-created.fixture.json localhost:8080
  ```

## Testing the Deployed Cloud Function

You can test the deployed cloud function manually by using the `./src/proposal-created.fixture.json` which contains a similar payload to what a QuickAlert would send to the cloud function:

```sh
./test-deployed-function.sh
# or `npm run test-in-prod` if you prefer npm to call this script
```

## Infra Setup (when project is deployed already)

1. Set your local `gcloud` project to the watchdog project:

   ```sh
   # If that `awk` magic fails, just look up the project ID manually via `gcloud projects list`
   project_id=$(terraform state show "module.bootstrap.module.seed_project.module.project-factory.google_project.main" | grep 'project_id' | awk -F '"' '{print $2}')

   gcloud config set project $project_id
   gcloud auth application-default set-quota-project $project_id
   ```

1. Inside the `./infra` folder, run `terraform init` to install all required terraform providers and sync the terraform state from the project's google cloud storage bucket:

   ```sh
   cd infra
   terraform init
   ```

1. Create a `terraform.tfvars` file in the `./infra` folder, this is like `.env` for Terraform:

   ```sh
   touch ./infra/terraform.tfvars
   # This file should be `.gitignore`d to avoid accidentally leaking sensitive data
   ```

1. Add the following values to your `terraform.tfvars`, you can look up all values in the Google Cloud console (or ask another dev to share his local `terraform.tfvars` with you)

   ```sh
   billing_account      = "<our-billing-account-id>"
   group_billing_admins = "<our-billing-admins-group>"
   group_org_admins     = "<our-org-admins-group>"
   org_id               = "<our-org-id>"
   ```

1. Add the Discord Webhook URL from Google Cloud Secret Manager into your local `terraform.tfvars`:

   ```sh
   echo "discord_webhook_url = \"$(gcloud secrets versions access latest --secret discord-webhook-url)\"" >> terraform.tfvars
   ```

1. [Create a QuickNode API key](https://dashboard.quicknode.com/api-keys) and add it to your local `terraform.tfvars`:

   ```sh
   # ./infra/terraform.tfvars
   discord_webhook_url = "<discord-webhook-url>"
   quicknode_api_key   = "<your-quicknode-api-key>"
   ```

   - This is necessary for Terraform to be able to create QuickAlerts when deploying this project

## First Time Infra Deployment via Terraform

### Google Cloud Permission Requirements

In order to create this project from scratch using the [terraform-google-bootstrap](https://github.com/terraform-google-modules/terraform-google-bootstrap) module, you will need the following permissions in our Google Cloud Organization:

- `roles/resourcemanager.organizationAdmin` on the top-level GCP Organization
- `roles/orgpolicy.policyAdmin` on the top-level GCP Organization
- `roles/billing.admin` on the billing account connected to the project
- Your local gcloud account running `terraform apply` should be a member of the `group_org_admins` variable provided in `./main.tf`

### Deployment from scratch

<!-- markdown-link-check-disable -->

1. [Create a Discord Webhook URL](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) for the channel you want to receive notifications in <!-- markdown-link-check-enable -->

2. Add the Discord Webhook URL to your local `terraform.tfvars`:

   ```sh
   # This will be stored in Google Secret Manager upon deployment via Terraform
   echo "discord_webhook_url = \"<discord-webhook-url>"" >> terraform.tfvars
   ```

3. Outcomment the `backend` section in `main.tf` (because this bucket doesn't exist yet, it will be created by the first `terraform apply` run)

   ```hcl
   backend "gcs" {
     bucket = "governance-watchdog-terraform-state-<some-randum-suffix>"
   }
   ```

4. Run `terraform init` to install the required providers and init a temporary local backend in a `terraform.tfstate` file
5. **Deploy the entire project via `terraform apply`**

   - You will see an overview of all resources to be created. Review them if you like and then type "Yes" to confirm.
   - This command can take up to 10 minutes because it does a lot of work creating and configuring all defined Google Cloud Resources
   - ❌ Given the complexity of setting up an entire Google Cloud Project incl. service accounts, permissions, etc., you might run
     into errors with some components. If that happens:

     - First, simply retry `terraform apply`. Sometimes a dependency of a resource has simply not finished creating when terraform already tried to deploy the next one, so waiting a few minutes for things to settle can help.
     - Second, there is a [known issue when creating a Google Cloud Function with a non-standard service account](https://console.cloud.google.com/iam-admin/serviceaccounts?project=governance-watchdog-73c6). The Google Cloud Terraform Provider seems to ignore the specified service account and instead tries to use the standard Compute Service Account to deploy the function. That default account is disabled by default, though, which leads to an error when deploying the cloud function.

       - You have to re-enable the default compute service account manually:

         ```sh
         gcloud iam service-accounts enable $(gcloud iam service-accounts list --format="value(email)" | grep compute)
         ```

       - Now `terraform apply` should be able to deploy the Cloud Function

6. Set your local `gcloud` project to our freshly created one:

   ```sh
   # If that `awk` magic fails, just look up the project ID manually via `gcloud projects list`
   project_id=$(terraform state show "module.bootstrap.module.seed_project.module.project-factory.google_project.main" | grep 'project_id' | awk -F '"' '{print $2}')

   gcloud config set project $project_id
   gcloud auth application-default set-quota-project $project_id
   ```

### Migrate Terraform State to Google Cloud

For all team members to be able to manage the Google Cloud infrastructure, you need to migrate the terraform state from your local backend (`terraform.tfstate`) to a remote backend in a Google Cloud Storage Bucket:

1. Copy the name of the created terraform state bucket to your clipboard:

   ```sh
   terraform state show "module.bootstrap.google_storage_bucket.org_terraform_state" | grep name | awk -F '"' '{print $2}' | pbcopy
   ```

1. Uncomment the original `backend` section in `main.tf` and replace the bucket name with the new one you just copied
1. Complete the state migration:

   ```sh
   terraform init -migrate-state

   # This command will ask you _"Do you want to copy existing state to the new backend?"_ — Make sure to type **YES** here to not re-create everything from scratch again
   ```

1. Delete your local backend files, you don't need them anymore because our state now lives in the cloud and can be shared amongst team members:

   ```sh
   rm terraform.tfstate
   rm terraform.tfstate.backup
   ```

## Updating the Cloud Function

You have two options, using `terraform` or the `gcloud` cli.

1. Via `terraform` by running `npm run deploy:via:tf`
   - How? The npm task will:
     - Compile TS to JS
     - Zip the `./dist` folder into `function-source.zip`
     - And then call `terraform apply` which re-deploys the function with the new source code from the zip file
   - Pros
     - Keeps the terraform state clean
     - Same command for all changes, regardless of infra or cloud function code
   - Cons
     - Less familiar way of deploying cloud functions (if you're used to `gcloud functions deploy`)
     - Less log output
     - Slightly slower because `terraform apply` will always fetch the current state from the cloud storage bucket before deploying
2. Via `gcloud` by running `npm run deploy:via:gcloud`
   - How? The npm task will:
     - Generate a temporary `.env.yaml` (because for some reason gcloud does not support normal `.env` files)
     - Look up the service account used by the cloud function
     - Call `gcloud functions deploy` with the correct parameters
   - Pros
     - Familiar way of deploying cloud functions
     - More log output making deployment failures slightly faster to debug
     - Slightly faster because we're skipping the terraform state lookup
   - Cons
     - Will lead to inconsistent terraform state (because terraform is tracking the function source code and its version)
     - Different commands to remember when updating infra components vs cloud function source code

## Teardown

1. `terraform -chdir=infra destroy`
   - You might run into permission issues here, especially around deleting the associated billing account resources
   - I didn't have time to figure out the minimum set of permissions required to delete this project so the easiest would be to let an organization owner (i.e. Bogdan) run this with full permissions
