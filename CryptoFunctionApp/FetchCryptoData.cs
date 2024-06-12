using System;
using System.Collections.Generic;
using System.Linq;
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
        private static readonly int IntervalMinutes = int.TryParse(Environment.GetEnvironmentVariable("IntervalMinutes"), out var interval) ? interval : 15;

        [FunctionName("FetchCryptoData")]
        public static async Task Run([TimerTrigger("* */15 * * * *")] TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
            log.LogInformation($"Interval set to: {IntervalMinutes} minutes");

            var cosmosClient = new CosmosClient(CosmosConnectionString);
            var container = cosmosClient.GetContainer(DatabaseId, ContainerId);

            var response = await httpClient.GetAsync(CryptoCompareApiUrl);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                log.LogError($"Error fetching data: {response.StatusCode} - {response.ReasonPhrase}. Content: {errorContent}");
                return;
            }

            var content = await response.Content.ReadAsStringAsync();
            var cryptoCompareResponse = JsonConvert.DeserializeObject<CryptoCompareResponse>(content);

            foreach (var element in cryptoCompareResponse.Data)
            {
                var coinId = element.CoinInfo.Id;
                log.LogInformation($"Processing coin: {coinId}");

                try
                {
                    // Use LINQ to get the most recent entry for the current coin
                    var latestCryptoData = container.GetItemLinqQueryable<CryptoData>(true)
                        .Where(c => c.CoinId == coinId)
                        .OrderByDescending(c => c.Timestamp)
                        .AsEnumerable()
                        .FirstOrDefault();

                    if (latestCryptoData != null)
                    {
                        log.LogInformation($"Latest entry for {coinId} found with timestamp: {latestCryptoData.Timestamp}");

                        if ((DateTime.UtcNow - latestCryptoData.Timestamp).TotalMinutes < IntervalMinutes)
                        {
                            log.LogInformation($"Skipping entry for {coinId} as the last entry is within {IntervalMinutes} minutes.");
                            continue;
                        }
                    }
                    else
                    {
                        log.LogInformation($"No previous entry found for {coinId}");
                    }

                    var now = DateTime.UtcNow;
                    var id = $"{coinId}_{now:yyyyMMddHHmm}";
                    var cryptoData = new CryptoData
                    {
                        Id = id,
                        CoinId = coinId,
                        Name = element.CoinInfo.Name,
                        Symbol = element.CoinInfo.FullName,
                        Price = element.Raw.Gbp.Price,
                        Timestamp = now
                    };

                    log.LogInformation($"Attempting to upsert item with ID: {id}");
                    await container.UpsertItemAsync(cryptoData, new PartitionKey(id));
                }
                catch (CosmosException ex)
                {
                    log.LogError($"CosmosException during query: {ex.StatusCode} - {ex.Message}");
                }
                catch (Exception ex)
                {
                    log.LogError($"Exception: {ex.Message}");
                }
            }

            log.LogInformation($"Data fetched and stored at: {DateTime.UtcNow}");
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
