using System.ComponentModel.DataAnnotations;

namespace TutorApp.API.Models
{
    public class Tutor
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Major { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(20)]
        public string Year { get; set; } = string.Empty;
        
        [MaxLength(255)]
        public string? University { get; set; }
        
        [Required]
        public string Subjects { get; set; } = string.Empty; // JSON string of subjects array
        
        [Required]
        [Range(0, 1000)]
        public decimal HourlyRate { get; set; }
        
        [Required]
        [Range(0, 5)]
        public decimal Rating { get; set; }
        
        public int Reviews { get; set; } = 0;
        
        [Required]
        [MaxLength(1000)]
        public string Bio { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Availability { get; set; } = string.Empty;
        
        public bool IsVerified { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
