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

    var verificationToken = Guid.NewGuid().ToString("N");

    var user = new User
    {
        Username = dto.Username,
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        IsEmailVerified = false,
        EmailVerificationToken = verificationToken
    };

    _db.Users.Add(user);
    await _db.SaveChangesAsync();

    await _emailService.SendVerificationEmailAsync(dto.Email, dto.Username, verificationToken);

    return Ok(new { message = "Регистрацијата е успешна! Проверете го вашиот емаил за потврда." });
}

[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
{
    var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

    if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        return Unauthorized("Погрешен емаил или лозинка.");

    // Блокирај ако мејлот не е потврден
    if (!user.IsEmailVerified)
        return Unauthorized("Ве молиме потврдете го вашиот емаил пред да се најавите.");

    var token = GenerateToken(user);
    return Ok(new { token, username = user.Username });
}

[HttpPost("google")]
public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
{
    try
    {
        // Верификација преку Google UserInfo API
        using var http = new HttpClient();
        http.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", dto.AccessToken);
        
        var response = await http.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");
        
        if (!response.IsSuccessStatusCode)
            return Unauthorized("Невалиден Google токен.");

        var json = await response.Content.ReadAsStringAsync();
        var userInfo = System.Text.Json.JsonSerializer.Deserialize<GoogleUserInfo>(json);

        if (userInfo?.email == null)
            return Unauthorized("Не може да се добие емаил од Google.");

        // Провери дали корисникот веќе постои
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == userInfo.email);

        if (user == null)
        {
            user = new User
            {
                Username = userInfo.name ?? userInfo.email.Split('@')[0],
                Email = userInfo.email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                IsEmailVerified = true
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        var token = GenerateToken(user);
        return Ok(new { token, username = user.Username });
    }
    catch
    {
        return Unauthorized("Грешка при Google најава.");
    }
}


[HttpGet("verify-email")]
public async Task<IActionResult> VerifyEmail([FromQuery] string token)
{
    var user = await _db.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);

    if (user == null)
        return BadRequest("Невалиден токен.");

    user.IsEmailVerified = true;
    user.EmailVerificationToken = null;
    await _db.SaveChangesAsync();

    // Редирект кон login страната
    return Redirect("https://mood-tracker-dun-one.vercel.app/login?verified=true");
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
public record GoogleLoginDto(string AccessToken);
public class GoogleUserInfo 
{ 
    public string? email { get; set; } 
    public string? name { get; set; } 
}}