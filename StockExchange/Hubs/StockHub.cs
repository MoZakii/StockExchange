using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using SignalRSwaggerGen.Attributes;
using StockExchange.Models;

namespace StockExchange.Hubs
{
    public class StockHub : Hub
    {
        private readonly HttpClient _httpClient;

        public StockHub(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }


        public async Task sendUpdate() 
        {
            var stockData = await GetStockData();
            if (stockData != null)
            {
                await Clients.All.SendAsync("ReceiveStockUpdate", stockData);
            }
        }

        private async Task<List<Stock>> GetStockData() // Return List of StockData
        {
            var response = await _httpClient.GetAsync("https://localhost:7015/API/stocks");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<List<Stock>>(content); // Deserialize JSON to List<StockData>
            }

            return null;
        }
    }
}
