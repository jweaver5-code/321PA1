import { NextRequest, NextResponse } from 'next/server';

// Mock data - in a real app this would come from the database
const tutors = [
  {
    id: '1',
    name: 'Sarah Johnson',
    major: 'Computer Science',
    year: 'Senior',
    university: 'Stanford University',
    subjects: ['Computer Science', 'Mathematics', 'Physics'],
    rating: 4.9,
    reviews: 127,
    hourlyRate: 35,
    bio: 'CS senior with 3+ years tutoring experience. Specializes in algorithms and data structures.',
    availability: 'Available now',
    gpa: 3.8,
    isVerified: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    major: 'Mathematics',
    year: 'Graduate Student',
    university: 'MIT',
    subjects: ['Mathematics', 'Statistics', 'Physics'],
    rating: 4.8,
    reviews: 89,
    hourlyRate: 40,
    bio: 'Math PhD student passionate about making complex concepts accessible.',
    availability: 'Available in 2 hours',
    gpa: 3.9,
    isVerified: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    major: 'Biology',
    year: 'Junior',
    university: 'UC Berkeley',
    subjects: ['Biology', 'Chemistry', 'Psychology'],
    rating: 4.7,
    reviews: 64,
    hourlyRate: 30,
    bio: 'Pre-med student with strong background in life sciences and test prep.',
    availability: 'Available now',
    gpa: 3.7,
    isVerified: true
  }
];

export async function GET() {
  // Mock data - in a real app this would come from a database
  const tutors = [
    {
      id: 1,
      name: "Sarah Johnson",
      major: "Computer Science",
      year: "Senior",
      university: "Stanford University",
      subjects: ["Math", "Physics", "Computer Science", "Calculus"],
      hourlyRate: 35,
      rating: 4.9,
      reviews: 127,
      bio: "Passionate about helping students excel in STEM subjects. I have 3+ years of tutoring experience and specialize in making complex concepts easy to understand through practical examples.",
      availability: "Available now",
      isVerified: true,
      profileImage: "/tutors/sarah.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      major: "Mathematics",
      year: "Graduate Student",
      university: "UC Berkeley",
      subjects: ["Calculus", "Statistics", "Linear Algebra", "Discrete Math"],
      hourlyRate: 40,
      rating: 4.8,
      reviews: 89,
      bio: "PhD candidate in Mathematics with extensive experience in tutoring undergraduate and graduate level math courses. Known for patient teaching style and clear explanations.",
      availability: "Available today",
      isVerified: true,
      profileImage: "/tutors/michael.jpg"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      major: "Chemistry",
      year: "Junior",
      university: "MIT",
      subjects: ["Chemistry", "Organic Chemistry", "Biology", "Physics"],
      hourlyRate: 30,
      rating: 4.7,
      reviews: 156,
      bio: "Chemistry major with a passion for the sciences. I love helping students understand the 'why' behind chemical reactions and biological processes.",
      availability: "Available tomorrow",
      isVerified: true,
      profileImage: "/tutors/emily.jpg"
    },
    {
      id: 4,
      name: "David Kim",
      major: "Economics",
      year: "Senior",
      university: "Harvard University",
      subjects: ["Economics", "Statistics", "Finance", "Business"],
      hourlyRate: 45,
      rating: 4.9,
      reviews: 203,
      bio: "Economics student with internship experience at top financial firms. Specialized in microeconomics, macroeconomics, and quantitative analysis.",
      availability: "Available now",
      isVerified: true,
      profileImage: "/tutors/david.jpg"
    },
    {
      id: 5,
      name: "Jessica Thompson",
      major: "English Literature",
      year: "Graduate Student",
      university: "Yale University",
      subjects: ["English", "Writing", "Literature", "History"],
      hourlyRate: 32,
      rating: 4.8,
      reviews: 92,
      bio: "Master's student in English Literature with a focus on creative writing. I help students improve their writing skills and develop critical thinking abilities.",
      availability: "Available this week",
      isVerified: false,
      profileImage: "/tutors/jessica.jpg"
    },
    {
      id: 6,
      name: "Alex Turner",
      major: "Physics",
      year: "PhD Student",
      university: "Caltech",
      subjects: ["Physics", "Mathematics", "Engineering", "Astronomy"],
      hourlyRate: 50,
      rating: 4.9,
      reviews: 74,
      bio: "PhD student in Theoretical Physics with research experience in quantum mechanics. Passionate about making physics accessible and exciting for all students.",
      availability: "Available weekends",
      isVerified: true,
      profileImage: "/tutors/alex.jpg"
    }
  ];

  return Response.json(tutors);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // In a real app, this would save to the database
  const newTutor = {
    id: Date.now().toString(),
    ...data,
    rating: 0,
    reviews: 0,
    isVerified: false,
    availability: 'Pending approval'
  };

  return NextResponse.json({ 
    success: true, 
    tutor: newTutor,
    message: 'Application submitted successfully!' 
  });
}
