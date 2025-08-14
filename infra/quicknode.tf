# provider "quicknode" {
#   host  = "https://api.quicknode.com"
#   token = var.quicknode_api_key
# }

# # Creates a new QuickAlert event listener for `ProposalCreated` events on our Governor contract on Celo Mainnet
# # This event listener will then call the QuickNode destination below.
# resource "quicknode_notification" "proposal_created" {
#   name    = "New Governance Proposal Created"
#   network = "celo-mainnet"
#   # For debugging, swap the ProposalCreated expression with the base64-encoded version of SortedOracles.report()
#   # Decoded version: `tx_logs_address == '0xefb84935239dacdecf7c5ba76d8de40b077b7b33' && tx_logs_topic0 == '0x7cebb17173a9ed273d2b7538f64395c0ebf352ff743f1cf8ce66b437a6144213'`
#   # expression      = "dHhfbG9nc19hZGRyZXNzID09ICcweGVmYjg0OTM1MjM5ZGFjZGVjZjdjNWJhNzZkOGRlNDBiMDc3YjdiMzMnICYmIHR4X2xvZ3NfdG9waWMwID09ICcweDdjZWJiMTcxNzNhOWVkMjczZDJiNzUzOGY2NDM5NWMwZWJmMzUyZmY3NDNmMWNmOGNlNjZiNDM3YTYxNDQyMTMn"

#   # Watches for new ProposalCreated events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
#   # Decoded version: `tx_logs_address == '0x47036d78bB3169b4F5560dD77BF93f4412A59852' && tx_logs_topic0 == '0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c8b7fd5ebd5e0'`
#   # base64-encoded expression => https://www.quicknode.com/docs/quickalerts/rest-api/notifications/quickalerts-rest-create-notification
#   expression      = "dHhfbG9nc19hZGRyZXNzID09ICcweDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTInICYmIHR4X2xvZ3NfdG9waWMwID09ICcweDdkODRhNjI2M2FlMGQ5OGQzMzI5YmQ3YjQ2YmI0ZThkNmY5OGNkMzVhN2FkYjQ1YzI3NGM4YjdmZDVlYmQ1ZTAn"
#   destination_ids = [resource.quicknode_destination.destination.id]
#   enabled         = true
# }

# # Creates a new QuickAlert event listener for `ProposalQueued` events on our Governor contract on Celo Mainnet
# # This event listener will then call the QuickNode destination below.
# resource "quicknode_notification" "proposal_queued" {
#   name    = "Proposal Queued"
#   network = "celo-mainnet"

#   # Watches for new ProposalQueued events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
#   # Decoded version: `tx_logs_address == '0x47036d78bB3169b4F5560dD77BF93f4412A59852' && tx_logs_topic0 == '0x9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892'`
#   # base64-encoded expression => https://www.quicknode.com/docs/quickalerts/rest-api/notifications/quickalerts-rest-create-notification
#   expression      = "dHhfbG9nc19hZGRyZXNzID09ICcweDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTInICYmIHR4X2xvZ3NfdG9waWMwID09ICcweDlhMmU0MmZkNjcyMjgxM2Q2OTExM2U3ZDAwNzlkM2Q5NDAxNzE0MjhkZjczNzNkZjljN2Y3NjE3Y2ZkYTI4OTIn"
#   destination_ids = [resource.quicknode_destination.destination.id]
#   enabled         = true
# }

# # Creates a new QuickAlert event listener for `ProposalExecuted` events on our Governor contract on Celo Mainnet
# # This event listener will then call the QuickNode destination below.
# resource "quicknode_notification" "proposal_executed" {
#   name    = "Proposal Executed"
#   network = "celo-mainnet"

#   # Watches for new ProposalExecuted events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
#   # Decoded version: `tx_logs_address == '0x47036d78bB3169b4F5560dD77BF93f4412A59852' && tx_logs_topic0 == '0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f'`
#   # base64-encoded expression => https://www.quicknode.com/docs/quickalerts/rest-api/notifications/quickalerts-rest-create-notification
#   expression      = "dHhfbG9nc19hZGRyZXNzID09ICcweDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTInICYmIHR4X2xvZ3NfdG9waWMwID09ICcweDcxMmFlMTM4M2Y3OWFjODUzZjhkODgyMTUzNzc4ZTAyNjBlZjhmMDNiNTA0ZTI4NjZlMDU5M2UwNGQyYjI5MWYn"
#   destination_ids = [resource.quicknode_destination.destination.id]
#   enabled         = true
# }

