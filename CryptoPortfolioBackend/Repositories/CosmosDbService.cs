using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CryptoPortfolioBackend.Models;
using Microsoft.Azure.Cosmos;

namespace CryptoPortfolioBackend.Repositories
{
    public class CosmosDbService
    {
        private readonly Container _container;

        public CosmosDbService(CosmosClient dbClient, string databaseId, string containerId)
        {
            _container = dbClient.GetContainer(databaseId, containerId);
        }

        public async Task AddItemAsync(PortfolioItem item)
        {
            await _container.CreateItemAsync(item, new PartitionKey(item.Id));
        }

        public async Task DeleteItemAsync(string id)
        {
            await _container.DeleteItemAsync<PortfolioItem>(id, new PartitionKey(id));
        }

        public async Task<PortfolioItem> GetItemAsync(string id)
        {
            try
            {
                ItemResponse<PortfolioItem> response = await _container.ReadItemAsync<PortfolioItem>(id, new PartitionKey(id));
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

        public async Task UpdateItemAsync(string id, PortfolioItem item)
        {
            await _container.UpsertItemAsync(item, new PartitionKey(id));
        }
    }
}
