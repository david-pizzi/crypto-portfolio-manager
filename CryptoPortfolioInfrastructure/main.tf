provider "azurerm" {
  features {}
}

locals {
  is_main_branch = var.branch == "main"
  # Shortened base name with random suffix for uniqueness
  cosmosdb_account_name = "cryptocdb-${random_string.cosmosdb_suffix.result}"
}

# Resource group
resource "azurerm_resource_group" "crypto_portfolio" {
  name     = var.resource_group_name
  location = var.location
}

# Cosmos DB account
resource "azurerm_cosmosdb_account" "crypto_portfolio" {
  name                = local.cosmosdb_account_name
  location            = var.location
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 10
    max_staleness_prefix    = 200
  }
  geo_location {
    location          = var.location
    failover_priority = 0
  }
}

# Random suffix for Cosmos DB account name to ensure uniqueness
resource "random_string" "cosmosdb_suffix" {
  length  = 6
  special = false
  upper   = false
  numeric  = true
}
