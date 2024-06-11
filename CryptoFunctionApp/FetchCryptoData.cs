using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using CryptoFunctionApp.Models;

namespace CryptoFunctionApp.Functions
{
    public static class FetchCryptoData
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private static readonly string CryptoCompareApiUrl = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=25&tsym=GBP";
        private static readonly string CosmosConnectionString = Environment.GetEnvironmentVariable("CosmosDBConnectionString");
        private static readonly string DatabaseId = "CryptoPortfolioDB";
        private static readonly string ContainerId = "CryptoData";

        [FunctionName("FetchCryptoData")]
        public static async Task Run([TimerTrigger("* */15 * * * *")] TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

            var cosmosClient = new CosmosClient(CosmosConnectionString);
            var database = await cosmosClient.CreateDatabaseIfNotExistsAsync(DatabaseId);
            var container = await database.Database.CreateContainerIfNotExistsAsync(ContainerId, "/id");

            try
            {
                var response = await httpClient.GetAsync(CryptoCompareApiUrl);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var cryptoCompareResponse = JsonConvert.DeserializeObject<CryptoCompareResponse>(content);
                    var cryptoList = new List<CryptoData>();

                    foreach (var element in cryptoCompareResponse.Data)
                    {
                        var id = $"{element.CoinInfo.Id}_{DateTime.UtcNow:yyyyMMddHHmmss}";
                        var cryptoData = new CryptoData
                        {
                            Id = id,
                            CoinId = element.CoinInfo.Id,
                            Name = element.CoinInfo.Name,
                            Symbol = element.CoinInfo.FullName,
                            Price = element.Raw.Gbp.Price,
                            Timestamp = DateTime.UtcNow
                        };

                        cryptoList.Add(cryptoData);
                        log.LogInformation($"Attempting to upsert item with ID: {id}");
                        await container.Container.UpsertItemAsync(cryptoData, new PartitionKey(id));
                    }

                    log.LogInformation($"Data fetched and stored at: {DateTime.Now}");
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    log.LogError($"Error fetching data: {response.StatusCode} - {response.ReasonPhrase}. Content: {errorContent}");
                }
            }
            catch (CosmosException ex)
            {
                log.LogError($"CosmosException: {ex.StatusCode} - {ex.Message}");
            }
            catch (Exception ex)
            {
                log.LogError($"Exception: {ex.Message}");
            }
        }

        public class CryptoCompareResponse
        {
            public List<CryptoCompareData> Data { get; set; }
        }

        public class CryptoCompareData
        {
            public CryptoCompareCoinInfo CoinInfo { get; set; }
            public CryptoCompareRaw Raw { get; set; }
        }

        public class CryptoCompareCoinInfo
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public string FullName { get; set; }
        }

        public class CryptoCompareRaw
        {
            [JsonProperty("GBP")]
            public CryptoCompareGbp Gbp { get; set; }
        }

        public class CryptoCompareGbp
        {
            public decimal Price { get; set; }
        }
    }
}
