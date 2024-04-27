namespace StockExchange.Hubs
{
    public static class SignalRHelper
    {
        private static readonly HttpClient _httpClient = new HttpClient();

        public static async Task TriggerStockUpdate()
        {
            var uri = new Uri("https://localhost:7015/stock-hub/sendUpdate");
            await _httpClient.PostAsync(uri, null);
        }
    }
}
