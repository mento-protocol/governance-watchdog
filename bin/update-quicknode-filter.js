#!/usr/bin/env node

/**
 * Script to update QuickNode filter function in Terraform configuration
 * This script reads the sorted-oracles.js file, base64 encodes it, and updates quicknode.tf
 */

const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

// Get script directory and project root
const scriptDir = __dirname;
const projectRoot = path.dirname(scriptDir);

// File paths
const sortedOraclesJs = path.join(
  projectRoot,
  "infra",
  "quicknode-filter-functions",
  "sorted-oracles.js",
);
const quicknodeTf = path.join(projectRoot, "infra", "quicknode.tf");

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function main() {
  try {
    log("🔄 Updating QuickNode filter function...", "yellow");

    // Check if source file exists
    if (!fs.existsSync(sortedOraclesJs)) {
      log(`❌ Error: Source file not found: ${sortedOraclesJs}`, "red");
      process.exit(1);
    }

    // Check if target file exists
    if (!fs.existsSync(quicknodeTf)) {
      log(`❌ Error: Target file not found: ${quicknodeTf}`, "red");
      process.exit(1);
    }

    // Read the JavaScript file
    log("📖 Reading sorted-oracles.js...", "yellow");
    const jsContent = fs.readFileSync(sortedOraclesJs, "utf8");

    // Base64 encode the content
    log("📝 Base64 encoding sorted-oracles.js...", "yellow");
    const base64Encoded = Buffer.from(jsContent, "utf8").toString("base64");

    if (!base64Encoded) {
      log("❌ Error: Failed to base64 encode the file", "red");
      process.exit(1);
    }

    log(`✅ Successfully encoded ${jsContent.length} bytes`, "green");

    // Create a backup of the original file
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);
    const backupFile = `${quicknodeTf}.backup.${timestamp}`;
    fs.copyFileSync(quicknodeTf, backupFile);
    log(`💾 Created backup: ${backupFile}`, "yellow");

    // Read the Terraform file
    log("🔧 Updating quicknode.tf...", "yellow");
    const tfContent = fs.readFileSync(quicknodeTf, "utf8");

    // Find the quicknode_webhook_healthcheck resource block and update only its filter_function
    // This regex matches the entire resource block and captures the filter_function within it
    const resourceRegex =
      /(resource\s+"restapi_object"\s+"quicknode_webhook_healthcheck"\s*\{[\s\S]*?filter_function\s*=\s*)"[^"]*"([\s\S]*?\n\})/;

    const match = tfContent.match(resourceRegex);
    if (!match) {
      log(
        '❌ Error: Could not find resource "restapi_object" "quicknode_webhook_healthcheck" with filter_function in quicknode.tf',
        "red",
      );
      log(
        "💡 Tip: Make sure the resource block exists and is not commented out",
        "yellow",
      );
      process.exit(1);
    }

    // Replace only the filter_function in the healthcheck resource
    const updatedContent = tfContent.replace(
      resourceRegex,
      `$1"${base64Encoded}"$2`,
    );

    // Verify the replacement was successful
    if (!updatedContent.includes(`filter_function = "${base64Encoded}"`)) {
      log(
        "❌ Error: Failed to update the filter_function in quicknode.tf",
        "red",
      );
      process.exit(1);
    }

    // Write the updated content back to the file
    fs.writeFileSync(quicknodeTf, updatedContent, "utf8");
    log("✅ Successfully updated quicknode.tf", "green");

    // Show a summary
    log("\n🎉 Update completed successfully!", "green");
    log("📋 Summary:", "yellow");
    log(`  • Source file: ${sortedOraclesJs}`);
    log(`  • Target file: ${quicknodeTf}`);
    log(`  • Backup created: ${backupFile}`);
    log(`  • Encoded size: ${base64Encoded.length} characters`);

    // Show the first few characters of the encoded string for verification
    log("\n🔍 Encoded string preview (first 50 chars):", "yellow");
    log(`  ${base64Encoded.substring(0, 50)}...`);

    log("\n💡 Next steps:", "yellow");
    log(`  • Review the changes: git diff ${quicknodeTf}`);
    log(
      "  • Apply with Terraform: cd infra && terraform plan && terraform apply",
    );
    log(
      "  • Remember to pause the webhook before updating (see comments in quicknode.tf)",
    );
  } catch (error) {
    log(`❌ Error: ${error.message}`, "red");
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
