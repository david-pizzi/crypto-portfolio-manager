using Newtonsoft.Json;
using System;

namespace CryptoFunctionApp.Models
{
    public class CryptoData
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("coinId")]
        public string CoinId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("symbol")]
        public string Symbol { get; set; }

        [JsonProperty("price")]
        public decimal Price { get; set; }

        [JsonProperty("timestamp")]
        public DateTime Timestamp { get; set; }
    }
}
