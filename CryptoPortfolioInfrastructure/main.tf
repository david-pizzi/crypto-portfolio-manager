provider "azurerm" {
  features {}
}

locals {
  common_suffix              = var.common_suffix != "" ? var.common_suffix : random_string.common_suffix.result
  cosmosdb_account_name      = "cryptocdb-${local.common_suffix}"
  app_insights_name          = "cryptoinst-${local.common_suffix}"
  function_app_name          = "cryptofunc-${local.common_suffix}"
  storage_account_name       = "cryptosa${local.common_suffix}"
  cosmosdb_database_name     = "CryptoPortfolioDB"
  cosmosdb_container_portfolio_name = "Portfolios"
  cosmosdb_container_data_name      = "CryptoData"
  storage_account_website_name = "cryptoweb${local.common_suffix}"
  app_service_plan_function_name = "crypto-function-plan-${local.common_suffix}"
  app_service_plan_container_name = "cryptoappserviceplan-${local.common_suffix}"
  app_service_container_name  = "cryptoapp-${local.common_suffix}"
  container_registry_name     = "cryptoacr${local.common_suffix}"
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
  name                = local.cosmosdb_database_name
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  account_name        = azurerm_cosmosdb_account.crypto_portfolio.name
}

# Cosmos DB container for Portfolios
resource "azurerm_cosmosdb_sql_container" "crypto_portfolio_container" {
  name                = local.cosmosdb_container_portfolio_name
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  account_name        = azurerm_cosmosdb_account.crypto_portfolio.name
  database_name       = azurerm_cosmosdb_sql_database.crypto_portfolio_db.name
  partition_key_path  = "/userId"
  throughput          = 400
}

# Cosmos DB container for Crypto Data
resource "azurerm_cosmosdb_sql_container" "crypto_data_container" {
  name                = local.cosmosdb_container_data_name
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  account_name        = azurerm_cosmosdb_account.crypto_portfolio.name
  database_name       = azurerm_cosmosdb_sql_database.crypto_portfolio_db.name
  partition_key_path  = "/id"
  throughput          = 400
}

# Application Insights
resource "azurerm_application_insights" "crypto_portfolio" {
  name                = local.app_insights_name
  location            = var.location
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  application_type    = "web"
}

# Storage Account for Function App
resource "azurerm_storage_account" "crypto_function_sa" {
  name                     = local.storage_account_name
  resource_group_name      = azurerm_resource_group.crypto_portfolio.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Service Plan for Function App
resource "azurerm_service_plan" "crypto_function_plan" {
  name                = local.app_service_plan_function_name
  location            = var.location
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  os_type             = "Linux"
  sku_name            = "Y1"  # Dynamic consumption plan
}

# Linux Function App
resource "azurerm_linux_function_app" "crypto_function" {
  name                       = local.function_app_name
  location                   = var.location
  resource_group_name        = azurerm_resource_group.crypto_portfolio.name
  service_plan_id            = azurerm_service_plan.crypto_function_plan.id
  storage_account_name       = azurerm_storage_account.crypto_function_sa.name
  storage_account_access_key = azurerm_storage_account.crypto_function_sa.primary_access_key

  site_config {
    cors { 
      allowed_origins = ["*"]
    }
  }

  app_settings = {
    "FUNCTIONS_EXTENSION_VERSION"               = "~4"
    "APPINSIGHTS_INSTRUMENTATIONKEY"            = azurerm_application_insights.crypto_portfolio.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING"     = azurerm_application_insights.crypto_portfolio.connection_string
    "CosmosDBConnectionString"                  = azurerm_cosmosdb_account.crypto_portfolio.primary_readonly_sql_connection_string
    "IntervalMinutes"                           = "15"
    "WEBSITE_MAX_DYNAMIC_APPLICATION_SCALE_OUT" = 1
    "FUNCTIONS_WORKER_RUNTIME"                  = "dotnet"
    "linux_fx_version"                          = "DOTNET|6.0"
  }

  depends_on = [
    azurerm_storage_account.crypto_function_sa,
    azurerm_service_plan.crypto_function_plan
  ]
}

# Storage Account for Static Website
resource "azurerm_storage_account" "crypto_static_website_sa" {
  name                     = local.storage_account_website_name
  resource_group_name      = azurerm_resource_group.crypto_portfolio.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  static_website {
    index_document = "index.html"
    error_404_document = "index.html"
  }
}

# Random string for unique naming
resource "random_string" "common_suffix" {
  length  = 6
  special = false
  upper   = false
  numeric = true
}

# Azure Container Registry
resource "azurerm_container_registry" "crypto_portfolio" {
  name                = local.container_registry_name
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  location            = azurerm_resource_group.crypto_portfolio.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Azure App Service Plan for Containers
resource "azurerm_service_plan" "crypto_portfolio_container" {
  name                = local.app_service_plan_container_name
  location            = azurerm_resource_group.crypto_portfolio.location
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  os_type             = "Linux"
  sku_name            = "B1"
}

# Azure App Service for Containers
resource "azurerm_app_service" "crypto_portfolio_container" {
  name                = local.app_service_container_name
  location            = azurerm_resource_group.crypto_portfolio.location
  resource_group_name = azurerm_resource_group.crypto_portfolio.name
  app_service_plan_id = azurerm_service_plan.crypto_portfolio_container.id

  site_config {
    cors {
      allowed_origins = ["*"]
    }
  }
  
  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = "false"
    DOCKER_REGISTRY_SERVER_URL          = "https://${azurerm_container_registry.crypto_portfolio.login_server}"
    DOCKER_REGISTRY_SERVER_USERNAME     = azurerm_container_registry.crypto_portfolio.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD     = azurerm_container_registry.crypto_portfolio.admin_password

    # Logging
    LOGGING__LOGLEVEL__DEFAULT           = "Information"
    LOGGING__LOGLEVEL__MICROSOFT         = "Warning"
    LOGGING__LOGLEVEL__MICROSOFT_HOSTING_LIFETIME = "Information"

    # Allowed Hosts
    ALLOWEDHOSTS                         = "*"

    # Auth0
    AUTH0__DOMAIN                        = var.auth0_domain
    AUTH0__AUDIENCE                      = var.auth0_audience

    # CosmosDb
    COSMOSDB__CONNECTIONSTRING           = azurerm_cosmosdb_account.crypto_portfolio.primary_readonly_sql_connection_string
    COSMOSDB__DATABASEID                 = azurerm_cosmosdb_sql_database.crypto_portfolio_db.name
    COSMOSDB__CONTAINERID                = azurerm_cosmosdb_sql_container.crypto_portfolio_container.name

    # CORS
    CORS__ALLOWEDORIGINS                 = "*"

    # Application Insights
    APPLICATIONINSIGHTS__CONNECTIONSTRING = azurerm_application_insights.crypto_portfolio.connection_string
  }
}
