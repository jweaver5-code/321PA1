using System.ComponentModel.DataAnnotations;

namespace TutorApp.API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        
        [Required]
        public int StudentId { get; set; }
        
        [Required]
        public int TutorId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        public DateTime StartTime { get; set; }
        
        [Required]
        public DateTime EndTime { get; set; }
        
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "pending"; // pending, confirmed, completed, cancelled
        
        [Required]
        [Range(0, 10000)]
        public decimal TotalCost { get; set; }
        
        [MaxLength(1000)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public User? Student { get; set; }
        public Tutor? Tutor { get; set; }
    }
}
