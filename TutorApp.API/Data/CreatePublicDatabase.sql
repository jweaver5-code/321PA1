-- Create a public database with sample data
-- Run this in SQLite Studio to create a public database file

-- Create tables
CREATE TABLE IF NOT EXISTS Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    UserType TEXT NOT NULL,
    University TEXT,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Tutors (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Major TEXT NOT NULL,
    Year TEXT NOT NULL,
    University TEXT,
    Subjects TEXT NOT NULL,
    HourlyRate REAL NOT NULL,
    Rating REAL NOT NULL,
    Reviews INTEGER NOT NULL,
    Bio TEXT NOT NULL,
    Availability TEXT NOT NULL,
    IsVerified INTEGER NOT NULL,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Bookings (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    StudentId INTEGER NOT NULL,
    TutorId INTEGER NOT NULL,
    Subject TEXT NOT NULL,
    StartTime TEXT NOT NULL,
    EndTime TEXT NOT NULL,
    Status TEXT NOT NULL,
    TotalCost REAL NOT NULL,
    Notes TEXT,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (StudentId) REFERENCES Users(Id),
    FOREIGN KEY (TutorId) REFERENCES Tutors(Id)
);

-- Insert sample data
INSERT INTO Tutors (Name, Major, Year, University, Subjects, HourlyRate, Rating, Reviews, Bio, Availability, IsVerified, CreatedAt) VALUES
('Sarah Johnson', 'Computer Science', 'Senior', 'Stanford University', '["Computer Science", "Mathematics", "Statistics"]', 45.00, 4.9, 127, 'Passionate CS student with 3+ years of tutoring experience. Specialized in algorithms, data structures, and web development.', 'Available now', 1, datetime('now')),
('Michael Chen', 'Mathematics', 'Graduate', 'MIT', '["Mathematics", "Physics", "Statistics"]', 55.00, 4.8, 89, 'Graduate student in Applied Mathematics with expertise in calculus, linear algebra, and differential equations.', 'Available today', 1, datetime('now')),
('Emily Rodriguez', 'Biology', 'Junior', 'UC Berkeley', '["Biology", "Chemistry", "Anatomy"]', 35.00, 4.7, 64, 'Pre-med student with strong background in life sciences. I make complex biological concepts easy to understand.', 'Available this week', 0, datetime('now')),
('David Kim', 'Economics', 'Senior', 'Harvard University', '["Economics", "Statistics", "Business"]', 50.00, 4.9, 95, 'Economics major with internship experience at top consulting firms. I help students understand economic theory through real-world applications.', 'Available now', 1, datetime('now')),
('Lisa Wang', 'English Literature', 'Graduate', 'Yale University', '["English", "Writing", "Literature"]', 40.00, 4.8, 78, 'Graduate student in English Literature with published research. I specialize in essay writing and literary analysis.', 'Available today', 1, datetime('now')),
('James Wilson', 'Physics', 'Senior', 'Caltech', '["Physics", "Mathematics", "Chemistry"]', 60.00, 4.9, 112, 'Physics major with research experience in quantum mechanics. I break down complex physics problems into manageable steps.', 'Available this week', 1, datetime('now'));

INSERT INTO Users (FirstName, LastName, Email, Password, UserType, University, CreatedAt) VALUES
('John', 'Doe', 'john.doe@email.com', 'password123', 'student', 'University of California', datetime('now')),
('Jane', 'Smith', 'jane.smith@email.com', 'password123', 'student', 'University of Texas', datetime('now')),
('Alex', 'Johnson', 'alex.johnson@email.com', 'password123', 'tutor', 'Stanford University', datetime('now')),
('Maria', 'Garcia', 'maria.garcia@email.com', 'password123', 'tutor', 'MIT', datetime('now'));

INSERT INTO Bookings (StudentId, TutorId, Subject, StartTime, EndTime, Status, TotalCost, Notes, CreatedAt) VALUES
(1, 1, 'Computer Science', datetime('now', '+1 day', '14:00:00'), datetime('now', '+1 day', '15:00:00'), 'confirmed', 45.00, 'Need help with binary trees and recursion', datetime('now')),
(2, 2, 'Mathematics', datetime('now', '+2 days', '10:00:00'), datetime('now', '+2 days', '11:30:00'), 'confirmed', 82.50, 'Calculus review session', datetime('now')),
(1, 3, 'Biology', datetime('now', '+3 days', '16:00:00'), datetime('now', '+3 days', '17:00:00'), 'pending', 35.00, 'Cell biology concepts', datetime('now'));
