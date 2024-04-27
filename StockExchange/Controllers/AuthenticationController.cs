using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.IdentityModel.Tokens;
using StockExchange.Data;
using StockExchange.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StockExchange.Controllers
{
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly string _tokenSecret;
        private readonly int _tokenLifetime;

        public AuthenticationController(UserDbContext userManager, IConfiguration config)
        {
            _context = userManager;
            _tokenSecret = config["JWT:Secret"];
            _tokenLifetime = int.Parse(config["JWT:TokenExpiryInMinutes"]);
        }

        

        private string HashPassword(string password)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            return passwordHash;
        }

        [HttpPost("/api/register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
            if (existingUser != null)
            {
                return BadRequest("Username already exists.");
            }

            user.PasswordHash = HashPassword(user.PasswordHash);
            user.Id = Guid.NewGuid();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("/api/login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == login.Username);
            
            if (user == null || !VerifyPassword(login.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password.");
            }

            var tokenString = GenerateToken(user);
            return Ok(new { token = tokenString });
        }

        private string GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenSecret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim> 
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString())
            };



            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_tokenLifetime),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool VerifyPassword(string password, string hashedPassword) 
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }

        
    }
}
