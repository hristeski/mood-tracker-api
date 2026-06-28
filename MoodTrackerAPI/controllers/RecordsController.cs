using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MoodTrackerAPI.Data;
using MoodTrackerAPI.Models;

namespace MoodTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RecordsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public RecordsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRecordDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var record = new DailyRecord
            {
                UserId = userId,
                MoodScore = dto.MoodScore,
                SleepHours = dto.SleepHours,
                RecordDate = DateTime.UtcNow
            };

            _db.DailyRecords.Add(record);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Записот е зачуван!" });
        }

        [HttpGet("heatmap")]
public async Task<IActionResult> GetHeatmapData()
{
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    // Враќаме објект: Дата и број на записи за таа дата
    var data = await _db.DailyRecords
        .Where(r => r.UserId == userId)
        .GroupBy(r => r.RecordDate.Date)
        .Select(g => new {
            Date = g.Key,
            Count = g.Count()
        })
        .OrderBy(x => x.Date)
        .ToListAsync();

    return Ok(data);
}
    }

    public record CreateRecordDto(int MoodScore, double SleepHours);
}

