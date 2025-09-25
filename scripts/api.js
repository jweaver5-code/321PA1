// API Integration for TutorApp
const API_BASE_URL = 'http://localhost:5001/api';

class TutorAppAPI {
  // Tutors API
  static async getTutors() {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Convert API data to frontend format
      return data.map(tutor => ({
        id: tutor.id,
        name: tutor.name,
        major: tutor.major,
        year: tutor.year,
        university: tutor.university,
        subjects: JSON.parse(tutor.subjects || '[]'),
        hourlyRate: tutor.hourlyRate,
        rating: tutor.rating,
        reviews: tutor.reviews,
        bio: tutor.bio,
        availability: tutor.availability,
        isVerified: tutor.isVerified
      }));
    } catch (error) {
      console.error('Error fetching tutors:', error);
      throw error;
    }
  }

  static async getTutor(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const tutor = await response.json();
      
      return {
        id: tutor.id,
        name: tutor.name,
        major: tutor.major,
        year: tutor.year,
        university: tutor.university,
        subjects: JSON.parse(tutor.subjects || '[]'),
        hourlyRate: tutor.hourlyRate,
        rating: tutor.rating,
        reviews: tutor.reviews,
        bio: tutor.bio,
        availability: tutor.availability,
        isVerified: tutor.isVerified
      };
    } catch (error) {
      console.error('Error fetching tutor:', error);
      throw error;
    }
  }

  static async createTutor(tutorData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tutors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tutorData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create tutor profile');
      }

      const tutor = await response.json();
      return {
        id: tutor.id,
        name: tutor.name,
        major: tutor.major,
        year: tutor.year,
        university: tutor.university,
        subjects: JSON.parse(tutor.subjects || '[]'),
        hourlyRate: tutor.hourlyRate,
        rating: tutor.rating,
        reviews: tutor.reviews,
        bio: tutor.bio,
        availability: tutor.availability,
        isVerified: tutor.isVerified
      };
    } catch (error) {
      console.error('Error creating tutor:', error);
      throw error;
    }
  }

  // Authentication API
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Bookings API
  static async getBookings() {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  static async createBooking(bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async updateBooking(id, bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  static async deleteBooking(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
}

// Export for use in other scripts
window.TutorAppAPI = TutorAppAPI;
