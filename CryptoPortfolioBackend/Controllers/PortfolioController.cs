using CryptoPortfolioBackend.Models;
using CryptoPortfolioBackend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CryptoPortfolioBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PortfolioController : ControllerBase
    {
        private readonly CosmosDbService _cosmosDbService;
        private readonly ILogger<PortfolioController> _logger;

        public PortfolioController(CosmosDbService cosmosDbService, ILogger<PortfolioController> logger)
        {
            _cosmosDbService = cosmosDbService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<PortfolioItem>> Get()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogError("User ID is missing in the claims.");
                return Enumerable.Empty<PortfolioItem>();
            }
            _logger.LogInformation("Getting items for user {UserId}", userId);
            return await _cosmosDbService.GetItemsAsync($"SELECT * FROM c WHERE c.userId = '{userId}'");
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PortfolioItem>> Get(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogError("User ID is missing in the claims.");
                return Unauthorized();
            }
            _logger.LogInformation("Getting item {Id} for user {UserId}", id, userId);
            var item = await _cosmosDbService.GetItemAsync(id, userId);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PortfolioItem item)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogError("User ID is missing in the claims.");
                return Unauthorized();
            }
            item.Id = Guid.NewGuid().ToString(); // Set the item ID to a new GUID
            item.UserId = userId; // Ensure the item has the correct userId
            _logger.LogInformation("Adding item {Id} for user {UserId}", item.Id, userId);
            await _cosmosDbService.AddItemAsync(item, userId); // Pass userId as partition key
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] PortfolioItem item)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogError("User ID is missing in the claims.");
                return Unauthorized();
            }
            _logger.LogInformation("Updating item {Id} for user {UserId}", id, userId);
            var existingItem = await _cosmosDbService.GetItemAsync(id, userId);
            if (existingItem == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(item.Id))
            {
                item.Id = id;
            }
            item.UserId = userId;

            _logger.LogInformation("Updated item details: {@Item}", item);
            await _cosmosDbService.UpdateItemAsync(id, item, userId); // Pass userId as partition key
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogError("User ID is missing in the claims.");
                return Unauthorized();
            }
            _logger.LogInformation("Deleting item {Id} for user {UserId}", id, userId);
            var item = await _cosmosDbService.GetItemAsync(id, userId);
            if (item == null)
            {
                return NotFound();
            }

            await _cosmosDbService.DeleteItemAsync(id, userId); // Pass userId as partition key
            return NoContent();
        }
    }
}
