provider "azurerm" {
  features {}
}

locals {
  is_main_branch = var.branch == "main"
  common_suffix = random_string.common_suffix.result
  cosmosdb_account_name = "cryptocdb-${local.common_suffix}"
  app_insights_name = "cryptoinst-${local.common_suffix}"
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

# Cosmos DB database
resource "azurerm_cosmosdb_sql_database" "crypto_portfolio_db" {
  name                = "CryptoPortfolioDB"
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  account_name        = azurerm_cosmosdb_account.crypto_portfolio.name
}

# Cosmos DB container
resource "azurerm_cosmosdb_sql_container" "crypto_portfolio_container" {
  name                = "Portfolios"
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  account_name        = azurerm_cosmosdb_account.crypto_portfolio.name
  database_name       = azurerm_cosmosdb_sql_database.crypto_portfolio_db.name
  partition_key_path  = "/userId"
  throughput          = 400
}

# Application Insights
resource "azurerm_application_insights" "crypto_portfolio" {
  name                = local.app_insights_name
  location            = var.location
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  application_type    = "web"
}

# Random suffix for resource names to ensure uniqueness
resource "random_string" "common_suffix" {
  length  = 6
  special = false
  upper   = false
  numeric = true
}
