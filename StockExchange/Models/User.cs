using System.Text.Json.Serialization;

namespace StockExchange.Models
{
    public class User
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
    }
}
