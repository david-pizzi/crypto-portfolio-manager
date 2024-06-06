using Newtonsoft.Json;

namespace CryptoPortfolioBackend.Models
{
    public class PortfolioItem
    {
        [JsonProperty("id")]
        public string? Id { get; set; }

        [JsonProperty("userId")]
        public string UserId { get; set; }  // Ensure this matches your partition key path

        [JsonProperty("cryptoName")]
        public string CryptoName { get; set; }

        [JsonProperty("amount")]
        public decimal Amount { get; set; }

        [JsonProperty("purchasePrice")]
        public decimal PurchasePrice { get; set; }
    }
}