# # Creates a new QuickAlert event listener for `ProposalCanceled` events on our Governor contract on Celo Mainnet
# # This event listener will then call the QuickNode destination below.
# resource "quicknode_notification" "proposal_canceled" {
#   name    = "Proposal Canceled"
#   network = "celo-mainnet"

#   # Watches for new ProposalCanceled events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
#   # Decoded version: `tx_logs_address == '0x47036d78bB3169b4F5560dD77BF93f4412A59852' && tx_logs_topic0 == '0x789cf55be980739dad1d0699b93b58e806b51c9d96619bfa8fe0a28abaa7b30c'`
#   # base64-encoded expression => https://www.quicknode.com/docs/quickalerts/rest-api/notifications/quickalerts-rest-create-notification
#   expression      = "dHhfbG9nc19hZGRyZXNzID09ICcweDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTInICYmIHR4X2xvZ3NfdG9waWMwID09ICcweDc4OWNmNTViZTk4MDczOWRhZDFkMDY5OWI5M2I1OGU4MDZiNTFjOWQ5NjYxOWJmYThmZTBhMjhhYmFhN2IzMGMn"
#   destination_ids = [resource.quicknode_destination.destination.id]
#   enabled         = true
# }

# # Creates a new QuickAlert event listener for `TimelockChange` events on our Governor contract on Celo Mainnet
# # This event listener will then call the QuickNode destination below.
# resource "quicknode_notification" "timelock_change" {
#   name    = "Timelock Change"
#   network = "celo-mainnet"

#   # Watches for new TimelockChange events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
#   # Decoded version: `tx_logs_address == '0x47036d78bB3169b4F5560dD77BF93f4412A59852' && tx_logs_topic0 == '0x08f74ea46ef7894f65eabfb5e6e695de773a000b47c529ab559178069b226401'`
#   # base64-encoded expression => https://www.quicknode.com/docs/quickalerts/rest-api/notifications/quickalerts-rest-create-notification
#   expression      = "dHhfbG9nc19hZGRyZXNzID09ICcweDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTInICYmIHR4X2xvZ3NfdG9waWMwID09ICcweDA4Zjc0ZWE0NmVmNzg5NGY2NWVhYmZiNWU2ZTY5NWRlNzczYTAwMGI0N2M1MjlhYjU1OTE3ODA2OWIyMjY0MDEn"
#   destination_ids = [resource.quicknode_destination.destination.id]
#   enabled         = true
# }

# # Creates a new QuickAlert event listener for `MedianUpdated` events on our SortedOracles contract,
# # which is used as a health check event to ensure quicknode alerts are firing.
# resource "quicknode_notification" "healthcheck" {
#   name    = "Healthcheck event"
#   network = "celo-mainnet"

#   # Decoded version: `tx_logs_address == '0xefb84935239dacdecf7c5ba76d8de40b077b7b33' && tx_logs_topic0 == '0xa9981ebfc3b766a742486e898f54959b050a66006dbce1a4155c1f84a08bcf41' && tx_logs_topic1 == '0x000000000000000000000000765de816845861e75a25fca122bb6898b8b1282a'`
#   expression      = "dHhfbG9nc19hZGRyZXNzID09ICcweGVmYjg0OTM1MjM5ZGFjZGVjZjdjNWJhNzZkOGRlNDBiMDc3YjdiMzMnICYmIHR4X2xvZ3NfdG9waWMwID09ICcweGE5OTgxZWJmYzNiNzY2YTc0MjQ4NmU4OThmNTQ5NTliMDUwYTY2MDA2ZGJjZTFhNDE1NWMxZjg0YTA4YmNmNDEnICYmIHR4X2xvZ3NfdG9waWMxID09ICcweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDc2NWRlODE2ODQ1ODYxZTc1YTI1ZmNhMTIyYmI2ODk4YjhiMTI4MmEn"
#   destination_ids = [resource.quicknode_destination.destination.id]
#   enabled         = true
# }

