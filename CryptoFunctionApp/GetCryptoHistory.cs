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
    public static class GetCryptoHistory
    {
        private static readonly string CosmosConnectionString = Environment.GetEnvironmentVariable("CosmosDBConnectionString");
        private static readonly string DatabaseId = "CryptoPortfolioDB";
        private static readonly string ContainerId = "CryptoData";

        [FunctionName("GetCryptoHistory")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "GetCryptoHistory/{coinId}")] HttpRequest req,
            string coinId,
            ILogger log)
        {
            var cosmosClient = new CosmosClient(CosmosConnectionString);
            var container = cosmosClient.GetContainer(DatabaseId, ContainerId);

            var now = DateTime.UtcNow;
            var twentyFourHoursAgo = now.AddHours(-24);

            // Define SQL query
            var queryText = "SELECT * FROM c WHERE c.coinId = @coinId AND c.timestamp >= @twentyFourHoursAgo ORDER BY c.timestamp ASC";
            var query = new QueryDefinition(queryText)
                .WithParameter("@coinId", coinId)
                .WithParameter("@twentyFourHoursAgo", twentyFourHoursAgo);

            var iterator = container.GetItemQueryIterator<CryptoData>(query);

            var results = new List<CryptoData>();
            while (iterator.HasMoreResults)
            {
                var response = await iterator.ReadNextAsync();
                results.AddRange(response.ToList());
            }

            var jsonResponse = new OkObjectResult(results);
            req.HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*"); // Add CORS header
            return jsonResponse;
        }
    }
}
