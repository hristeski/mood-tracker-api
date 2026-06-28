using Microsoft.EntityFrameworkCore;
using MoodTrackerAPI.Models;

namespace MoodTrackerAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<DailyRecord> DailyRecords { get; set; }
    }
}