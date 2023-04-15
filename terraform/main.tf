terraform {
  cloud {
    organization = "bgdtc" # your terraform cloud organization
    workspaces {
      name       = "justify-me" # your terraform workspace
    }
  }
}