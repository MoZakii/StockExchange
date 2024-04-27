using System.Text.Json.Serialization;

namespace StockExchange.Models
{
    public class StockHistory
    {
        [JsonIgnore]
        public Guid Id { get; set; } // Database generated ID
        
        [JsonIgnore]
        public Guid StockId { get; set; } // Foreign key referencing Stock table
        public decimal Price { get; set; }
        public DateTime Timestamp { get; set; }

    }
}
