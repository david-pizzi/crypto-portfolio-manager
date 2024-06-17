variable "branch" {
  description = "The current Git branch."
  type        = string
  default     = "development"
}

variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "crypto-portfolio-rg"
}

variable "location" {
  description = "The Azure region to deploy resources"
  type        = string
  default     = "UK South"
}

variable "common_suffix" {
  description = "The common suffix to be used. If not provided, a random string will be used."
  type        = string
  default     = "7h9eax"
}

variable "auth0_domain" {
  description = "The Auth0 domain"
  type        = string
}

variable "auth0_audience" {
  description = "The Auth0 audience"
  type        = string
}
