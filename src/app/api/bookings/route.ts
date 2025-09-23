import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(BOOKINGS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read bookings from file
function readBookings() {
  ensureDataDirectory();
  
  if (!fs.existsSync(BOOKINGS_FILE)) {
    // Initialize with example booking
    const initialBookings = [
      {
        id: '1',
        studentId: 'student1',
        tutorId: '1',
        subject: 'Computer Science',
        startTime: new Date('2024-01-15T14:00:00').toISOString(),
        endTime: new Date('2024-01-15T15:00:00').toISOString(),
        status: 'CONFIRMED',
        totalAmount: 3500, // $35 in cents
        notes: 'Need help with binary trees and recursion',
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(initialBookings, null, 2));
    return initialBookings;
  }
  
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading bookings file:', error);
    return [];
  }
}

// Write bookings to file
function writeBookings(bookings: any[]) {
  ensureDataDirectory();
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  } catch (error) {
    console.error('Error writing bookings file:', error);
  }
}

export async function GET() {
  const bookings = readBookings();
  return NextResponse.json({ bookings });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // Read existing bookings
  const bookings = readBookings();
  
  // Create new booking
  const newBooking = {
    id: Date.now().toString(),
    ...data,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  };

  // Add to bookings array
  bookings.push(newBooking);
  
  // Save to file
  writeBookings(bookings);
  
  console.log('New booking created:', newBooking);

  return NextResponse.json({ 
    success: true, 
    booking: newBooking,
    message: 'Booking confirmed successfully!' 
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'clear-all') {
    // Clear all bookings (keep just the example one)
    const initialBookings = [
      {
        id: '1',
        studentId: 'student1',
        tutorId: '1',
        subject: 'Computer Science',
        startTime: new Date('2024-01-15T14:00:00').toISOString(),
        endTime: new Date('2024-01-15T15:00:00').toISOString(),
        status: 'CONFIRMED',
        totalAmount: 3500,
        notes: 'Need help with binary trees and recursion',
        createdAt: new Date().toISOString()
      }
    ];
    
    writeBookings(initialBookings);
    
    return NextResponse.json({ 
      success: true, 
      message: 'All bookings cleared!' 
    });
  }
  
  return NextResponse.json(
    { success: false, message: 'Invalid action' }, 
    { status: 400 }
  );
}
