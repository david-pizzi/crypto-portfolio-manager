provider "azurerm" {
  features {}
}

locals {
  is_main_branch = var.branch == "main"
}

# Resource group
resource "azurerm_resource_group" "crypto_portfolio" {
  count    = local.is_main_branch ? 1 : 0
  name     = var.resource_group_name
  location = var.location
}

# Cosmos DB account
resource "azurerm_cosmosdb_account" "crypto_portfolio" {
  name                = "crypto-portfolio-cosmosdb-account"
  location            = var.location
  resource_group_name = local.is_main_branch ? azurerm_resource_group.crypto_portfolio[0].name : "local-rg"
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

# Storage account
resource "azurerm_storage_account" "crypto_portfolio" {
  count                   = local.is_main_branch ? 1 : 0
  name                    = var.storage_account_name
  resource_group_name     = azurerm_resource_group.crypto_portfolio[0].name
  location                = azurerm_resource_group.crypto_portfolio[0].location
  account_tier            = "Standard"
  account_replication_type = "LRS"
}

# App Service Plan with consumption tier
resource "azurerm_app_service_plan" "crypto_portfolio" {
  count                = local.is_main_branch ? 1 : 0
  name                 = "crypto-portfolio-appserviceplan"
  location             = azurerm_resource_group.crypto_portfolio[0].location
  resource_group_name  = azurerm_resource_group.crypto_portfolio[0].name
  kind                 = "FunctionApp"
  reserved             = false
  sku {
    tier     = "Consumption"
    size     = "Y1"
  }
}

# App Service
resource "azurerm_app_service" "crypto_portfolio" {
  count                = local.is_main_branch ? 1 : 0
  name                 = "crypto-portfolio-appservice"
  location             = azurerm_resource_group.crypto_portfolio[0].location
  resource_group_name  = azurerm_resource_group.crypto_portfolio[0].name
  app_service_plan_id  = azurerm_app_service_plan.crypto_portfolio[0].id
  site_config {
    always_on = false
  }
}
