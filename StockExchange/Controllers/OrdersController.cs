using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockExchange.Data;
using StockExchange.Models;
using System.IdentityModel.Tokens.Jwt;


namespace StockExchange.Controllers
{
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly OrderContext _orderContext;

        private readonly StockContext _stockContext;

        public OrdersController(OrderContext orderContext, StockContext stockContext)
        {
            _orderContext = orderContext;
            _stockContext = stockContext;
        }

        [HttpPost("/API/orders"), Authorize]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Order validation
            if (order.Symbol == null || order.Quantity <= 0 || ((int)order.Type != 1 && (int)order.Type != 2))
            {
                return BadRequest("Invalid order details.");
            }

            // Check stock availability
            var stock = await _stockContext.Stocks.FirstOrDefaultAsync(s => s.Symbol == order.Symbol);
            if (stock == null)
            {
                return NotFound("Stock not found.");
            }

            Guid userId = Guid.Parse(GetUserIdFromToken());


            order.UserId = userId;
            order.Id = Guid.NewGuid();
            order.Timestamp = DateTime.UtcNow;

            // Save the order 
            _orderContext.Orders.Add(order);
            await _orderContext.SaveChangesAsync();

            return Ok(order);
        }

        [HttpGet("/API/orders"), Authorize]
        public async Task<IActionResult> GetOrders()
        {
            Guid userId = Guid.Parse(GetUserIdFromToken()); // Implement this function
            // Get orders based on user ID (if implemented)
            var orders = await _orderContext.Orders
                .Where(o => o.UserId == userId) // Filter by user ID
                .OrderByDescending(o => o.Timestamp)
                .ToListAsync();

            return Ok(orders);
        }

        private string GetUserIdFromToken()
        {
            string token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            var stringUserId = securityToken.Claims.First(claim => claim.Type == "jti").Value;
            return stringUserId;
        }
    }
}
