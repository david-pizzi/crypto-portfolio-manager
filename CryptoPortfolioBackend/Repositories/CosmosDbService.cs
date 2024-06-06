using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CryptoPortfolioBackend.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace CryptoPortfolioBackend.Repositories
{
    public class CosmosDbService
    {
        private readonly Container _container;
        private readonly ILogger<CosmosDbService> _logger;

        public CosmosDbService(CosmosClient dbClient, string databaseId, string containerId, ILogger<CosmosDbService> logger)
        {
            _container = dbClient.GetContainer(databaseId, containerId);
            _logger = logger;
        }

        public async Task AddItemAsync(PortfolioItem item, string partitionKey)
        {
            var json = JsonConvert.SerializeObject(item);
            _logger.LogInformation("Adding item: {Json}", json);
            await _container.CreateItemAsync(item, new PartitionKey(partitionKey));
        }

        public async Task DeleteItemAsync(string id, string partitionKey)
        {
            await _container.DeleteItemAsync<PortfolioItem>(id, new PartitionKey(partitionKey));
        }

        public async Task<PortfolioItem> GetItemAsync(string id, string partitionKey)
        {
            try
            {
                ItemResponse<PortfolioItem> response = await _container.ReadItemAsync<PortfolioItem>(id, new PartitionKey(partitionKey));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<IEnumerable<PortfolioItem>> GetItemsAsync(string queryString)
        {
            var query = _container.GetItemQueryIterator<PortfolioItem>(new QueryDefinition(queryString));
            List<PortfolioItem> results = new List<PortfolioItem>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }
            return results;
        }

        public async Task UpdateItemAsync(string id, PortfolioItem item, string partitionKey)
        {
            await _container.UpsertItemAsync(item, new PartitionKey(partitionKey));
        }
    }
}
