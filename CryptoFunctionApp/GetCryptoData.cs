using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using CryptoFunctionApp.Models;

namespace CryptoFunctionApp.Functions
{
    public static class GetCryptoData
    {
        private static readonly string CosmosConnectionString = Environment.GetEnvironmentVariable("CosmosDBConnectionString");
        private static readonly string DatabaseId = "CryptoPortfolioDB";
        private static readonly string ContainerId = "CryptoData";

        [FunctionName("GetCryptoData")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            var cosmosClient = new CosmosClient(CosmosConnectionString);
            var container = cosmosClient.GetContainer(DatabaseId, ContainerId);

            var query = new QueryDefinition("SELECT * FROM c ORDER BY c._ts DESC OFFSET 0 LIMIT 25");
            var iterator = container.GetItemQueryIterator<CryptoData>(query);

            var results = new List<CryptoData>();
            while (iterator.HasMoreResults)
            {
                var response = await iterator.ReadNextAsync();
                results.AddRange(response.ToList());
            }

            return new OkObjectResult(results);
        }
    }
}
