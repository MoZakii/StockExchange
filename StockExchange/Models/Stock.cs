using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StockExchange.Models
{
    public class Stock
    {
        [JsonIgnore]
        public Guid Id { get; set; }

        [Required]
        public string Symbol { get; set; }
        
        [Required]
        public decimal Price { get; set; }

        [JsonIgnore]
        public DateTime Timestamp { get; set; }
    }
}
