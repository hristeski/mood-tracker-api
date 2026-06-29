using System.Net;
using System.Net.Mail;

namespace MoodTrackerAPI.Services
{
    public class GmailEmailService
    {
        private readonly string _senderEmail;
        private readonly string _appPassword;

        public GmailEmailService(IConfiguration config)
        {
            _senderEmail = config["Gmail:SenderEmail"]!;
            _appPassword = config["Gmail:AppPassword"]!;
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string username)
        {
            var subject = "Успешна регистрација";
            var body = $@"
                <div style='font-family: Arial, sans-serif; color: #333;'>
                    <h2>Добредојде, {username}!</h2>
                    <p>Вашата сметка е успешно креирана.</p>
                    <p>Сега можете да се најавите и да ги следите вашите расположенија.</p>
                </div>";

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken)
        {
            var resetLink = $"https://mood-tracker-dun-one.vercel.app/reset-password?token={resetToken}";

            var subject = "Ресетирање на лозинка";
            var body = $@"
                <div style='font-family: Arial, sans-serif; color: #333;'>
                    <h2>Ресетирање на лозинка</h2>
                    <p>Кликнете на копчето подолу за да поставите нова лозинка. Линкот е валиден 15 минути.</p>
                    <a href='{resetLink}' style='background:#4F46E5;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;margin-top:10px;'>
                        Ресетирај Лозинка
                    </a>
                    <p style='margin-top:20px;color:#999;font-size:12px;'>Ако не го побаравте ова, игнорирајте ја пораката.</p>
                </div>";

            await SendEmailAsync(toEmail, subject, body);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            using var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(_senderEmail, _appPassword),
                EnableSsl = true
            };

            using var mailMessage = new MailMessage
            {
                From = new MailAddress(_senderEmail, "Mood Tracker"),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);
            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}