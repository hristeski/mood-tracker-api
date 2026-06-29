using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MoodTrackerAPI.Data;
using MoodTrackerAPI.Models;
using MoodTrackerAPI.Services;

namespace MoodTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;
        private readonly GmailEmailService _emailService;

        public AuthController(AppDbContext db, IConfiguration config, GmailEmailService emailService)
        {
            _db = db;
            _config = config;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Корисник со овој емаил веќе постои.");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // Прати welcome мејл
            await _emailService.SendWelcomeEmailAsync(dto.Email, dto.Username);

            return Ok(new { message = "Регистрацијата е успешна!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Погрешен емаил или лозинка.");

            var token = GenerateToken(user);
            return Ok(new { token, username = user.Username });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            // Секогаш враќај OK (за безбедност — да не се знае дали мејлот постои)
            if (user == null)
                return Ok(new { message = "Ако мејлот постои, ќе добиете линк." });

            // Генерирај токен
            var token = Guid.NewGuid().ToString("N");
            user.ResetToken = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(15);
            await _db.SaveChangesAsync();

            await _emailService.SendPasswordResetEmailAsync(dto.Email, token);

            return Ok(new { message = "Ако мејлот постои, ќе добиете линк." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u =>
                u.ResetToken == dto.Token &&
                u.ResetTokenExpiry > DateTime.UtcNow);

            if (user == null)
                return BadRequest("Токенот е невалиден или истечен.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Лозинката е успешно променета!" });
        }

        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public record RegisterDto(string Username, string Email, string Password);
    public record LoginDto(string Email, string Password);
    public record ForgotPasswordDto(string Email);
    public record ResetPasswordDto(string Token, string NewPassword);
}