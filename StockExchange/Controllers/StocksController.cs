using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using StockExchange.Data;
using StockExchange.Hubs;
using StockExchange.Models;
using System.Net.Http;

[ApiController]
public class StocksController : ControllerBase
{
    private readonly StockContext _context;
    private readonly IHubContext<StockHub> _hubContext;
    private readonly HttpClient _httpClient;

    public StocksController(StockContext context, IHubContext<StockHub> hubContext, HttpClient httpClient)
    {
        _context = context;
        this._hubContext = hubContext;
        _httpClient = httpClient;
    }

    [HttpGet("/API/stocks")]
    public async Task<IActionResult> GetRealTimeStocks()
    {
        var stocks = await _context.Stocks.ToListAsync();
        return Ok(stocks);
    }

    [HttpGet("/API/stocks/{symbol}/history")]
    public async Task<IActionResult> GetStockHistory(string symbol)
    {
        if (string.IsNullOrEmpty(symbol))
        {
            return BadRequest("Stock symbol is required.");
        }

        var stock = await _context.Stocks.FirstOrDefaultAsync(s => s.Symbol == symbol);
        if (stock == null)
        {
            return NotFound();
        }

        var history = await _context.StockHistory
            .Where(h => h.StockId == stock.Id)
            .OrderByDescending(h => h.Timestamp)
            .ToListAsync();

        return Ok(history);
    }


    [HttpPost("/API/stocks")]
    public async Task<IActionResult> CreateStock([FromBody] Stock stock)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (_context.Stocks.Any(s => s.Symbol == stock.Symbol))
        {
            return BadRequest("Stock symbol must be unique.");
        }

        stock.Timestamp = DateTime.UtcNow;
        stock.Id = Guid.NewGuid();
        _context.Stocks.Add(stock);
        await _context.SaveChangesAsync();

        _context.StockHistory.Add(new StockHistory
        {
            Id = Guid.NewGuid(),
            StockId = stock.Id,
            Price = stock.Price,
            Timestamp = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();

        await _context.SaveChangesAsync();

        var stockData = await GetStockData();
        if (stockData != null)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveStockUpdate", stockData);
        }


        return Ok(stock);
    }

    [HttpPut("/API/stocks/{symbol}")]
    public async Task<IActionResult> UpdateStock(string symbol, [FromBody] Stock stock)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        //if (id != stock.Id)
        //{
        //    return BadRequest("Stock ID mismatch");
        //}

        var existingStock = await _context.Stocks.FirstOrDefaultAsync(s => s.Symbol == symbol);
        if (existingStock == null)
        {
            return NotFound("Stock with the provided symbol not found.");
        }

        existingStock.Price = stock.Price;
        existingStock.Timestamp = DateTime.UtcNow;

        // Add a new entry to StockHistory for updated price
        _context.StockHistory.Add(new StockHistory
        {
            Id = Guid.NewGuid(),
            StockId = existingStock.Id,
            Price = existingStock.Price,
            Timestamp = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        var stockData = await GetStockData();
        if (stockData != null)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveStockUpdate", stockData);
        }
        


        return NoContent();
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
