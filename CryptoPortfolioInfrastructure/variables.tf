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

variable "storage_account_name" {
   description = "The name of the storage account"
  type        = string
  default     = "cryptostr1578"   
}