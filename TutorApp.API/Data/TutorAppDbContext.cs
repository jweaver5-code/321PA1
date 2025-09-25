using Microsoft.EntityFrameworkCore;
using TutorApp.API.Models;

namespace TutorApp.API.Data
{
    public class TutorAppDbContext : DbContext
    {
        public TutorAppDbContext(DbContextOptions<TutorAppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Tutor> Tutors { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Student)
                .WithMany()
                .HasForeignKey(b => b.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Tutor)
                .WithMany()
                .HasForeignKey(b => b.TutorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed tutors
            modelBuilder.Entity<Tutor>().HasData(
                new Tutor
                {
                    Id = 1,
                    Name = "Sarah Johnson",
                    Major = "Computer Science",
                    Year = "Senior",
                    University = "Stanford University",
                    Subjects = "[\"Computer Science\", \"Mathematics\", \"Statistics\"]",
                    HourlyRate = 45,
                    Rating = 4.9m,
                    Reviews = 127,
                    Bio = "Passionate CS student with 3+ years of tutoring experience. Specialized in algorithms, data structures, and web development.",
                    Availability = "Available now",
                    IsVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Tutor
                {
                    Id = 2,
                    Name = "Michael Chen",
                    Major = "Mathematics",
                    Year = "Graduate",
                    University = "MIT",
                    Subjects = "[\"Mathematics\", \"Physics\", \"Statistics\"]",
                    HourlyRate = 55,
                    Rating = 4.8m,
                    Reviews = 89,
                    Bio = "Graduate student in Applied Mathematics with expertise in calculus, linear algebra, and differential equations.",
                    Availability = "Available today",
                    IsVerified = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Tutor
                {
                    Id = 3,
                    Name = "Emily Rodriguez",
                    Major = "Biology",
                    Year = "Junior",
                    University = "UC Berkeley",
                    Subjects = "[\"Biology\", \"Chemistry\", \"Anatomy\"]",
                    HourlyRate = 35,
                    Rating = 4.7m,
                    Reviews = 64,
                    Bio = "Pre-med student with strong background in life sciences. I make complex biological concepts easy to understand.",
                    Availability = "Available this week",
                    IsVerified = false,
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
