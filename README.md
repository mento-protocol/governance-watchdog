# Governance Watchdog Notifications

- TODO: Explain how to deploy updates to cloud function (either via tf or gcloud)
- TODO: Explain high level architecture (or link to tech spec in notion)
- TODO: Fix local failure of secret manager

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

   # For other options check https://docs.trunk.io/check/usage
   ```

## Local Development of Cloud Function Code

- `npm install` (couldn't use `pnpm` because Google Cloud Build failed trying to install pnpm at the time of writing)
- `npm start` to start a local cloud function
- `npm test` to call the local cloud function with a mocked payload

  ```sh
  curl -H "Content-Type: application/json" -d @src/proposal-created.fixture.json localhost:8080
  ```

## Setup (when project is deployed already)

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

## First time deployment setup (if project has not been deployed already)

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

7. Migrate the terraform state from your local backend (`terraform.tfstate`) to a remote backend in a cloud storage bucket:

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

## Testing Locally

You can test the deployed cloud function manually by using the `./src/proposal-created.fixture.json` which contains a similar payload to what a QuickAlert would send to the cloud function:

```sh
./test-deployed-function.sh # or `npm run test-in-prod` if you prefer npm to call this script
```

## Teardown

1. `cd infra && terraform destroy`
   - You might run into permission issues here, especially around deleting the associated billing account resources
   - I didn't have time to figure out the minimum set of permissions required to delete this project so the easiest would be to let an organization owner (i.e. Bogdan) run this with full permissions
