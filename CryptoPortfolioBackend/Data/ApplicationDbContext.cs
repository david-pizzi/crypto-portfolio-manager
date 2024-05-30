// Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using CryptoPortfolioBackend.Models;

namespace CryptoPortfolioBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<CryptoPortfolio> CryptoPortfolios { get; set; }
    }
}