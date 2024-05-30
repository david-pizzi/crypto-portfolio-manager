provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "crypto-portfolio-rg"
  location = "North Europe"
}

resource "azurerm_virtual_network" "vnet" {
  name                = "crypto-portfolio-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "crypto-portfolio-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_security_group" "nsg" {
  name                = "crypto-portfolio-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_network_security_rule" "nsg_rule" {
  name                        = "AllowSSH"
  priority                    = 1001
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "22"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  network_security_group_name = azurerm_network_security_group.nsg.name
}

resource "azurerm_container_registry" "acr" {
  name                = "cryptoportfolioacr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "crypto-portfolio-aks"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "cryptoportfolio"

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_DS2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    network_policy = "azure"
  }
}

resource "azurerm_cosmosdb_account" "cosmosdb" {
  name                = "cryptoportfoliodb"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  consistency_policy {
    consistency_level = "Session"
  }

  capabilities {
    name = "EnableServerless"
  }
}

resource "azurerm_redis_cache" "redis" {
  name                = "cryptoportfolioredis"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  capacity            = 1
  family              = "C"
  sku_name            = "Standard"
}

resource "azurerm_application_gateway" "appgw" {
  name                = "crypto-portfolio-appgw"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = "appGatewayIpConfig"
    subnet_id = azurerm_subnet.subnet.id
  }

  frontend_port {
    name = "frontendPort"
    port = 80
  }

  frontend_ip_configuration {
    name                 = "appGatewayFrontendIP"
    public_ip_address_id = azurerm_public_ip.appgw_public_ip.id
  }

  backend_address_pool {
    name = "appGatewayBackendPool"
  }

  http_listener {
    name                           = "appGatewayHttpListener"
    frontend_ip_configuration_name = "appGatewayFrontendIP"
    frontend_port_name             = "frontendPort"
    protocol                       = "Http"
  }

  url_path_map {
    name          = "appGwUrlPathMap"
    default_backend_address_pool_name = "appGatewayBackendPool"
    default_backend_http_settings_name = "appGatewayBackendHttpSettings"
    path_rule {
      name                       = "defaultRule"
      paths                      = ["/*"]
      backend_address_pool_name  = "appGatewayBackendPool"
      backend_http_settings_name = "appGatewayBackendHttpSettings"
    }
  }

  backend_http_settings {
    name                  = "appGatewayBackendHttpSettings"
    cookie_based_affinity = "Disabled"
    port                  = 80
  }
}
