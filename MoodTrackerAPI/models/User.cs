namespace MoodTrackerAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Верификација на мејл
        public bool IsEmailVerified { get; set; } = false;
        public string? EmailVerificationToken { get; set; }

        // Reset лозинка
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }

        public List<DailyRecord> DailyRecords { get; set; } = new();
    }
}