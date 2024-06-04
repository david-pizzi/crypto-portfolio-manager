using CryptoPortfolioBackend.Models;
using CryptoPortfolioBackend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CryptoPortfolioBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PortfolioController : ControllerBase
    {
        private readonly CosmosDbService _cosmosDbService;

        public PortfolioController(CosmosDbService cosmosDbService)
        {
            _cosmosDbService = cosmosDbService;
        }

        [HttpGet]
        public async Task<IEnumerable<PortfolioItem>> Get()
        {
            return await _cosmosDbService.GetItemsAsync("SELECT * FROM c");
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PortfolioItem>> Get(string id)
        {
            var item = await _cosmosDbService.GetItemAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PortfolioItem item)
        {
            item.Id = Guid.NewGuid().ToString();
            await _cosmosDbService.AddItemAsync(item);
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] PortfolioItem item)
        {
            var existingItem = await _cosmosDbService.GetItemAsync(id);
            if (existingItem == null)
            {
                return NotFound();
            }

            item.Id = id;
            await _cosmosDbService.UpdateItemAsync(id, item);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var item = await _cosmosDbService.GetItemAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            await _cosmosDbService.DeleteItemAsync(id);
            return NoContent();
        }
    }
}