# # Creates a new QuickAlert destination that forwards all received transaction receipts to our Cloud Function
# resource "quicknode_destination" "destination" {
#   name         = "Cloud Function"
#   service      = "webhook"
#   webhook_type = "POST"
#   to           = google_cloudfunctions2_function.watchdog_notifications.service_config[0].uri
#   # 5 is "Matched Receipts" for the smallest possible payload => https://www.quicknode.com/docs/quickalerts/quickalerts-destinations/webhooks/webhook-payload-types#5-matched-receipts
#   payload_type = 5
# }


# 🚨 Note: The QuickNode API rejects updates to active webhooks
#
# It needs to be paused before updating. To update this webhook:
# 1. Manually pause it via QuickNode UI or by setting status to "paused" below and then running `terraform apply`
# 2. Make desired changes to Terraform config below, and reset the status to "active"
# 3. Run `terraform apply` to update and reactivate the webhook

resource "restapi_object" "quicknode_webhook_healthcheck" {
  path = "/webhooks/rest/v1/webhooks"

  # Configure update path and method according to QuickNode API
  update_path   = "/webhooks/rest/v1/webhooks/{id}"
  update_method = "PATCH"

  # Ignore server-added fields like created_at, updated_at, sequence to prevent spurious diffs and update attempts
  # QuickNode API rejects updates to active webhooks, so this avoids unnecessary failures on subsequent applies
  ignore_all_server_changes = true

  data = jsonencode({
    name            = var.quicknode_webhook_name_healthcheck
    network         = "celo-mainnet"
    filter_function = "ZnVuY3Rpb24gbWFpbihwYXlsb2FkKSB7CiAgY29uc3QgYWRkcmVzc2VzID0gbmV3IFNldChbJzB4ZWZiODQ5MzUyMzlkYWNkZWNmN2M1YmE3NmQ4ZGU0MGIwNzdiN2IzMyddKTsKICBjb25zdCBldmVudEhhc2hlcyA9IG5ldyBTZXQoWycweGE5OTgxZWJmYzNiNzY2YTc0MjQ4NmU4OThmNTQ5NTliMDUwYTY2MDA2ZGJjZTFhNDE1NWMxZjg0YTA4YmNmNDEnLCAnMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA3NjVkZTgxNjg0NTg2MWU3NWEyNWZjYTEyMmJiNjg5OGI4YjEyODJhJ10pOwogIGNvbnN0IG1hdGNoaW5nUmVjZWlwdHMgPSBbXTsKCiAgZm9yIChjb25zdCBibG9jayBvZiBwYXlsb2FkLmRhdGEpIHsKICAgIGZvciAoY29uc3QgcmVjZWlwdCBvZiBibG9jay5yZWNlaXB0cyB8fCBbXSkgewogICAgICBmb3IgKGNvbnN0IGxvZyBvZiByZWNlaXB0LmxvZ3MgfHwgW10pIHsKICAgICAgICBjb25zdCBsb2dBZGRyZXNzID0gbG9nLmFkZHJlc3M/LnRvTG93ZXJDYXNlKCk7CiAgICAgICAgY29uc3QgdG9waWMwID0gbG9nLnRvcGljcz8uWzBdPy50b0xvd2VyQ2FzZSgpOwoKICAgICAgICBjb25zdCBhZGRyZXNzTWF0Y2ggPSBhZGRyZXNzZXMuc2l6ZSA9PT0gMCB8fCBhZGRyZXNzZXMuaGFzKGxvZ0FkZHJlc3MpOwogICAgICAgIGNvbnN0IGV2ZW50TWF0Y2ggPSBldmVudEhhc2hlcy5zaXplID09PTAgfHwgKGV2ZW50SGFzaGVzLmhhcyh0b3BpYzApICYmIGV2ZW50SGFzaGVzLmhhcyh0b3BpYzApKTsKCiAgICAgICAgaWYgKGFkZHJlc3NNYXRjaCAmJiBldmVudE1hdGNoKSB7CiAgICAgICAgICBtYXRjaGluZ1JlY2VpcHRzLnB1c2gocmVjZWlwdCk7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICB9CgogIHJldHVybiBtYXRjaGluZ1JlY2VpcHRzLmxlbmd0aCA/IHsgbWF0Y2hpbmdSZWNlaXB0cyB9IDogbnVsbDsKfQ=="
    status          = "active"

    destination_attributes = {
      url            = google_cloudfunctions2_function.watchdog_notifications.service_config[0].uri
      security_token = var.quicknode_security_token
      compression    = "none"
    }
  })

  lifecycle {
    create_before_destroy = true
  }
}
