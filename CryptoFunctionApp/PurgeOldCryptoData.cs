using System;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace CryptoFunctionApp.Functions
{
    public static class PurgeOldCryptoData
    {
        private static readonly string CosmosConnectionString = Environment.GetEnvironmentVariable("CosmosDBConnectionString");
        private static readonly string DatabaseId = "CryptoPortfolioDB";
        private static readonly string ContainerId = "CryptoData";

        [FunctionName("PurgeOldCryptoData")]
        public static async Task Run([TimerTrigger("0 0 0 * * *")] TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

            var cosmosClient = new CosmosClient(CosmosConnectionString);
            var container = cosmosClient.GetContainer(DatabaseId, ContainerId);

            var query = new QueryDefinition("SELECT c.id, c.coinId FROM c WHERE c.timestamp < @purgeDate")
                .WithParameter("@purgeDate", DateTime.UtcNow.AddDays(-7));
            var iterator = container.GetItemQueryIterator<dynamic>(query);

            while (iterator.HasMoreResults)
            {
                var response = await iterator.ReadNextAsync();
                foreach (var item in response)
                {
                    await container.DeleteItemAsync<dynamic>(item.id.ToString(), new PartitionKey(item.id.ToString()));
                }
            }

            log.LogInformation($"Data purged at: {DateTime.Now}");
        }
    }
}
