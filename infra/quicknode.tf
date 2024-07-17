provider "quicknode" {
  host  = "https://api.quicknode.com"
  token = var.quicknode_api_key
}

# Creates a new QuickAlert event listener for `ProposalCreated` events on our Governor contract on Celo Mainnet
# This event listener will then call the QuickNode destination below.
resource "quicknode_notification" "notification" {
  name    = "New Governance Proposal Created"
  network = "celo-mainnet"
  # For debugging, swap the ProposalCreated expression with the base64-encoded version of SortedOracles.report()
  # Decoded version: `tx_logs_address == '0xefb84935239dacdecf7c5ba76d8de40b077b7b33' && tx_logs_topic0 == '0x7cebb17173a9ed273d2b7538f64395c0ebf352ff743f1cf8ce66b437a6144213'`
  # expression      = "dHhfbG9nc19hZGRyZXNzID09ICcweGVmYjg0OTM1MjM5ZGFjZGVjZjdjNWJhNzZkOGRlNDBiMDc3YjdiMzMnICYmIHR4X2xvZ3NfdG9waWMwID09ICcweDdjZWJiMTcxNzNhOWVkMjczZDJiNzUzOGY2NDM5NWMwZWJmMzUyZmY3NDNmMWNmOGNlNjZiNDM3YTYxNDQyMTMn"

  # Watches for new ProposalCreated events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
  # Decoded version: `tx_logs_address == '0x47036d78bB3169b4F5560dD77BF93f4412A59852' && tx_logs_topic0 == '0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0'`
  # base64-encoded expression => https://www.quicknode.com/docs/quickalerts/rest-api/notifications/quickalerts-rest-create-notification
  expression      = "dHhfbG9nc19hZGRyZXNzID09ICcweDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTInICYmIHR4X2xvZ3NfdG9waWMwID09ICcweDdkODRhNjI2M2FlMGQ5OGQzMzI5YmQ3YjQ2YmI0ZThkNmY5OGNkMzVhN2FkYjQ1YzI3NGM4YjdmZDVlYmQ1ZTAn"
  destination_ids = [resource.quicknode_destination.destination.id]
  enabled         = true
}

# Creates a new QuickAlert destination that forwards all received `ProposalCreated` transaction receipts to our Cloud Function
resource "quicknode_destination" "destination" {
  name         = "Cloud Function"
  service      = "webhook"
  webhook_type = "POST"
  to           = google_cloudfunctions2_function.watchdog_notifications.service_config[0].uri
  # 5 is "Matched Receipts" for the smallest possible payload => https://www.quicknode.com/docs/quickalerts/quickalerts-destinations/webhooks/webhook-payload-types#5-matched-receipts
  payload_type = 5
}
