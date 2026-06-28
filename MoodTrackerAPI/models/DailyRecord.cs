namespace MoodTrackerAPI.Models
{
    public class DailyRecord
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int MoodScore { get; set; }
        public double SleepHours { get; set; }
        public string? Notes { get; set; }
        public DateTime RecordDate { get; set; } = DateTime.UtcNow;
        public User? User { get; set; }
    }
}