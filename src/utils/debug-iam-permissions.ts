import { ProjectsClient } from "@google-cloud/resource-manager";
import config from "../config.js";

/**
 * Can be used to debug permission issues from inside the cloud function.
 */
export default async function checkIamPermissions(serviceAccountEmail: string) {
  const projectsClient = new ProjectsClient();

  try {
    const [policy] = await projectsClient.getIamPolicy({
      resource: `projects/${config.GCP_PROJECT_ID}`,
    });

    console.log("IAM policy:", policy);

    if (!policy.bindings) {
      throw new Error("No IAM policy bindings found");
    }

    console.log("IAM policy bindings:", policy.bindings);

    const bindings = policy.bindings.filter((binding) =>
      binding.members?.includes(`serviceAccount:${serviceAccountEmail}`),
    );

    console.log("IAM policy bindings for service account:", bindings);

    const permissions: string[] = [];
    bindings.forEach((binding) => {
      if (binding.role) permissions.push(...binding.role);
    });

    console.log(`IAM permissions for ${serviceAccountEmail}:`, permissions);
  } catch (error) {
    console.error("Error fetching IAM permissions:", error);
  }
}
