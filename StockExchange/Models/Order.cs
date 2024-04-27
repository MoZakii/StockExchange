using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StockExchange.Models
{
    public enum OrderType { Buy = 1, Sell = 2}
    public class Order
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        
        [JsonIgnore]
        public Guid UserId { get; set; } // For user identification

        [Required]
        public string Symbol { get; set; }

        [Required]
        public OrderType Type { get; set; } // Enum for Buy/Sell

        [Required]
        public int Quantity { get; set; }

        [JsonIgnore]
        public DateTime Timestamp { get; set; }
    }
}
