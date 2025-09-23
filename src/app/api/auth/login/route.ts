import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      );
    }

    // In a real app, this would:
    // 1. Find user in database
    // 2. Compare hashed passwords
    // 3. Create session/JWT token
    
    // Mock authentication - check for specific test accounts
    const mockUsers = [
      { 
        email: 'robgill1911@gmail.com', 
        password: 'pizza123!', 
        firstName: 'Robert', 
        lastName: 'Gill',
        userType: 'student' 
      },
      { 
        email: 'tutor@example.com', 
        password: 'password123', 
        firstName: 'Sarah', 
        lastName: 'Johnson',
        userType: 'tutor' 
      }
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' }, 
        { status: 401 }
      );
    }

    // Mock success response
    return NextResponse.json({
      success: true,
      message: 'Login successful!',
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' }, 
      { status: 500 }
    );
  }
}
