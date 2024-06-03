terraform {
  backend "azurerm" {
    resource_group_name   = "terraform-state-rg"
    storage_account_name  = "terraformstatedp1456"
    container_name        = "terraform-state"
    key                   = "terraform.tfstate"
  }
}
