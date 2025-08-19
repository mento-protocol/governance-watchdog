# 🚨 Note: The QuickNode API rejects updates to active webhooks
#
# It needs to be paused before updating. To update one of the below webhooks:
# 1. Manually pause it via the QuickNode Webhooks UI or by setting `status` to "paused" below and then running `terraform apply`
# 2. Make desired changes to the webhook's Terraform config below, and then reset the `status` to "active"
# 3. Run `terraform apply` to update and reactivate the webhook


# A healthcheck webhook to ensure Quicknode is operating as expected.
# We use a webhook for `MedianUpdated` events for the CELO/USD feed on our SortedOracles contract,
# Because we know with reasonable certainty that the feed will update every couple of minutes.
resource "restapi_object" "quicknode_webhook_healthcheck" {
  path = "/webhooks/rest/v1/webhooks"

  # Configure update path and method according to QuickNode API
  update_path   = "/webhooks/rest/v1/webhooks/{id}"
  update_method = "PATCH"

  # Ignore server-added fields like created_at, updated_at, sequence to prevent spurious diffs and update attempts
  # QuickNode API rejects updates to active webhooks, so this avoids unnecessary failures on subsequent applies
  ignore_all_server_changes = true

  data = jsonencode({
    name    = "healthcheck-via-sortedoracles"
    network = "celo-mainnet"
    # Base64-encoded JS filter function (for debugging, simply base64-decode it)
    filter_function = "ZnVuY3Rpb24gbWFpbihwYXlsb2FkKSB7CiAgY29uc3QgYWRkcmVzc2VzID0gbmV3IFNldChbJzB4ZWZiODQ5MzUyMzlkYWNkZWNmN2M1YmE3NmQ4ZGU0MGIwNzdiN2IzMyddKTsKICBjb25zdCBldmVudEhhc2hlcyA9IG5ldyBTZXQoWycweGE5OTgxZWJmYzNiNzY2YTc0MjQ4NmU4OThmNTQ5NTliMDUwYTY2MDA2ZGJjZTFhNDE1NWMxZjg0YTA4YmNmNDEnLCAnMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA3NjVkZTgxNjg0NTg2MWU3NWEyNWZjYTEyMmJiNjg5OGI4YjEyODJhJ10pOwogIGNvbnN0IG1hdGNoaW5nUmVjZWlwdHMgPSBbXTsKCiAgZm9yIChjb25zdCBibG9jayBvZiBwYXlsb2FkLmRhdGEpIHsKICAgIGZvciAoY29uc3QgcmVjZWlwdCBvZiBibG9jay5yZWNlaXB0cyB8fCBbXSkgewogICAgICBmb3IgKGNvbnN0IGxvZyBvZiByZWNlaXB0LmxvZ3MgfHwgW10pIHsKICAgICAgICBjb25zdCBsb2dBZGRyZXNzID0gbG9nLmFkZHJlc3M/LnRvTG93ZXJDYXNlKCk7CiAgICAgICAgY29uc3QgdG9waWMwID0gbG9nLnRvcGljcz8uWzBdPy50b0xvd2VyQ2FzZSgpOwogICAgICAgIGNvbnN0IHRvcGljMSA9IGxvZy50b3BpY3M/LlsxXT8udG9Mb3dlckNhc2UoKTsKCiAgICAgICAgY29uc3QgYWRkcmVzc01hdGNoID0gYWRkcmVzc2VzLnNpemUgPT09IDAgfHwgYWRkcmVzc2VzLmhhcyhsb2dBZGRyZXNzKTsKICAgICAgICBjb25zdCBldmVudE1hdGNoID0gZXZlbnRIYXNoZXMuc2l6ZSA9PT0gMCB8fCAoZXZlbnRIYXNoZXMuaGFzKHRvcGljMCkgJiYgZXZlbnRIYXNoZXMuaGFzKHRvcGljMSkpOwoKICAgICAgICBpZiAoYWRkcmVzc01hdGNoICYmIGV2ZW50TWF0Y2gpIHsKICAgICAgICAgIG1hdGNoaW5nUmVjZWlwdHMucHVzaChyZWNlaXB0KTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KCiAgcmV0dXJuIG1hdGNoaW5nUmVjZWlwdHMubGVuZ3RoID8geyBtYXRjaGluZ1JlY2VpcHRzIH0gOiBudWxsOwp9"
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

# Watches for new TimelockChange events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
resource "restapi_object" "quicknode_webhook_timelock_change" {
  path = "/webhooks/rest/v1/webhooks"

  # Configure update path and method according to QuickNode API
  update_path   = "/webhooks/rest/v1/webhooks/{id}"
  update_method = "PATCH"

  # Ignore server-added fields like created_at, updated_at, sequence to prevent spurious diffs and update attempts
  # QuickNode API rejects updates to active webhooks, so this avoids unnecessary failures on subsequent applies
  ignore_all_server_changes = true

  data = jsonencode({
    name    = "timelock-change"
    network = "celo-mainnet"
    # Base64-encoded JS filter function (for debugging, simply base64-decode it)
    filter_function = "ZnVuY3Rpb24gbWFpbihwYXlsb2FkKSB7CiAgLy8gT3VyIEdvdmVybm9yIGNvbnRyYWN0IGh0dHBzOi8vY2Vsb3NjYW4uaW8vYWRkcmVzcy8weDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTIKICBjb25zdCBhZGRyZXNzZXMgPSBuZXcgU2V0KFsnMHg0NzAzNmQ3OGJCMzE2OWI0RjU1NjBkRDc3QkY5M2Y0NDEyQTU5ODUyJ10pOwoKICAvLyBUaW1lbG9ja0NoYW5nZSBldmVudHMKICBjb25zdCBldmVudEhhc2hlcyA9IG5ldyBTZXQoWycweDA4Zjc0ZWE0NmVmNzg5NGY2NWVhYmZiNWU2ZTY5NWRlNzczYTAwMGI0N2M1MjlhYjU1OTE3ODA2OWIyMjY0MDEnXSk7CiAgY29uc3QgbWF0Y2hpbmdSZWNlaXB0cyA9IFtdOwoKICBmb3IgKGNvbnN0IGJsb2NrIG9mIHBheWxvYWQuZGF0YSkgewogICAgZm9yIChjb25zdCByZWNlaXB0IG9mIGJsb2NrLnJlY2VpcHRzIHx8IFtdKSB7CiAgICAgIGZvciAoY29uc3QgbG9nIG9mIHJlY2VpcHQubG9ncyB8fCBbXSkgewogICAgICAgIGNvbnN0IGxvZ0FkZHJlc3MgPSBsb2cuYWRkcmVzcz8udG9Mb3dlckNhc2UoKTsKICAgICAgICBjb25zdCB0b3BpYzAgPSBsb2cudG9waWNzPy5bMF0/LnRvTG93ZXJDYXNlKCk7CgogICAgICAgIGNvbnN0IGFkZHJlc3NNYXRjaCA9IGFkZHJlc3Nlcy5zaXplID09PSAwIHx8IGFkZHJlc3Nlcy5oYXMobG9nQWRkcmVzcyk7CiAgICAgICAgY29uc3QgZXZlbnRNYXRjaCA9IGV2ZW50SGFzaGVzLnNpemUgPT09MCB8fCBldmVudEhhc2hlcy5oYXModG9waWMwKTsKCiAgICAgICAgaWYgKGFkZHJlc3NNYXRjaCAmJiBldmVudE1hdGNoKSB7CiAgICAgICAgICBtYXRjaGluZ1JlY2VpcHRzLnB1c2gocmVjZWlwdCk7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICB9CgogIHJldHVybiBtYXRjaGluZ1JlY2VpcHRzLmxlbmd0aCA/IHsgbWF0Y2hpbmdSZWNlaXB0cyB9IDogbnVsbDsKfQ=="
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

# Watches for new ProposalCreated events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
# ProposalCreated Topic0: 0x7d84a6263ae0d98d3329b2d7b46bb4e8d6f8cd35a7adb45c274c8b7fd5ebd5e0
resource "restapi_object" "quicknode_webhook_proposal_created" {
  path = "/webhooks/rest/v1/webhooks"

  # Configure update path and method according to QuickNode API
  update_path   = "/webhooks/rest/v1/webhooks/{id}"
  update_method = "PATCH"

  # Ignore server-added fields like created_at, updated_at, sequence to prevent spurious diffs and update attempts
  # QuickNode API rejects updates to active webhooks, so this avoids unnecessary failures on subsequent applies
  ignore_all_server_changes = true

  data = jsonencode({
    name    = "proposal-created"
    network = "celo-mainnet"
    # Base64-encoded JS filter function (for debugging, simply base64-decode it)
    filter_function = "ZnVuY3Rpb24gbWFpbihwYXlsb2FkKSB7CiAgLy8gT3VyIEdvdmVybm9yIGNvbnRyYWN0IGh0dHBzOi8vY2Vsb3NjYW4uaW8vYWRkcmVzcy8weDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTIKICBjb25zdCBhZGRyZXNzZXMgPSBuZXcgU2V0KFsnMHg0NzAzNmQ3OGJCMzE2OWI0RjU1NjBkRDc3QkY5M2Y0NDEyQTU5ODUyJ10pOwoKICAvLyBQcm9wb3NhbENyZWF0ZWQgZXZlbnRzCiAgY29uc3QgZXZlbnRIYXNoZXMgPSBuZXcgU2V0KFsnMHg3ZDg0YTYyNjNhZTBkOThkMzMyOWJkN2I0NmJiNGU4ZDZmOThjZDM1YTdhZGI0NWMyNzRjOGI3ZmQ1ZWJkNWUwJ10pOwogIGNvbnN0IG1hdGNoaW5nUmVjZWlwdHMgPSBbXTsKCiAgZm9yIChjb25zdCBibG9jayBvZiBwYXlsb2FkLmRhdGEpIHsKICAgIGZvciAoY29uc3QgcmVjZWlwdCBvZiBibG9jay5yZWNlaXB0cyB8fCBbXSkgewogICAgICBmb3IgKGNvbnN0IGxvZyBvZiByZWNlaXB0LmxvZ3MgfHwgW10pIHsKICAgICAgICBjb25zdCBsb2dBZGRyZXNzID0gbG9nLmFkZHJlc3M/LnRvTG93ZXJDYXNlKCk7CiAgICAgICAgY29uc3QgdG9waWMwID0gbG9nLnRvcGljcz8uWzBdPy50b0xvd2VyQ2FzZSgpOwoKICAgICAgICBjb25zdCBhZGRyZXNzTWF0Y2ggPSBhZGRyZXNzZXMuc2l6ZSA9PT0gMCB8fCBhZGRyZXNzZXMuaGFzKGxvZ0FkZHJlc3MpOwogICAgICAgIGNvbnN0IGV2ZW50TWF0Y2ggPSBldmVudEhhc2hlcy5zaXplID09PTAgfHwgZXZlbnRIYXNoZXMuaGFzKHRvcGljMCk7CgogICAgICAgIGlmIChhZGRyZXNzTWF0Y2ggJiYgZXZlbnRNYXRjaCkgewogICAgICAgICAgbWF0Y2hpbmdSZWNlaXB0cy5wdXNoKHJlY2VpcHQpOwogICAgICAgICAgYnJlYWs7CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgfQoKICByZXR1cm4gbWF0Y2hpbmdSZWNlaXB0cy5sZW5ndGggPyB7IG1hdGNoaW5nUmVjZWlwdHMgfSA6IG51bGw7Cn0="
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

# Watches for new ProposalQueued events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
# ProposalQueued Topic0: 0x9a2e42fd6722813d69113e7d0079d3d940171428df7373df9c7f7617cfda2892
resource "restapi_object" "quicknode_webhook_proposal_queued" {
  path = "/webhooks/rest/v1/webhooks"

  # Configure update path and method according to QuickNode API
  update_path   = "/webhooks/rest/v1/webhooks/{id}"
  update_method = "PATCH"

  # Ignore server-added fields like created_at, updated_at, sequence to prevent spurious diffs and update attempts
  # QuickNode API rejects updates to active webhooks, so this avoids unnecessary failures on subsequent applies
  ignore_all_server_changes = true

  data = jsonencode({
    name    = "proposal-queued"
    network = "celo-mainnet"
    # Base64-encoded JS filter function (for debugging, simply base64-decode it)
    filter_function = "ZnVuY3Rpb24gbWFpbihwYXlsb2FkKSB7CiAgLy8gT3VyIEdvdmVybm9yIGNvbnRyYWN0IGh0dHBzOi8vY2Vsb3NjYW4uaW8vYWRkcmVzcy8weDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTIKICBjb25zdCBhZGRyZXNzZXMgPSBuZXcgU2V0KFsnMHg0NzAzNmQ3OGJCMzE2OWI0RjU1NjBkRDc3QkY5M2Y0NDEyQTU5ODUyJ10pOwoKICAvLyBQcm9wb3NhbFF1ZXVlZCBldmVudHMKICBjb25zdCBldmVudEhhc2hlcyA9IG5ldyBTZXQoWycweDlhMmU0MmZkNjcyMjgxM2Q2OTExM2U3ZDAwNzlkM2Q5NDAxNzE0MjhkZjczNzNkZjljN2Y3NjE3Y2ZkYTI4OTInXSk7CiAgY29uc3QgbWF0Y2hpbmdSZWNlaXB0cyA9IFtdOwoKICBmb3IgKGNvbnN0IGJsb2NrIG9mIHBheWxvYWQuZGF0YSkgewogICAgZm9yIChjb25zdCByZWNlaXB0IG9mIGJsb2NrLnJlY2VpcHRzIHx8IFtdKSB7CiAgICAgIGZvciAoY29uc3QgbG9nIG9mIHJlY2VpcHQubG9ncyB8fCBbXSkgewogICAgICAgIGNvbnN0IGxvZ0FkZHJlc3MgPSBsb2cuYWRkcmVzcz8udG9Mb3dlckNhc2UoKTsKICAgICAgICBjb25zdCB0b3BpYzAgPSBsb2cudG9waWNzPy5bMF0/LnRvTG93ZXJDYXNlKCk7CgogICAgICAgIGNvbnN0IGFkZHJlc3NNYXRjaCA9IGFkZHJlc3Nlcy5zaXplID09PSAwIHx8IGFkZHJlc3Nlcy5oYXMobG9nQWRkcmVzcyk7CiAgICAgICAgY29uc3QgZXZlbnRNYXRjaCA9IGV2ZW50SGFzaGVzLnNpemUgPT09MCB8fCBldmVudEhhc2hlcy5oYXModG9waWMwKTsKCiAgICAgICAgaWYgKGFkZHJlc3NNYXRjaCAmJiBldmVudE1hdGNoKSB7CiAgICAgICAgICBtYXRjaGluZ1JlY2VpcHRzLnB1c2gocmVjZWlwdCk7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICB9CgogIHJldHVybiBtYXRjaGluZ1JlY2VpcHRzLmxlbmd0aCA/IHsgbWF0Y2hpbmdSZWNlaXB0cyB9IDogbnVsbDsKfQ=="
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

# Watches for new ProposalExecuted events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
resource "restapi_object" "quicknode_webhook_proposal_executed" {
  path = "/webhooks/rest/v1/webhooks"

  # Configure update path and method according to QuickNode API
  update_path   = "/webhooks/rest/v1/webhooks/{id}"
  update_method = "PATCH"

  # Ignore server-added fields like created_at, updated_at, sequence to prevent spurious diffs and update attempts
  # QuickNode API rejects updates to active webhooks, so this avoids unnecessary failures on subsequent applies
  ignore_all_server_changes = true

  data = jsonencode({
    name    = "proposal-executed"
    network = "celo-mainnet"
    # Base64-encoded JS filter function (for debugging, simply base64-decode it)
    filter_function = "ZnVuY3Rpb24gbWFpbihwYXlsb2FkKSB7CiAgLy8gT3VyIEdvdmVybm9yIGNvbnRyYWN0IGh0dHBzOi8vY2Vsb3NjYW4uaW8vYWRkcmVzcy8weDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTIKICBjb25zdCBhZGRyZXNzZXMgPSBuZXcgU2V0KFsnMHg0NzAzNmQ3OGJCMzE2OWI0RjU1NjBkRDc3QkY5M2Y0NDEyQTU5ODUyJ10pOwoKICAvLyBQcm9wb3NhbEV4ZWN1dGVkIGV2ZW50cwogIGNvbnN0IGV2ZW50SGFzaGVzID0gbmV3IFNldChbJyAweDcxMmFlMTM4M2Y3OWFjODUzZjhkODgyMTUzNzc4ZTAyNjBlZjhmMDNiNTA0ZTI4NjZlMDU5M2UwNGQyYjI5MWYnXSk7CiAgY29uc3QgbWF0Y2hpbmdSZWNlaXB0cyA9IFtdOwoKICBmb3IgKGNvbnN0IGJsb2NrIG9mIHBheWxvYWQuZGF0YSkgewogICAgZm9yIChjb25zdCByZWNlaXB0IG9mIGJsb2NrLnJlY2VpcHRzIHx8IFtdKSB7CiAgICAgIGZvciAoY29uc3QgbG9nIG9mIHJlY2VpcHQubG9ncyB8fCBbXSkgewogICAgICAgIGNvbnN0IGxvZ0FkZHJlc3MgPSBsb2cuYWRkcmVzcz8udG9Mb3dlckNhc2UoKTsKICAgICAgICBjb25zdCB0b3BpYzAgPSBsb2cudG9waWNzPy5bMF0/LnRvTG93ZXJDYXNlKCk7CgogICAgICAgIGNvbnN0IGFkZHJlc3NNYXRjaCA9IGFkZHJlc3Nlcy5zaXplID09PSAwIHx8IGFkZHJlc3Nlcy5oYXMobG9nQWRkcmVzcyk7CiAgICAgICAgY29uc3QgZXZlbnRNYXRjaCA9IGV2ZW50SGFzaGVzLnNpemUgPT09MCB8fCBldmVudEhhc2hlcy5oYXModG9waWMwKTsKCiAgICAgICAgaWYgKGFkZHJlc3NNYXRjaCAmJiBldmVudE1hdGNoKSB7CiAgICAgICAgICBtYXRjaGluZ1JlY2VpcHRzLnB1c2gocmVjZWlwdCk7CiAgICAgICAgICBicmVhazsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICB9CgogIHJldHVybiBtYXRjaGluZ1JlY2VpcHRzLmxlbmd0aCA/IHsgbWF0Y2hpbmdSZWNlaXB0cyB9IDogbnVsbDsKfQ=="
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

# Watches for new ProposalCanceled events on the Governor contract https://celoscan.io/address/0x47036d78bB3169b4F5560dD77BF93f4412A59852
resource "restapi_object" "quicknode_webhook_proposal_canceled" {
  path = "/webhooks/rest/v1/webhooks"

  # Configure update path and method according to QuickNode API
  update_path   = "/webhooks/rest/v1/webhooks/{id}"
  update_method = "PATCH"

  # Ignore server-added fields like created_at, updated_at, sequence to prevent spurious diffs and update attempts
  # QuickNode API rejects updates to active webhooks, so this avoids unnecessary failures on subsequent applies
  ignore_all_server_changes = true

  data = jsonencode({
    name    = "proposal-canceled"
    network = "celo-mainnet"
    # Base64-encoded JS filter function (for debugging, simply base64-decode it)
    filter_function = "ZnVuY3Rpb24gbWFpbihwYXlsb2FkKSB7CiAgLy8gT3VyIEdvdmVybm9yIGNvbnRyYWN0IGh0dHBzOi8vY2Vsb3NjYW4uaW8vYWRkcmVzcy8weDQ3MDM2ZDc4YkIzMTY5YjRGNTU2MGRENzdCRjkzZjQ0MTJBNTk4NTIKICBjb25zdCBhZGRyZXNzZXMgPSBuZXcgU2V0KFsnMHg0NzAzNmQ3OGJCMzE2OWI0RjU1NjBkRDc3QkY5M2Y0NDEyQTU5ODUyJ10pOwoKICAvLyBQcm9wb3NhbENhbmNlbGVkIGV2ZW50cwogIGNvbnN0IGV2ZW50SGFzaGVzID0gbmV3IFNldChbJzB4Nzg5Y2Y1NWJlOTgwNzM5ZGFkMWQwNjk5YjkzYjU4ZTgwNmI1MWM5ZDk2NjE5YmZhOGZlMGEyOGFiYWE3YjMwYyddKTsKICBjb25zdCBtYXRjaGluZ1JlY2VpcHRzID0gW107CgogIGZvciAoY29uc3QgYmxvY2sgb2YgcGF5bG9hZC5kYXRhKSB7CiAgICBmb3IgKGNvbnN0IHJlY2VpcHQgb2YgYmxvY2sucmVjZWlwdHMgfHwgW10pIHsKICAgICAgZm9yIChjb25zdCBsb2cgb2YgcmVjZWlwdC5sb2dzIHx8IFtdKSB7CiAgICAgICAgY29uc3QgbG9nQWRkcmVzcyA9IGxvZy5hZGRyZXNzPy50b0xvd2VyQ2FzZSgpOwogICAgICAgIGNvbnN0IHRvcGljMCA9IGxvZy50b3BpY3M/LlswXT8udG9Mb3dlckNhc2UoKTsKCiAgICAgICAgY29uc3QgYWRkcmVzc01hdGNoID0gYWRkcmVzc2VzLnNpemUgPT09IDAgfHwgYWRkcmVzc2VzLmhhcyhsb2dBZGRyZXNzKTsKICAgICAgICBjb25zdCBldmVudE1hdGNoID0gZXZlbnRIYXNoZXMuc2l6ZSA9PT0wIHx8IGV2ZW50SGFzaGVzLmhhcyh0b3BpYzApOwoKICAgICAgICBpZiAoYWRkcmVzc01hdGNoICYmIGV2ZW50TWF0Y2gpIHsKICAgICAgICAgIG1hdGNoaW5nUmVjZWlwdHMucHVzaChyZWNlaXB0KTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KCiAgcmV0dXJuIG1hdGNoaW5nUmVjZWlwdHMubGVuZ3RoID8geyBtYXRjaGluZ1JlY2VpcHRzIH0gOiBudWxsOwp9"
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
