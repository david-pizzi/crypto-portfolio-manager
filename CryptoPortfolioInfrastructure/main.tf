provider "azurerm" {
  features {}
}

locals {
  is_main_branch = var.branch == "main"
}

# Resource group
resource "azurerm_resource_group" "crypto_portfolio" {
  name     = var.resource_group_name
  location = var.location
}

# Cosmos DB account
resource "azurerm_cosmosdb_account" "crypto_portfolio" {
  name                = "crypto-portfolio-cosmosdb-account"
  location            = var.location
  resource_group_name = var.resource_group_name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  consistency_policy {
    consistency_level = "BoundedStaleness"
    max_interval_in_seconds = 10
    max_staleness_prefix = 200
  }
  geo_location {
    location          = var.location
    failover_priority = 0
  }
}

# Additional resources (only deployed if main branch)
