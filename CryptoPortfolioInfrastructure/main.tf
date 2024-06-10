provider "azurerm" {
  features {}
}

locals {
  is_main_branch = var.branch == "main"
  common_suffix = var.common_suffix != "" ? var.common_suffix : random_string.common_suffix.result
  cosmosdb_account_name = "cryptocdb-${local.common_suffix}"
  app_insights_name = "cryptoinst-${local.common_suffix}"
  function_app_name = "cryptofunc-${local.common_suffix}"
  storage_account_name = "cryptosa${local.common_suffix}"
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

# Storage Account
resource "azurerm_storage_account" "crypto_function_sa" {
  name                     = local.storage_account_name
  resource_group_name      = azurerm_resource_group.crypto_portfolio.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# App Service Plan
resource "azurerm_app_service_plan" "crypto_function_plan" {
  name                = "crypto-function-plan-${local.common_suffix}"
  location            = var.location
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  kind                = "FunctionApp"
  reserved            = true

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

# Function App
resource "azurerm_function_app" "crypto_function" {
  name                = local.function_app_name
  location            = var.location
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  app_service_plan_id = azurerm_app_service_plan.crypto_function_plan.id
  storage_account_name = azurerm_storage_account.crypto_function_sa.name
  storage_account_access_key = azurerm_storage_account.crypto_function_sa.primary_access_key
  version             = "~3"
  os_type             = "linux"

  site_config {
    dotnet_framework_version = "v6.0"
    application_stack {
      dotnet_version = "6"
    }
  }

  app_settings = {
    "FUNCTIONS_EXTENSION_VERSION" = "~3"
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.crypto_portfolio.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.crypto_portfolio.connection_string
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
  }

  depends_on = [azurerm_storage_account.crypto_function_sa, azurerm_app_service_plan.crypto_function_plan]
}

# Random string for unique naming
resource "random_string" "common_suffix" {
  length  = 6
  special = false
  upper   = false
  numeric = true
}
