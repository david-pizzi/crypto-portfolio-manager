namespace CryptoPortfolioBackend.Models
{
    public class PortfolioItem
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string CryptoName { get; set; }
        public decimal Amount { get; set; }
        public decimal PurchasePrice { get; set; }
    }
}
