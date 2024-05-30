// Controllers/CryptoPortfoliosController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CryptoPortfolioBackend.Data;
using CryptoPortfolioBackend.Models;

[Route("api/[controller]")]
[ApiController]
public class CryptoPortfoliosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CryptoPortfoliosController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CryptoPortfolio>>> GetCryptoPortfolios()
    {
        return await _context.CryptoPortfolios.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CryptoPortfolio>> GetCryptoPortfolio(string id)
    {
        var cryptoPortfolio = await _context.CryptoPortfolios.FindAsync(id);

        if (cryptoPortfolio == null)
        {
            return NotFound();
        }

        return cryptoPortfolio;
    }

    [HttpPost]
    public async Task<ActionResult<CryptoPortfolio>> PostCryptoPortfolio(CryptoPortfolio cryptoPortfolio)
    {
        _context.CryptoPortfolios.Add(cryptoPortfolio);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCryptoPortfolio), new { id = cryptoPortfolio.Id }, cryptoPortfolio);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCryptoPortfolio(string id, CryptoPortfolio cryptoPortfolio)
    {
        if (id != cryptoPortfolio.Id)
        {
            return BadRequest();
        }

        _context.Entry(cryptoPortfolio).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CryptoPortfolioExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCryptoPortfolio(string id)
    {
        var cryptoPortfolio = await _context.CryptoPortfolios.FindAsync(id);
        if (cryptoPortfolio == null)
        {
            return NotFound();
        }

        _context.CryptoPortfolios.Remove(cryptoPortfolio);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CryptoPortfolioExists(string id)
    {
        return _context.CryptoPortfolios.Any(e => e.Id == id);
    }
}
