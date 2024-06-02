terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "terraformstate"
    container_name       = "tfstate"
    key                  = "crypto-portfolio-manager/CryptoPortfolioInfrastructure.tfstate"
  }
}