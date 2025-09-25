// TutorApp - Main JavaScript Application

// Global state management
const AppState = {
  currentUser: null,
  currentPage: 'home',
  tutors: [],
  bookings: [],
  isLoading: false
};

// Mock data
const mockTutors = [
  {
    id: 1,
    name: "Sarah Johnson",
    major: "Computer Science",
    year: "Senior",
    university: "Stanford University",
    subjects: ["Computer Science", "Mathematics", "Statistics"],
    hourlyRate: 45,
    rating: 4.9,
    reviews: 127,
    bio: "Passionate CS student with 3+ years of tutoring experience. Specialized in algorithms, data structures, and web development. I love helping students understand complex concepts through practical examples.",
    availability: "Available now",
    isVerified: true
  },
  {
    id: 2,
    name: "Michael Chen",
    major: "Mathematics",
    year: "Graduate",
    university: "MIT",
    subjects: ["Mathematics", "Physics", "Statistics"],
    hourlyRate: 55,
    rating: 4.8,
    reviews: 89,
    bio: "Graduate student in Applied Mathematics with expertise in calculus, linear algebra, and differential equations. Patient and methodical approach to teaching.",
    availability: "Available today",
    isVerified: true
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    major: "Biology",
    year: "Junior",
    university: "UC Berkeley",
    subjects: ["Biology", "Chemistry", "Anatomy"],
    hourlyRate: 35,
    rating: 4.7,
    reviews: 64,
    bio: "Pre-med student with strong background in life sciences. I make complex biological concepts easy to understand with visual aids and real-world examples.",
    availability: "Available this week",
    isVerified: false
  },
  {
    id: 4,
    name: "David Kim",
    major: "Economics",
    year: "Senior",
    university: "Harvard University",
    subjects: ["Economics", "Statistics", "Business"],
    hourlyRate: 50,
    rating: 4.9,
    reviews: 95,
    bio: "Economics major with internship experience at top consulting firms. I help students understand economic theory through real-world applications and case studies.",
    availability: "Available now",
    isVerified: true
  },
  {
    id: 5,
    name: "Lisa Wang",
    major: "English Literature",
    year: "Graduate",
    university: "Yale University",
    subjects: ["English", "Writing", "Literature"],
    hourlyRate: 40,
    rating: 4.8,
    reviews: 78,
    bio: "Graduate student in English Literature with published research. I specialize in essay writing, literary analysis, and helping students develop critical thinking skills.",
    availability: "Available today",
    isVerified: true
  },
  {
    id: 6,
    name: "James Wilson",
    major: "Physics",
    year: "Senior",
    university: "Caltech",
    subjects: ["Physics", "Mathematics", "Chemistry"],
    hourlyRate: 60,
    rating: 4.9,
    reviews: 112,
    bio: "Physics major with research experience in quantum mechanics. I break down complex physics problems into manageable steps and use interactive demonstrations.",
    availability: "Available this week",
    isVerified: true
  }
];

const mockBookings = [
  {
    id: "1",
    studentId: "student1",
    tutorId: "1",
    subject: "Computer Science",
    date: "2024-01-15T20:00:00.000Z",
    duration: 1,
    status: "confirmed",
    totalCost: 45,
    notes: "Need help with binary trees and recursion",
    createdAt: "2025-01-08T18:33:31.242Z"
  }
];

// Initialize the application
// Form submission handlers
async function handleTutorApplication(event) {
  event.preventDefault();
  
  const formData = {
    firstName: document.getElementById('tutor-firstName').value,
    lastName: document.getElementById('tutor-lastName').value,
    email: document.getElementById('tutor-email').value,
    university: document.getElementById('tutor-university').value,
    major: document.getElementById('tutor-major').value,
    year: document.getElementById('tutor-year').value,
    subjects: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
    hourlyRate: parseFloat(document.getElementById('rate-display').value),
    experience: document.getElementById('tutor-experience').value,
    motivation: document.getElementById('tutor-motivation').value,
    availability: Array.from(document.querySelectorAll('input[id^="avail-"]:checked')).map(cb => cb.value)
  };
  
  // Validate required fields
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.university || 
      !formData.major || !formData.year || formData.subjects.length === 0) {
    alert('Please fill in all required fields.');
    return;
  }
  
  try {
    // Create new tutor object
    const newTutor = {
      id: AppState.tutors.length + 1, // Simple ID generation
      name: `${formData.firstName} ${formData.lastName}`,
      major: formData.major,
      year: formData.year,
      university: formData.university,
      subjects: formData.subjects,
      hourlyRate: formData.hourlyRate,
      rating: 5.0, // Start with perfect rating
      reviews: 0,
      bio: `I am a ${formData.year} ${formData.major} student at ${formData.university}. ${formData.experience} ${formData.motivation}`,
      availability: formData.availability.length > 0 ? formData.availability.join(', ') : 'Flexible',
      isVerified: true // Auto-verify new tutors
    };
    
    // Try to save to API first
    try {
      const savedTutor = await TutorAppAPI.createTutor(newTutor);
      // Use the tutor data returned from API (with proper ID)
      AppState.tutors.push(savedTutor);
      console.log('New tutor saved to API:', savedTutor);
    } catch (apiError) {
      console.log('API not available, saving to localStorage:', apiError.message);
      // Fallback to localStorage
    AppState.tutors.push(newTutor);
    }
    
    // Always save to localStorage for persistence
    localStorage.setItem('tutors', JSON.stringify(AppState.tutors));
    
    console.log('New tutor added:', newTutor);
    
    alert('Congratulations! You are now a verified tutor on TutorApp! You can start receiving bookings immediately.');
    
    // Reset form
    document.getElementById('tutor-application-form').reset();
    
    // Redirect to find tutors to see the new tutor
    setTimeout(() => {
      navigateTo('find-tutors');
    }, 2000);
    
  } catch (error) {
    console.error('Error creating tutor account:', error);
    alert('There was an error creating your tutor account. Please try again or contact support.');
  }
}

function handleSupportForm(event) {
  event.preventDefault();
  
  const formData = {
    firstName: document.getElementById('support-firstName').value,
    lastName: document.getElementById('support-lastName').value,
    email: document.getElementById('support-email').value,
    subject: document.getElementById('support-subject').value,
    message: document.getElementById('support-message').value
  };
  
  // Here you would typically send this to your API
  console.log('Support Request:', formData);
  alert('Thank you for contacting us! We will get back to you within 24 hours.');
  
  // Reset form
  document.getElementById('support-form').reset();
}

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  
  // Add event listeners for forms
  document.addEventListener('submit', function(event) {
    if (event.target.id === 'tutor-application-form') {
      handleTutorApplication(event);
    } else if (event.target.id === 'support-form') {
      handleSupportForm(event);
    }
  });
});

function initializeApp() {
  // Load user from localStorage
  loadUser();
  
  // Load tutors from localStorage first
  loadTutorsFromLocalStorage();
  
  // Initialize tutors data from API (don't wait for it)
  loadTutorsFromAPI();
  AppState.bookings = mockBookings; // Keep mock bookings for now
  
  // Update UI based on auth state
  updateAuthUI();
  
  // Set initial page after everything is ready
  setTimeout(() => {
    navigateTo('home');
  }, 100);
}

function loadTutorsFromLocalStorage() {
  try {
    const savedTutors = localStorage.getItem('tutors');
    if (savedTutors) {
      const tutors = JSON.parse(savedTutors);
      // Merge with existing tutors, avoiding duplicates
      tutors.forEach(tutor => {
        if (!AppState.tutors.find(t => t.id === tutor.id)) {
          AppState.tutors.push(tutor);
        }
      });
    }
  } catch (error) {
    console.error('Error loading tutors from localStorage:', error);
  }
}

async function loadTutorsFromAPI() {
  try {
    // Check if API is available
    const response = await fetch('http://localhost:5001/api/tutors');
    if (response.ok) {
      const data = await response.json();
      const apiTutors = data.map(tutor => ({
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
      
      // Merge API tutors with existing tutors (from localStorage)
      // Keep localStorage tutors that aren't in API, and update existing ones
      const existingTutors = [...AppState.tutors];
      AppState.tutors = apiTutors;
      
      // Add any tutors from localStorage that aren't in the API
      existingTutors.forEach(localTutor => {
        if (!AppState.tutors.find(t => t.id === localTutor.id)) {
          AppState.tutors.push(localTutor);
        }
      });
    } else {
      throw new Error('API not available');
    }
  } catch (error) {
    console.log('Using existing tutors data:', error.message);
    // Keep existing tutors data (from localStorage) instead of using mock data
    if (AppState.tutors.length === 0) {
    AppState.tutors = mockTutors;
    }
  }
}

// Authentication functions
function loadUser() {
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      AppState.currentUser = JSON.parse(savedUser);
      updateAuthUI(); // Update the UI when user is loaded
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    localStorage.removeItem('user');
  }
}

function login(userData) {
  AppState.currentUser = userData;
  localStorage.setItem('user', JSON.stringify(userData));
  updateAuthUI();
}

function logout() {
  AppState.currentUser = null;
  localStorage.removeItem('user');
  updateAuthUI();
  navigateTo('home');
}

function updateAuthUI() {
  const userMenu = document.getElementById('user-menu');
  const guestMenu = document.getElementById('guest-menu');
  const mobileUserMenu = document.getElementById('mobile-user-menu');
  const mobileGuestMenu = document.getElementById('mobile-guest-menu');
  
  if (AppState.currentUser) {
    // Show user menu
    userMenu.classList.remove('d-none');
    guestMenu.classList.add('d-none');
    mobileUserMenu.classList.remove('d-none');
    mobileGuestMenu.classList.add('d-none');
    
    // Update user info in desktop nav
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    
    if (userAvatar) {
      userAvatar.textContent = AppState.currentUser.firstName.charAt(0);
    }
    if (userName) {
      userName.textContent = `${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
    }
    
    // Update mobile menu user info if elements exist
    const mobileUserAvatar = document.getElementById('mobile-user-avatar');
    const mobileUserName = document.getElementById('mobile-user-name');
    
    if (mobileUserAvatar) {
      mobileUserAvatar.textContent = AppState.currentUser.firstName.charAt(0);
    }
    if (mobileUserName) {
      mobileUserName.textContent = `${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
    }
    
    // Update account type display
    const accountTypeElements = document.querySelectorAll('.account-type');
    accountTypeElements.forEach(element => {
      element.textContent = AppState.currentUser.userType === 'tutor' ? 'Tutor' : 'Student';
    });
  } else {
    // Show guest menu
    userMenu.classList.add('d-none');
    guestMenu.classList.remove('d-none');
    mobileUserMenu.classList.add('d-none');
    mobileGuestMenu.classList.remove('d-none');
  }
}

// Navigation system
function navigateTo(page) {
  AppState.currentPage = page;
  
  // Update URL without page reload
  const url = new URL(window.location);
  url.searchParams.set('page', page);
  window.history.pushState({ page }, '', url);
  
  // Load page content
  loadPage(page);
}

function loadPage(page) {
  const mainContent = document.getElementById('main-content');
  
  switch (page) {
    case 'home':
      mainContent.innerHTML = getHomePageHTML();
      break;
    case 'find-tutors':
      mainContent.innerHTML = getFindTutorsPageHTML();
      initializeFindTutorsPage();
      break;
    case 'login':
      mainContent.innerHTML = getLoginPageHTML();
      initializeLoginPage();
      break;
    case 'signup':
      mainContent.innerHTML = getSignupPageHTML();
      initializeSignupPage();
      break;
    case 'become-tutor':
      mainContent.innerHTML = getBecomeTutorPageHTML();
      break;
    case 'how-it-works':
      mainContent.innerHTML = getHowItWorksPageHTML();
      break;
    case 'support':
      mainContent.innerHTML = getSupportPageHTML();
      break;
    case 'dashboard':
      mainContent.innerHTML = getDashboardPageHTML();
      updateAuthUI(); // Ensure navigation is updated
      break;
    case 'profile':
      mainContent.innerHTML = getProfilePageHTML();
      break;
    case 'bookings':
      mainContent.innerHTML = getBookingsPageHTML();
      break;
    case 'messages':
      mainContent.innerHTML = getMessagesPageHTML();
      break;
    case 'settings':
      mainContent.innerHTML = getSettingsPageHTML();
      break;
    default:
      mainContent.innerHTML = getHomePageHTML();
  }
  
  // Add fade-in animation
  mainContent.classList.add('fade-in');
  setTimeout(() => {
    mainContent.classList.remove('fade-in');
  }, 500);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
  const url = new URL(window.location);
  const page = url.searchParams.get('page') || 'home';
  AppState.currentPage = page;
  loadPage(page);
});

// Home page
function getHomePageHTML() {
  return `
    <div class="min-vh-100">
      <!-- Hero Section -->
      <div class="bg-gradient-primary text-white py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h1 class="display-4 fw-bold mb-4">Welcome to TutorApp</h1>
              <p class="lead mb-4">
                The perfect platform for students to find tutors and for tutors to share their knowledge. 
                Connect, learn, and succeed together.
              </p>
              <div class="d-flex flex-wrap gap-3">
                <button class="btn btn-light btn-lg px-4" onclick="navigateTo('find-tutors')">
                  <i class="bi bi-search me-2"></i>Find Tutors
                </button>
                <button class="btn btn-outline-light btn-lg px-4" onclick="navigateTo('become-tutor')">
                  <i class="bi bi-person-plus me-2"></i>Become a Tutor
                </button>
              </div>
            </div>
            <div class="col-lg-6 text-center">
              <div class="bg-white bg-opacity-90 rounded-3 p-4 shadow-lg">
                <i class="bi bi-mortarboard display-1 mb-3 text-primary"></i>
                <h3 class="h4 text-dark fw-bold">Join Our Community</h3>
                <p class="mb-0 text-muted">Over 1,000+ students and tutors already connected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Options Section -->
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="h3 fw-bold mb-3">Choose Your Path</h2>
            <p class="text-muted">Whether you're looking for help or ready to help others, we've got you covered.</p>
          </div>
        </div>
        
        <div class="row g-4">
          <!-- Find Tutors Card -->
          <div class="col-lg-6">
            <div class="card h-100 border-0 shadow-lg">
              <div class="card-body p-5 text-center">
                <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style="width: 80px; height: 80px;">
                  <i class="bi bi-search display-4 text-primary"></i>
                </div>
                <h3 class="h4 fw-bold mb-3">I Need a Tutor</h3>
                <p class="text-muted mb-4">
                  Find qualified tutors in your area for any subject. Get personalized help with your studies 
                  from verified students and professionals.
                </p>
                <div class="row g-3 mb-4">
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-check-circle-fill text-success me-2"></i>
                      <small>Verified Tutors</small>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-check-circle-fill text-success me-2"></i>
                      <small>All Subjects</small>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-check-circle-fill text-success me-2"></i>
                      <small>Flexible Scheduling</small>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-check-circle-fill text-success me-2"></i>
                      <small>Instant Booking</small>
                    </div>
                  </div>
                </div>
                <button class="btn btn-primary btn-lg w-100" onclick="navigateTo('find-tutors')">
                  Browse Tutors
                </button>
              </div>
            </div>
          </div>
          
          <!-- Become a Tutor Card -->
          <div class="col-lg-6">
            <div class="card h-100 border-0 shadow-lg">
              <div class="card-body p-5 text-center">
                <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style="width: 80px; height: 80px;">
                  <i class="bi bi-person-plus display-4 text-success"></i>
                </div>
                <h3 class="h4 fw-bold mb-3">I Want to Tutor</h3>
                <p class="text-muted mb-4">
                  Share your knowledge and earn money by helping other students. Join our community 
                  of verified tutors and make a difference.
                </p>
                <div class="row g-3 mb-4">
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-check-circle-fill text-success me-2"></i>
                      <small>Set Your Rate</small>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-check-circle-fill text-success me-2"></i>
                      <small>Flexible Hours</small>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-check-circle-fill text-success me-2"></i>
                      <small>Instant Approval</small>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-check-circle-fill text-success me-2"></i>
                      <small>Secure Payments</small>
                    </div>
                  </div>
                </div>
                <button class="btn btn-success btn-lg w-100" onclick="navigateTo('become-tutor')">
                  Start Teaching
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="bg-light py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mx-auto text-center mb-5">
              <h2 class="h3 fw-bold mb-3">Why Choose TutorApp?</h2>
              <p class="text-muted">We make tutoring simple, secure, and effective for everyone.</p>
            </div>
          </div>
          
          <div class="row g-4">
            <div class="col-md-4">
              <div class="text-center">
                <div class="bg-white rounded-3 p-4 shadow-sm">
                  <i class="bi bi-shield-check display-4 text-primary mb-3"></i>
                  <h4 class="h5 fw-semibold">Verified & Safe</h4>
                  <p class="text-muted mb-0">All tutors are background-checked and verified for quality and safety.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="text-center">
                <div class="bg-white rounded-3 p-4 shadow-sm">
                  <i class="bi bi-credit-card display-4 text-success mb-3"></i>
                  <h4 class="h5 fw-semibold">Secure Payments</h4>
                  <p class="text-muted mb-0">Safe and secure payment processing with money-back guarantee.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="text-center">
                <div class="bg-white rounded-3 p-4 shadow-sm">
                  <i class="bi bi-headset display-4 text-info mb-3"></i>
                  <h4 class="h5 fw-semibold">24/7 Support</h4>
                  <p class="text-muted mb-0">Get help whenever you need it with our dedicated support team.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="container py-5">
        <div class="row text-center">
          <div class="col-md-3">
            <div class="h2 fw-bold text-primary mb-1">500+</div>
            <div class="text-muted">Active Tutors</div>
          </div>
          <div class="col-md-3">
            <div class="h2 fw-bold text-success mb-1">1,200+</div>
            <div class="text-muted">Students Helped</div>
          </div>
          <div class="col-md-3">
            <div class="h2 fw-bold text-info mb-1">50+</div>
            <div class="text-muted">Subjects</div>
          </div>
          <div class="col-md-3">
            <div class="h2 fw-bold text-warning mb-1">4.9★</div>
            <div class="text-muted">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Find Tutors page
function getFindTutorsPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <!-- Header Section -->
      <div class="bg-white shadow-sm border-bottom">
        <div class="container py-4">
          <div class="row align-items-center">
            <div class="col-lg-6 mb-4 mb-lg-0">
              <h1 class="h2 fw-bold text-dark">✨ Find Your Perfect Tutor</h1>
              <p class="text-muted mb-0">
                Connect with expert tutors in your area. <span id="tutor-count">${AppState.tutors.length}</span> tutors available
              </p>
            </div>
            
            <!-- Search Bar -->
            <div class="col-lg-6">
              <div class="position-relative">
                <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  id="search-input"
                  class="form-control form-control-lg ps-5"
                  placeholder="Search by name, subject, or keyword..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container py-4">
        <div class="row">
          <!-- Filters Sidebar -->
          <div class="col-lg-3 mb-4">
            <div class="bg-white p-4 rounded-3 shadow-sm border">
              <h3 class="h5 fw-semibold text-dark mb-4">Filters</h3>
              
              <!-- Subject Filter -->
              <div class="mb-4">
                <label class="form-label fw-medium">Subject</label>
                <select id="subject-filter" class="form-select">
                  <option value="">All Subjects</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                  <option value="Economics">Economics</option>
                  <option value="Statistics">Statistics</option>
                </select>
              </div>

              <!-- Price Range -->
              <div class="mb-4">
                <label class="form-label fw-medium">
                  Hourly Rate: $<span id="min-price">0</span> - $<span id="max-price">100</span>
                </label>
                <div class="row g-2">
                  <div class="col-6">
                    <input type="range" id="min-price-range" class="form-range" min="0" max="100" value="0">
                  </div>
                  <div class="col-6">
                    <input type="range" id="max-price-range" class="form-range" min="0" max="100" value="100">
                  </div>
                </div>
              </div>

              <!-- Rating Filter -->
              <div class="mb-4">
                <label class="form-label fw-medium">Minimum Rating</label>
                <select id="rating-filter" class="form-select">
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              <!-- Clear Filters -->
              <button id="clear-filters" class="btn btn-outline-secondary w-100">
                Clear All Filters
              </button>
            </div>
          </div>

          <!-- Tutors Grid -->
          <div class="col-lg-9">
            <div id="tutors-container" class="row g-4">
              <!-- Tutors will be loaded here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initializeFindTutorsPage() {
  // Load tutors
  loadTutors();
  
  // Set up event listeners
  setupFindTutorsEventListeners();
}

async function loadTutors() {
  const tutorsContainer = document.getElementById('tutors-container');
  
  // Show loading state
  tutorsContainer.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="loading-spinner mx-auto mb-3"></div>
      <p class="text-muted">Loading tutors...</p>
    </div>
  `;
  
  try {
    // Try to load from API first
    const response = await fetch('http://localhost:5001/api/tutors');
    if (response.ok) {
      const data = await response.json();
      const apiTutors = data.map(tutor => ({
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
      
      // Merge API tutors with existing tutors (from localStorage)
      const existingTutors = [...AppState.tutors];
      AppState.tutors = apiTutors;
      
      // Add any tutors from localStorage that aren't in the API
      existingTutors.forEach(localTutor => {
        if (!AppState.tutors.find(t => t.id === localTutor.id)) {
          AppState.tutors.push(localTutor);
        }
      });
    } else {
      throw new Error('API not available');
    }
  } catch (error) {
    console.log('Using existing tutors data:', error.message);
    // Keep existing tutors data
  }
  
  const tutors = getFilteredTutors();
  
  if (tutors.length === 0) {
    tutorsContainer.innerHTML = `
      <div class="col-12">
        <div class="bg-white rounded-3 shadow-sm border p-5 text-center">
          <div class="w-16 h-16 mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center mb-4">
            <i class="bi bi-person text-muted fs-3"></i>
          </div>
          <h3 class="h5 fw-medium text-dark mb-2">No tutors found</h3>
          <p class="text-muted mb-4">
            Try adjusting your filters or search terms to find more tutors.
          </p>
          <button class="btn btn-primary" onclick="clearFilters()">
            Clear Filters
          </button>
        </div>
      </div>
    `;
    return;
  }
  
  tutorsContainer.innerHTML = tutors.map(tutor => getTutorCardHTML(tutor)).join('');
}

function getTutorCardHTML(tutor) {
  const subjects = tutor.subjects.slice(0, 3).map((subject, index) => {
    const classes = ['subject-tag'];
    if (index === 0) classes.push('primary');
    else if (index === 1) classes.push('secondary');
    else classes.push('tertiary');
    
    return `<span class="${classes.join(' ')}">${subject}</span>`;
  }).join('');
  
  const moreSubjects = tutor.subjects.length > 3 ? 
    `<span class="subject-tag bg-light text-muted">+${tutor.subjects.length - 3} more</span>` : '';
  
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starClass = i < Math.floor(tutor.rating) ? 'star' : 'star empty';
    return `<i class="bi bi-star-fill ${starClass}"></i>`;
  }).join('');
  
  return `
    <div class="col-md-6 col-xl-4">
      <div class="card tutor-card h-100 shadow-hover">
        <div class="card-body p-4">
          <!-- Header with Avatar and Status -->
          <div class="tutor-card-header">
            <div class="tutor-card-info">
              <div class="tutor-avatar me-3">
                ${tutor.name.charAt(0)}
              </div>
              <div class="flex-grow-1 min-width-0">
                <h5 class="tutor-card-name">${tutor.name}</h5>
                <div class="tutor-card-details">
                  <span>${tutor.major}</span>
                  <span class="mx-2">•</span>
                  <span>${tutor.year}</span>
                </div>
                ${tutor.university ? `<div class="tutor-card-university">${tutor.university}</div>` : ''}
              </div>
            </div>
            
            ${tutor.isVerified ? `
              <div class="tutor-verified-badge">
                <i class="bi bi-check-circle-fill"></i>
                <span>Verified</span>
              </div>
            ` : ''}
          </div>

          <!-- Rating and Availability -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="star-rating">
              ${stars}
              <span class="ms-2 fw-medium">${tutor.rating}</span>
              <span class="text-muted">(${tutor.reviews})</span>
            </div>
            
            <div class="d-flex align-items-center">
              <div class="online-indicator me-2"></div>
              <span class="text-success small fw-medium">${tutor.availability}</span>
            </div>
          </div>

          <!-- Bio -->
          <p class="card-text text-muted small line-clamp-3 mb-3">
            ${tutor.bio}
          </p>

          <!-- Subjects Tags -->
          <div class="mb-4">
            ${subjects}
            ${moreSubjects}
          </div>
        </div>

        <!-- Footer with Price and Actions -->
        <div class="card-footer bg-light border-0 p-4">
          <div class="d-flex justify-content-between align-items-center">
            <!-- Price -->
            <div class="d-flex align-items-baseline">
              <span class="price-display">$${tutor.hourlyRate}</span>
              <span class="price-unit">/hour</span>
            </div>
            
            <!-- Action Buttons -->
            <div class="d-flex align-items-center">
              <button class="btn btn-link text-muted p-2 me-1" title="Favorite">
                <i class="bi bi-heart"></i>
              </button>
              <button class="btn btn-link text-muted p-2 me-2" title="Message">
                <i class="bi bi-chat-dots"></i>
              </button>
              <button class="btn btn-primary" onclick="openBookingModal(${tutor.id})">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupFindTutorsEventListeners() {
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(loadTutors, 300));
  }
  
  // Filters
  const subjectFilter = document.getElementById('subject-filter');
  const minPriceRange = document.getElementById('min-price-range');
  const maxPriceRange = document.getElementById('max-price-range');
  const ratingFilter = document.getElementById('rating-filter');
  const clearFiltersBtn = document.getElementById('clear-filters');
  
  if (subjectFilter) {
    subjectFilter.addEventListener('change', loadTutors);
  }
  
  if (minPriceRange) {
    minPriceRange.addEventListener('input', function() {
      document.getElementById('min-price').textContent = this.value;
      loadTutors();
    });
  }
  
  if (maxPriceRange) {
    maxPriceRange.addEventListener('input', function() {
      document.getElementById('max-price').textContent = this.value;
      loadTutors();
    });
  }
  
  if (ratingFilter) {
    ratingFilter.addEventListener('change', loadTutors);
  }
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearFilters);
  }
}

function getFilteredTutors() {
  const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
  const selectedSubject = document.getElementById('subject-filter')?.value || '';
  const minPrice = parseInt(document.getElementById('min-price-range')?.value || 0);
  const maxPrice = parseInt(document.getElementById('max-price-range')?.value || 100);
  const minRating = parseFloat(document.getElementById('rating-filter')?.value || 0);
  
  return AppState.tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm) ||
                         tutor.bio.toLowerCase().includes(searchTerm) ||
                         tutor.subjects.some(subject => 
                           subject.toLowerCase().includes(searchTerm)
                         );
    
    const matchesSubject = !selectedSubject || tutor.subjects.includes(selectedSubject);
    const matchesPrice = tutor.hourlyRate >= minPrice && tutor.hourlyRate <= maxPrice;
    const matchesRating = tutor.rating >= minRating;

    return matchesSearch && matchesSubject && matchesPrice && matchesRating;
  });
}

function clearFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('subject-filter').value = '';
  document.getElementById('min-price-range').value = '0';
  document.getElementById('max-price-range').value = '100';
  document.getElementById('rating-filter').value = '0';
  document.getElementById('min-price').textContent = '0';
  document.getElementById('max-price').textContent = '100';
  loadTutors();
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Placeholder functions for other pages
function getLoginPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app d-flex align-items-center py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <div class="text-center mb-4">
              <h2 class="h3 fw-bold text-dark">Sign in to your account</h2>
              <p class="text-muted">
                Or <a href="#" class="text-primary text-decoration-none" onclick="navigateTo('signup')">create a new account</a>
              </p>
            </div>
            
            <div class="bg-white rounded-3 shadow-sm p-4">
              <form id="login-form">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="email" required>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" required>
                </div>
                
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="rememberMe">
                    <label class="form-check-label" for="rememberMe">Remember me</label>
                  </div>
                  <a href="#" class="text-primary text-decoration-none small">Forgot password?</a>
                </div>
                
                <button type="submit" class="btn btn-primary w-100 mb-3">Sign in</button>
              </form>
              
              <div class="text-center">
                <div class="position-relative mb-3">
                  <hr>
                  <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">Or continue with</span>
                </div>
                
                <div class="row g-2">
                  <div class="col-6">
                    <button class="btn btn-outline-secondary w-100">
                      <i class="bi bi-google me-2"></i>Google
                    </button>
                  </div>
                  <div class="col-6">
                    <button class="btn btn-outline-secondary w-100">
                      <i class="bi bi-facebook me-2"></i>Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initializeLoginPage() {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Simple validation
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  try {
    const user = await TutorAppAPI.login(email, password);
    login(user);
    navigateTo('dashboard');
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
}

// Signup page
function getSignupPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app d-flex align-items-center py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="text-center mb-4">
              <h2 class="h3 fw-bold text-dark">Create your account</h2>
              <p class="text-muted">
                Or <a href="#" class="text-primary text-decoration-none" onclick="navigateTo('login')">sign in to existing account</a>
              </p>
            </div>
            
            <div class="bg-white rounded-3 shadow-sm p-4">
              <!-- User Type Selection -->
              <div class="mb-4">
                <p class="fw-medium mb-3">I want to:</p>
                <div class="row g-2">
                  <div class="col-6">
                    <input type="radio" class="btn-check" name="userType" id="userType-student" value="student" checked>
                    <label class="btn btn-outline-primary w-100" for="userType-student">
                      Find Tutors
                    </label>
                  </div>
                  <div class="col-6">
                    <input type="radio" class="btn-check" name="userType" id="userType-tutor" value="tutor">
                    <label class="btn btn-outline-primary w-100" for="userType-tutor">
                      Become a Tutor
                    </label>
                  </div>
                </div>
              </div>
              
              <form id="signup-form">
                <div class="row g-3 mb-3">
                  <div class="col-6">
                    <label for="firstName" class="form-label">First name</label>
                    <input type="text" class="form-control" id="firstName" required>
                  </div>
                  <div class="col-6">
                    <label for="lastName" class="form-label">Last name</label>
                    <input type="text" class="form-control" id="lastName" required>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="signup-email" class="form-label">Email address</label>
                  <input type="email" class="form-control" id="signup-email" required>
                </div>
                
                <div class="mb-3">
                  <label for="signup-password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="signup-password" required>
                </div>
                
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm password</label>
                  <input type="password" class="form-control" id="confirmPassword" required>
                </div>
                
                <div id="university-field" class="mb-3 d-none">
                  <label for="university" class="form-label">University/College</label>
                  <input type="text" class="form-control" id="university" placeholder="Your university name">
                </div>
                
                <div class="form-check mb-4">
                  <input class="form-check-input" type="checkbox" id="terms" required>
                  <label class="form-check-label" for="terms">
                    I agree to the <a href="#" class="text-primary text-decoration-none">Terms and Conditions</a> 
                    and <a href="#" class="text-primary text-decoration-none">Privacy Policy</a>
                  </label>
                </div>
                
                <button type="submit" class="btn btn-primary w-100 mb-3">Create account</button>
              </form>
              
              <div class="text-center">
                <div class="position-relative mb-3">
                  <hr>
                  <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">Or continue with</span>
                </div>
                
                <div class="row g-2">
                  <div class="col-6">
                    <button class="btn btn-outline-secondary w-100">
                      <i class="bi bi-google me-2"></i>Google
                    </button>
                  </div>
                  <div class="col-6">
                    <button class="btn btn-outline-secondary w-100">
                      <i class="bi bi-facebook me-2"></i>Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initializeSignupPage() {
  const form = document.getElementById('signup-form');
  const userTypeInputs = document.querySelectorAll('input[name="userType"]');
  const universityField = document.getElementById('university-field');
  
  if (form) {
    form.addEventListener('submit', handleSignup);
  }
  
  // Show/hide university field based on user type
  userTypeInputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.value === 'tutor') {
        universityField.classList.remove('d-none');
        document.getElementById('university').required = true;
      } else {
        universityField.classList.add('d-none');
        document.getElementById('university').required = false;
      }
    });
  });
}

async function handleSignup(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const userType = document.querySelector('input[name="userType"]:checked').value;
  const university = document.getElementById('university').value;
  const terms = document.getElementById('terms').checked;
  
  // Validation
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    alert('Please fill in all required fields');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  if (!terms) {
    alert('Please accept the terms and conditions');
    return;
  }
  
  if (userType === 'tutor' && !university) {
    alert('Please enter your university/college name');
    return;
  }
  
  try {
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      userType: userType,
      university: university
    };
    
    const result = await TutorAppAPI.signup(userData);
    alert('Account created successfully! Redirecting to login...');
    
    // Redirect to login page
    setTimeout(() => {
      navigateTo('login');
    }, 1500);
  } catch (error) {
    alert('Signup failed: ' + error.message);
  }
}
// Helper functions for page interactions
function scrollToForm() {
  document.getElementById('tutor-application')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToFAQ() {
  document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
}

function openLiveChat() {
  alert('Live chat feature coming soon! For now, please use the contact form below.');
}

function openEmailForm() {
  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
}

function showPhoneNumber() {
  alert('Call us at: 1-800-TUTOR-APP\n\nHours: 24/7 Support');
}

function updateRateDisplay() {
  const slider = document.getElementById('rate-slider');
  const display = document.getElementById('rate-display');
  if (slider && display) {
    display.value = slider.value;
  }
}

function updateRateSlider() {
  const slider = document.getElementById('rate-slider');
  const display = document.getElementById('rate-display');
  if (slider && display) {
    slider.value = display.value;
  }
}

function getBecomeTutorPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <!-- Hero Section -->
      <div class="bg-gradient-primary text-white py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h1 class="display-5 fw-bold mb-4">Become a Tutor</h1>
              <p class="lead mb-4">
                Share your knowledge and earn money by helping students succeed. 
                Join our community of verified tutors and make a difference.
              </p>
              <div class="d-flex flex-wrap gap-3">
                <button class="btn btn-light btn-lg" onclick="scrollToForm()">Apply Now</button>
                <button class="btn btn-outline-light btn-lg" onclick="navigateTo('how-it-works')">Learn More</button>
              </div>
            </div>
            <div class="col-lg-6 text-center">
              <div class="bg-white bg-opacity-90 rounded-3 p-4 shadow-lg">
                <i class="bi bi-mortarboard display-1 mb-3 text-primary"></i>
                <h3 class="h4 text-dark fw-bold">Start Earning Today</h3>
                <p class="mb-0 text-muted">Average tutor earns $35-60/hour</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Benefits Section -->
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="h3 fw-bold mb-3">Why Become a Tutor?</h2>
            <p class="text-muted">Join thousands of successful tutors who are making a difference while earning great money.</p>
          </div>
        </div>
        
        <div class="row g-4">
          <div class="col-md-4">
            <div class="text-center">
              <div class="bg-primary bg-opacity-10 rounded-3 p-4 mb-3">
                <i class="bi bi-currency-dollar display-4 text-primary"></i>
              </div>
              <h4 class="h5 fw-semibold">Flexible Earnings</h4>
              <p class="text-muted">Set your own rates and schedule. Earn $25-100+ per hour based on your expertise.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center">
              <div class="bg-success bg-opacity-10 rounded-3 p-4 mb-3">
                <i class="bi bi-clock display-4 text-success"></i>
              </div>
              <h4 class="h5 fw-semibold">Work When You Want</h4>
              <p class="text-muted">Choose your own hours. Work part-time or full-time, online or in-person.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center">
              <div class="bg-info bg-opacity-10 rounded-3 p-4 mb-3">
                <i class="bi bi-people display-4 text-info"></i>
              </div>
              <h4 class="h5 fw-semibold">Make a Difference</h4>
              <p class="text-muted">Help students achieve their goals while building your teaching portfolio.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Application Form -->
      <div class="container py-5" id="tutor-application">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="bg-white rounded-3 shadow-sm p-5">
              <h2 class="h3 fw-bold text-center mb-4">Become a Tutor</h2>
              <p class="text-muted text-center mb-5">Fill out the form below and you'll instantly become a verified tutor on our platform!</p>
              
              <form id="tutor-application-form">
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">First Name *</label>
                    <input type="text" class="form-control" id="tutor-firstName" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Last Name *</label>
                    <input type="text" class="form-control" id="tutor-lastName" required>
                  </div>
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">Email Address *</label>
                  <input type="email" class="form-control" id="tutor-email" required>
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">University/College *</label>
                  <input type="text" class="form-control" id="tutor-university" required>
                </div>
                
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Major/Field of Study *</label>
                    <input type="text" class="form-control" id="tutor-major" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Year/Graduation Status *</label>
                    <select class="form-select" id="tutor-year" required>
                      <option value="">Select year</option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate Student</option>
                      <option value="Graduated">Graduated</option>
                    </select>
                  </div>
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">Subjects You Can Tutor *</label>
                  <div class="row g-2">
                    <div class="col-md-4">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Mathematics" id="subject-math">
                        <label class="form-check-label" for="subject-math">Mathematics</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Computer Science" id="subject-cs">
                        <label class="form-check-label" for="subject-cs">Computer Science</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Physics" id="subject-physics">
                        <label class="form-check-label" for="subject-physics">Physics</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Chemistry" id="subject-chemistry">
                        <label class="form-check-label" for="subject-chemistry">Chemistry</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="Biology" id="subject-biology">
                        <label class="form-check-label" for="subject-biology">Biology</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="English" id="subject-english">
                        <label class="form-check-label" for="subject-english">English</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">Hourly Rate (USD) *</label>
                  <div class="row g-2">
                    <div class="col-md-6">
                      <input type="range" class="form-range" id="rate-slider" min="20" max="100" value="35" oninput="updateRateDisplay()">
                    </div>
                    <div class="col-md-6">
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input type="number" class="form-control" id="rate-display" value="35" min="20" max="100" onchange="updateRateSlider()">
                        <span class="input-group-text">/hour</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">Teaching Experience *</label>
                  <textarea class="form-control" id="tutor-experience" rows="4" placeholder="Describe your teaching, tutoring, or mentoring experience..." required></textarea>
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold">Why do you want to become a tutor? *</label>
                  <textarea class="form-control" id="tutor-motivation" rows="3" placeholder="Tell us about your passion for teaching and helping students..." required></textarea>
                </div>
                
                <div class="form-check mb-4">
                  <input class="form-check-input" type="checkbox" id="tutor-terms" required>
                  <label class="form-check-label" for="tutor-terms">
                    I agree to the <a href="#" class="text-primary">Tutor Terms of Service</a> and <a href="#" class="text-primary">Code of Conduct</a>
                  </label>
                </div>
                
                <div class="text-center">
                  <button type="submit" class="btn btn-primary btn-lg px-5">Become a Tutor Now</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
function getHowItWorksPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="bg-white py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
              <h1 class="display-5 fw-bold mb-4">How TutorApp Works</h1>
              <p class="lead text-muted">
                Getting started with TutorApp is simple. Whether you're a student looking for help 
                or a tutor ready to teach, we've made the process easy and secure.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <h2 class="h3 fw-bold text-center mb-5">For Students</h2>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                      <span class="fw-bold fs-4">1</span>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-4">
                    <h4 class="h5 fw-semibold">Create Your Account</h4>
                    <p class="text-muted mb-0">Sign up as a student and tell us about your academic needs and goals.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                      <span class="fw-bold fs-4">2</span>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-4">
                    <h4 class="h5 fw-semibold">Find Your Perfect Tutor</h4>
                    <p class="text-muted mb-0">Browse verified tutors by subject, rating, price, and availability.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                      <span class="fw-bold fs-4">3</span>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-4">
                    <h4 class="h5 fw-semibold">Book a Session</h4>
                    <p class="text-muted mb-0">Choose your preferred time and book instantly with secure payment.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                      <span class="fw-bold fs-4">4</span>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-4">
                    <h4 class="h5 fw-semibold">Learn & Succeed</h4>
                    <p class="text-muted mb-0">Meet with your tutor online or in-person and achieve your academic goals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <h2 class="h3 fw-bold text-center mb-5">For Tutors</h2>
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="d-flex">
                    <div class="flex-shrink-0">
                      <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                        <span class="fw-bold fs-4">1</span>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-4">
                      <h4 class="h5 fw-semibold">Apply to Teach</h4>
                      <p class="text-muted mb-0">Submit your application with your academic background and teaching experience.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex">
                    <div class="flex-shrink-0">
                      <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                        <span class="fw-bold fs-4">2</span>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-4">
                      <h4 class="h5 fw-semibold">Get Verified</h4>
                      <p class="text-muted mb-0">We review your application and verify your credentials within 2-3 days.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex">
                    <div class="flex-shrink-0">
                      <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                        <span class="fw-bold fs-4">3</span>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-4">
                      <h4 class="h5 fw-semibold">Set Your Schedule</h4>
                      <p class="text-muted mb-0">Create your profile, set your rates, and choose your available hours.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex">
                    <div class="flex-shrink-0">
                      <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                        <span class="fw-bold fs-4">4</span>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-4">
                      <h4 class="h5 fw-semibold">Start Teaching</h4>
                      <p class="text-muted mb-0">Students book sessions with you and you start earning money teaching.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
function getSupportPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="bg-white py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8 text-center">
              <h1 class="display-5 fw-bold mb-4">Support Center</h1>
              <p class="lead text-muted">
                We're here to help! Find answers to common questions or contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <h2 class="h3 fw-bold text-center mb-5">Quick Help</h2>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="card h-100 border-0 shadow-sm">
                  <div class="card-body text-center p-4">
                    <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-question-circle display-6 text-primary"></i>
                    </div>
                    <h4 class="h5 fw-semibold">FAQ</h4>
                    <p class="text-muted mb-3">Find answers to frequently asked questions about using TutorApp.</p>
                    <button class="btn btn-outline-primary" onclick="scrollToFAQ()">View FAQ</button>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card h-100 border-0 shadow-sm">
                  <div class="card-body text-center p-4">
                    <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-chat-dots display-6 text-success"></i>
                    </div>
                    <h4 class="h5 fw-semibold">Live Chat</h4>
                    <p class="text-muted mb-3">Chat with our support team in real-time for immediate assistance.</p>
                    <button class="btn btn-outline-success" onclick="openLiveChat()">Start Chat</button>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card h-100 border-0 shadow-sm">
                  <div class="card-body text-center p-4">
                    <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-envelope display-6 text-info"></i>
                    </div>
                    <h4 class="h5 fw-semibold">Email Support</h4>
                    <p class="text-muted mb-3">Send us an email and we'll respond within 24 hours.</p>
                    <button class="btn btn-outline-info" onclick="openEmailForm()">Send Email</button>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card h-100 border-0 shadow-sm">
                  <div class="card-body text-center p-4">
                    <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-telephone display-6 text-warning"></i>
                    </div>
                    <h4 class="h5 fw-semibold">Phone Support</h4>
                    <p class="text-muted mb-3">Call us for urgent issues or complex problems.</p>
                    <button class="btn btn-outline-warning" onclick="showPhoneNumber()">Call Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white py-5" id="contact-form">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-5">
                  <h2 class="h3 fw-bold text-center mb-4">Contact Us</h2>
                  <p class="text-muted text-center mb-5">Send us a message and we'll get back to you as soon as possible.</p>
                  
                  <form id="support-form">
                    <div class="row g-3 mb-4">
                      <div class="col-md-6">
                        <label class="form-label fw-semibold">First Name *</label>
                        <input type="text" class="form-control" id="support-firstName" required>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-semibold">Last Name *</label>
                        <input type="text" class="form-control" id="support-lastName" required>
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <label class="form-label fw-semibold">Email Address *</label>
                      <input type="email" class="form-control" id="support-email" required>
                    </div>
                    
                    <div class="mb-4">
                      <label class="form-label fw-semibold">Subject *</label>
                      <select class="form-select" id="support-subject" required>
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Billing Question">Billing Question</option>
                        <option value="Tutor Application">Tutor Application</option>
                        <option value="Account Problem">Account Problem</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div class="mb-4">
                      <label class="form-label fw-semibold">Message *</label>
                      <textarea class="form-control" id="support-message" rows="5" placeholder="Please describe your issue or question in detail..." required></textarea>
                    </div>
                    
                    <div class="text-center">
                      <button type="submit" class="btn btn-primary btn-lg px-5">Send Message</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container py-5" id="faq-section">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <h2 class="h3 fw-bold text-center mb-5">Frequently Asked Questions</h2>
            <div class="accordion" id="supportFaqAccordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#supportFaq1">
                    How do I reset my password?
                  </button>
                </h2>
                <div id="supportFaq1" class="accordion-collapse collapse show" data-bs-parent="#supportFaqAccordion">
                  <div class="accordion-body">
                    Click "Forgot Password" on the login page and enter your email address. We'll send you a link to reset your password.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#supportFaq2">
                    How do I update my profile information?
                  </button>
                </h2>
                <div id="supportFaq2" class="accordion-collapse collapse" data-bs-parent="#supportFaqAccordion">
                  <div class="accordion-body">
                    Go to your dashboard and click on "Profile" to update your personal information, subjects, and availability.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#supportFaq3">
                    What payment methods do you accept?
                  </button>
                </h2>
                <div id="supportFaq3" class="accordion-collapse collapse" data-bs-parent="#supportFaqAccordion">
                  <div class="accordion-body">
                    We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for secure payments.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
function getDashboardPageHTML() {
  const user = AppState.currentUser;
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userType = user ? user.userType : 'student';
  
  // Return tutor dashboard if user is a tutor
  if (userType === 'tutor') {
    return getTutorDashboardHTML(userName);
  }
  
  return `
    <div class="min-vh-100 bg-gradient-app">
      <!-- Dashboard Header -->
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">Welcome back, ${userName}!</h1>
            <p class="text-muted mb-0">Here's your student dashboard - track your learning progress and manage your tutoring sessions</p>
          </div>
        </div>
        <div class="row">
          <!-- Quick Stats -->
          <div class="col-lg-8">
            <div class="row g-4 mb-5">
              <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center p-4">
                    <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-calendar-check display-6 text-primary"></i>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-1">3</h3>
                    <p class="text-muted mb-0">Upcoming Sessions</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center p-4">
                    <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-clock-history display-6 text-success"></i>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-1">24</h3>
                    <p class="text-muted mb-0">Hours Completed</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center p-4">
                    <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-currency-dollar display-6 text-info"></i>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-1">$1,080</h3>
                    <p class="text-muted mb-0">Total Invested</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Recent Activity</h3>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div class="list-group-item border-0 py-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-check-circle text-success"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Session Completed</h6>
                        <p class="text-muted mb-0 small">Mathematics with Sarah Johnson - 2 hours</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold text-success">Completed</div>
                        <div class="small text-muted">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item border-0 py-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-calendar-plus text-primary"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">New Booking</h6>
                        <p class="text-muted mb-0 small">Computer Science with Michael Chen - Tomorrow</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold text-primary">$110</div>
                        <div class="small text-muted">1 day ago</div>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item border-0 py-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-star text-warning"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Session Rated</h6>
                        <p class="text-muted mb-0 small">5-star rating for Sarah Johnson</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold text-warning">5.0</div>
                        <div class="small text-muted">3 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Study Progress -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Study Progress</h3>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-calculator text-primary"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Mathematics</h6>
                        <div class="progress" style="height: 6px;">
                          <div class="progress-bar bg-primary" style="width: 75%"></div>
                        </div>
                        <small class="text-muted">12 hours completed</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-laptop text-success"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Computer Science</h6>
                        <div class="progress" style="height: 6px;">
                          <div class="progress-bar bg-success" style="width: 60%"></div>
                        </div>
                        <small class="text-muted">8 hours completed</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Quick Actions -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Quick Actions</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-grid gap-3">
                  <button class="btn btn-primary" onclick="navigateTo('find-tutors')">
                    <i class="bi bi-search me-2"></i>Find Tutors
                  </button>
                  <button class="btn btn-outline-primary" onclick="navigateTo('bookings')">
                    <i class="bi bi-calendar-check me-2"></i>My Bookings
                  </button>
                  <button class="btn btn-outline-primary" onclick="navigateTo('messages')">
                    <i class="bi bi-chat-dots me-2"></i>Messages
                  </button>
                  <button class="btn btn-outline-primary" onclick="navigateTo('profile')">
                    <i class="bi bi-person me-2"></i>Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <!-- Upcoming Sessions -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Upcoming Sessions</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Sarah Johnson</h6>
                    <p class="text-muted mb-0 small">Mathematics</p>
                  </div>
                  <div class="text-end">
                    <div class="fw-semibold text-dark">Tomorrow</div>
                    <div class="small text-muted">2:00 PM</div>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Michael Chen</h6>
                    <p class="text-muted mb-0 small">Computer Science</p>
                  </div>
                  <div class="text-end">
                    <div class="fw-semibold text-dark">Friday</div>
                    <div class="small text-muted">10:00 AM</div>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-info"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Emily Rodriguez</h6>
                    <p class="text-muted mb-0 small">Biology</p>
                  </div>
                  <div class="text-end">
                    <div class="fw-semibold text-dark">Next Week</div>
                    <div class="small text-muted">3:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recommended Tutors -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Recommended Tutors</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-medium" style="width: 40px; height: 40px; font-size: 0.875rem;">
                    SJ
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Sarah Johnson</h6>
                    <p class="text-muted mb-0 small">Mathematics • 4.9★</p>
                  </div>
                  <button class="btn btn-sm btn-outline-primary">Book</button>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-gradient-success rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-medium" style="width: 40px; height: 40px; font-size: 0.875rem;">
                    MC
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Michael Chen</h6>
                    <p class="text-muted mb-0 small">Computer Science • 4.8★</p>
                  </div>
                  <button class="btn btn-sm btn-outline-primary">Book</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getTutorDashboardHTML(userName) {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <!-- Dashboard Header -->
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">Welcome back, ${userName}!</h1>
            <p class="text-muted mb-0">Here's your tutor dashboard - manage your students, track earnings, and grow your tutoring business</p>
          </div>
        </div>
        <div class="row">
          <!-- Quick Stats -->
          <div class="col-lg-8">
            <div class="row g-4 mb-5">
              <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center p-4">
                    <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-calendar-check display-6 text-primary"></i>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-1">5</h3>
                    <p class="text-muted mb-0">Upcoming Sessions</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center p-4">
                    <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-currency-dollar display-6 text-success"></i>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-1">$1,250</h3>
                    <p class="text-muted mb-0">This Month</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center p-4">
                    <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-star-fill display-6 text-info"></i>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-1">4.9</h3>
                    <p class="text-muted mb-0">Average Rating</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Recent Activity</h3>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div class="list-group-item border-0 py-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-check-circle text-success"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Session Completed</h6>
                        <p class="text-muted mb-0 small">Mathematics with John Smith - 2 hours</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold text-success">+$90</div>
                        <div class="small text-muted">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item border-0 py-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-calendar-plus text-primary"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">New Booking</h6>
                        <p class="text-muted mb-0 small">Computer Science with Sarah Wilson - Tomorrow</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold text-primary">$110</div>
                        <div class="small text-muted">1 day ago</div>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item border-0 py-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-star text-warning"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">New Review</h6>
                        <p class="text-muted mb-0 small">5-star rating from Mike Johnson</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-semibold text-warning">5.0</div>
                        <div class="small text-muted">3 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Teaching Performance -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Teaching Performance</h3>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-calculator text-primary"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Mathematics</h6>
                        <div class="progress" style="height: 6px;">
                          <div class="progress-bar bg-primary" style="width: 85%"></div>
                        </div>
                        <small class="text-muted">12 students • 4.9★ average</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-laptop text-success"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Computer Science</h6>
                        <div class="progress" style="height: 6px;">
                          <div class="progress-bar bg-success" style="width: 70%"></div>
                        </div>
                        <small class="text-muted">8 students • 4.8★ average</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Quick Actions -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Quick Actions</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-grid gap-3">
                  <button class="btn btn-primary" onclick="navigateTo('profile')">
                    <i class="bi bi-person me-2"></i>Update Profile
                  </button>
                  <button class="btn btn-outline-primary" onclick="navigateTo('bookings')">
                    <i class="bi bi-calendar-check me-2"></i>My Sessions
                  </button>
                  <button class="btn btn-outline-primary" onclick="navigateTo('messages')">
                    <i class="bi bi-chat-dots me-2"></i>Messages
                  </button>
                  <button class="btn btn-outline-primary" onclick="navigateTo('settings')">
                    <i class="bi bi-gear me-2"></i>Settings
                  </button>
                </div>
              </div>
            </div>

            <!-- Upcoming Sessions -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Upcoming Sessions</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">John Smith</h6>
                    <p class="text-muted mb-0 small">Mathematics</p>
                  </div>
                  <div class="text-end">
                    <div class="fw-semibold text-dark">Tomorrow</div>
                    <div class="small text-muted">2:00 PM</div>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Sarah Wilson</h6>
                    <p class="text-muted mb-0 small">Computer Science</p>
                  </div>
                  <div class="text-end">
                    <div class="fw-semibold text-dark">Friday</div>
                    <div class="small text-muted">10:00 AM</div>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-info"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Mike Johnson</h6>
                    <p class="text-muted mb-0 small">Physics</p>
                  </div>
                  <div class="text-end">
                    <div class="fw-semibold text-dark">Next Week</div>
                    <div class="small text-muted">3:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Student Requests -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Student Requests</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-warning"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Alex Brown</h6>
                    <p class="text-muted mb-0 small">Calculus • 2 hours</p>
                  </div>
                  <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-success">Accept</button>
                    <button class="btn btn-sm btn-outline-danger">Decline</button>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-info"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Emma Davis</h6>
                    <p class="text-muted mb-0 small">Data Structures • 1.5 hours</p>
                  </div>
                  <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-success">Accept</button>
                    <button class="btn btn-sm btn-outline-danger">Decline</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getProfilePageHTML() {
  const user = AppState.currentUser;
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userType = user ? user.userType : 'student';
  
  // Return tutor profile if user is a tutor
  if (userType === 'tutor') {
    return getTutorProfileHTML(userName);
  }
  
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Personal Information</h3>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">First Name</label>
                    <input type="text" class="form-control" value="${user ? user.firstName : ''}" readonly>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Last Name</label>
                    <input type="text" class="form-control" value="${user ? user.lastName : ''}" readonly>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Email</label>
                    <input type="email" class="form-control" value="${user ? user.email : ''}" readonly>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">University</label>
                    <input type="text" class="form-control" value="${user ? user.university || 'Not specified' : 'Not specified'}" readonly>
                  </div>
                </div>
                <div class="d-flex gap-2 mt-3">
                  <button class="btn btn-primary">Edit Profile</button>
                  <button class="btn btn-outline-secondary">Change Password</button>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Study Preferences</h3>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Subjects of Interest</label>
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge bg-primary">Mathematics</span>
                      <span class="badge bg-primary">Computer Science</span>
                      <span class="badge bg-primary">Physics</span>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Learning Style</label>
                    <p class="text-muted mb-0">Visual learner, prefers hands-on practice</p>
                  </div>
                </div>
                <button class="btn btn-outline-primary">Update Preferences</button>
              </div>
            </div>

            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Academic Goals</h3>
              </div>
              <div class="card-body p-4">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Current Goals</label>
                  <p class="text-muted">Improve calculus understanding, prepare for computer science exams, learn data structures</p>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Target GPA</label>
                  <p class="text-muted">3.8+</p>
                </div>
                <button class="btn btn-outline-primary">Set New Goals</button>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Profile Summary</h3>
              </div>
              <div class="card-body p-4 text-center">
                <div class="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-white fw-bold" style="width: 80px; height: 80px; font-size: 1.5rem;">
                  ${user ? user.firstName.charAt(0) : 'U'}
                </div>
                <h4 class="fw-bold text-dark mb-1">${userName}</h4>
                <p class="text-muted mb-3">Student Account</p>
                <div class="d-grid gap-2">
                  <button class="btn btn-primary">Edit Profile</button>
                  <button class="btn btn-outline-secondary">View Activity</button>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Tutoring History</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Sarah Johnson</h6>
                    <p class="text-muted mb-0 small">Mathematics • 12 sessions</p>
                  </div>
                  <div class="text-end">
                    <div class="fw-semibold text-warning">5.0★</div>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Michael Chen</h6>
                    <p class="text-muted mb-0 small">Computer Science • 8 sessions</p>
                  </div>
                  <div class="text-end">
                    <div class="fw-semibold text-warning">4.8★</div>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-info"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Emily Rodriguez</h6>
                    <p class="text-muted mb-0 small">Biology • 4 sessions</p>
                  </div>
                  <div class="text-end">
                    <div class="fw-semibold text-warning">4.9★</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Quick Stats</h3>
              </div>
              <div class="card-body p-4">
                <div class="row text-center">
                  <div class="col-6 mb-3">
                    <h4 class="fw-bold text-primary mb-1">24</h4>
                    <small class="text-muted">Hours Completed</small>
                  </div>
                  <div class="col-6 mb-3">
                    <h4 class="fw-bold text-success mb-1">12</h4>
                    <small class="text-muted">Sessions</small>
                  </div>
                  <div class="col-6">
                    <h4 class="fw-bold text-warning mb-1">4.9</h4>
                    <small class="text-muted">Avg Rating</small>
                  </div>
                  <div class="col-6">
                    <h4 class="fw-bold text-info mb-1">3</h4>
                    <small class="text-muted">Tutors</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getTutorProfileHTML(userName) {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Teaching Information</h3>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Subjects Taught</label>
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge bg-primary">Mathematics</span>
                      <span class="badge bg-primary">Computer Science</span>
                      <span class="badge bg-primary">Physics</span>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Hourly Rate</label>
                    <input type="text" class="form-control" value="$45/hour" readonly>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Availability</label>
                    <p class="text-muted mb-0">Monday-Friday: 2:00 PM - 8:00 PM<br>Weekends: 10:00 AM - 6:00 PM</p>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Teaching Experience</label>
                    <p class="text-muted mb-0">3+ years of tutoring experience</p>
                  </div>
                </div>
                <div class="d-flex gap-2 mt-3">
                  <button class="btn btn-primary">Edit Profile</button>
                  <button class="btn btn-outline-secondary">Update Availability</button>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Teaching Philosophy</h3>
              </div>
              <div class="card-body p-4">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Teaching Approach</label>
                  <p class="text-muted">I believe in making complex concepts simple and engaging. I focus on building strong foundations and helping students develop problem-solving skills.</p>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Specialties</label>
                  <p class="text-muted">Calculus, Linear Algebra, Data Structures, Algorithms, Web Development</p>
                </div>
                <button class="btn btn-outline-primary">Update Philosophy</button>
              </div>
            </div>

            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Student Feedback</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">John Smith</h6>
                    <p class="text-muted mb-0 small">Mathematics • 5★</p>
                    <p class="text-muted small">"Excellent tutor! Made calculus so much clearer."</p>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Sarah Wilson</h6>
                    <p class="text-muted mb-0 small">Computer Science • 5★</p>
                    <p class="text-muted small">"Great at explaining data structures and algorithms."</p>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-info"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Mike Johnson</h6>
                    <p class="text-muted mb-0 small">Physics • 4★</p>
                    <p class="text-muted small">"Very patient and knowledgeable tutor."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Profile Summary</h3>
              </div>
              <div class="card-body p-4 text-center">
                <div class="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-white fw-bold" style="width: 80px; height: 80px; font-size: 1.5rem;">
                  ${AppState.currentUser ? AppState.currentUser.firstName.charAt(0) : 'T'}
                </div>
                <h4 class="fw-bold text-dark mb-1">${userName}</h4>
                <p class="text-muted mb-3">Tutor Account</p>
                <div class="d-grid gap-2">
                  <button class="btn btn-primary">Edit Profile</button>
                  <button class="btn btn-outline-secondary">View Analytics</button>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Teaching Stats</h3>
              </div>
              <div class="card-body p-4">
                <div class="row text-center">
                  <div class="col-6 mb-3">
                    <h4 class="fw-bold text-primary mb-1">24</h4>
                    <small class="text-muted">Students</small>
                  </div>
                  <div class="col-6 mb-3">
                    <h4 class="fw-bold text-success mb-1">156</h4>
                    <small class="text-muted">Sessions</small>
                  </div>
                  <div class="col-6">
                    <h4 class="fw-bold text-warning mb-1">4.9</h4>
                    <small class="text-muted">Rating</small>
                  </div>
                  <div class="col-6">
                    <h4 class="fw-bold text-info mb-1">$7,020</h4>
                    <small class="text-muted">Earned</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Quick Actions</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-primary">Update Availability</button>
                  <button class="btn btn-outline-primary">Set Rates</button>
                  <button class="btn btn-outline-primary">View Analytics</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getBookingsPageHTML() {
  const user = AppState.currentUser;
  const userType = user ? user.userType : 'student';
  
  // Return tutor bookings if user is a tutor
  if (userType === 'tutor') {
    return getTutorBookingsHTML();
  }
  
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">My Bookings</h1>
            <p class="text-muted mb-0">Manage your tutoring sessions and track your learning progress</p>
          </div>
          <div class="col-lg-4 text-end">
            <button class="btn btn-primary" onclick="navigateTo('find-tutors')">
              <i class="bi bi-plus-circle me-2"></i>Book New Session
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="row mb-4">
          <div class="col-12">
            <ul class="nav nav-pills" id="bookingTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="upcoming-tab" data-bs-toggle="pill" data-bs-target="#upcoming" type="button" role="tab">
                  Upcoming Sessions
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="past-tab" data-bs-toggle="pill" data-bs-target="#past" type="button" role="tab">
                  Past Sessions
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="history-tab" data-bs-toggle="pill" data-bs-target="#history" type="button" role="tab">
                  Booking History
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="tab-content" id="bookingTabsContent">
          <!-- Upcoming Sessions -->
          <div class="tab-pane fade show active" id="upcoming" role="tabpanel">
            <div class="row">
              <div class="col-lg-8">
                <div class="card border-0 shadow-sm mb-4">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                        <i class="bi bi-person text-primary"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="fw-bold text-dark mb-1">Sarah Johnson</h5>
                        <p class="text-muted mb-0">Mathematics • Stanford University</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-primary">Tomorrow</div>
                        <div class="text-muted small">2:00 PM - 4:00 PM</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Subject:</strong> Calculus II</p>
                        <p class="mb-1"><strong>Duration:</strong> 2 hours</p>
                        <p class="mb-0"><strong>Rate:</strong> $45/hour</p>
                      </div>
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Total Cost:</strong> $90</p>
                        <p class="mb-1"><strong>Status:</strong> <span class="badge bg-success">Confirmed</span></p>
                        <p class="mb-0"><strong>Location:</strong> Online</p>
                      </div>
                    </div>
                    <div class="d-flex gap-2 mt-3">
                      <button class="btn btn-outline-primary btn-sm">Reschedule</button>
                      <button class="btn btn-outline-danger btn-sm">Cancel</button>
                      <button class="btn btn-primary btn-sm">Join Session</button>
                    </div>
                  </div>
                </div>

                <div class="card border-0 shadow-sm mb-4">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                        <i class="bi bi-person text-success"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="fw-bold text-dark mb-1">Michael Chen</h5>
                        <p class="text-muted mb-0">Computer Science • MIT</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-success">Friday</div>
                        <div class="text-muted small">10:00 AM - 12:00 PM</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Subject:</strong> Data Structures</p>
                        <p class="mb-1"><strong>Duration:</strong> 2 hours</p>
                        <p class="mb-0"><strong>Rate:</strong> $55/hour</p>
                      </div>
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Total Cost:</strong> $110</p>
                        <p class="mb-1"><strong>Status:</strong> <span class="badge bg-warning">Pending</span></p>
                        <p class="mb-0"><strong>Location:</strong> Online</p>
                      </div>
                    </div>
                    <div class="d-flex gap-2 mt-3">
                      <button class="btn btn-outline-primary btn-sm">Reschedule</button>
                      <button class="btn btn-outline-danger btn-sm">Cancel</button>
                      <button class="btn btn-outline-secondary btn-sm" disabled>Join Session</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="card border-0 shadow-sm">
                  <div class="card-header bg-white border-0 py-4">
                    <h3 class="h5 fw-bold text-dark mb-0">Quick Stats</h3>
                  </div>
                  <div class="card-body p-4">
                    <div class="row text-center">
                      <div class="col-6 mb-3">
                        <h4 class="fw-bold text-primary mb-1">3</h4>
                        <small class="text-muted">Upcoming</small>
                      </div>
                      <div class="col-6 mb-3">
                        <h4 class="fw-bold text-success mb-1">12</h4>
                        <small class="text-muted">Completed</small>
                      </div>
                      <div class="col-6">
                        <h4 class="fw-bold text-warning mb-1">$1,080</h4>
                        <small class="text-muted">Total Spent</small>
                      </div>
                      <div class="col-6">
                        <h4 class="fw-bold text-info mb-1">24h</h4>
                        <small class="text-muted">Hours</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Past Sessions -->
          <div class="tab-pane fade" id="past" role="tabpanel">
            <div class="row">
              <div class="col-lg-8">
                <div class="card border-0 shadow-sm mb-4">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                        <i class="bi bi-person text-success"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="fw-bold text-dark mb-1">Sarah Johnson</h5>
                        <p class="text-muted mb-0">Mathematics • Stanford University</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-success">Completed</div>
                        <div class="text-muted small">2 hours ago</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Subject:</strong> Calculus II</p>
                        <p class="mb-1"><strong>Duration:</strong> 2 hours</p>
                        <p class="mb-0"><strong>Rate:</strong> $45/hour</p>
                      </div>
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Total Cost:</strong> $90</p>
                        <p class="mb-1"><strong>Your Rating:</strong> <span class="text-warning">★★★★★</span></p>
                        <p class="mb-0"><strong>Status:</strong> <span class="badge bg-success">Completed</span></p>
                      </div>
                    </div>
                    <div class="d-flex gap-2 mt-3">
                      <button class="btn btn-outline-primary btn-sm">Book Again</button>
                      <button class="btn btn-outline-secondary btn-sm">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking History -->
          <div class="tab-pane fade" id="history" role="tabpanel">
            <div class="row">
              <div class="col-lg-8">
                <div class="card border-0 shadow-sm">
                  <div class="card-header bg-white border-0 py-4">
                    <h3 class="h5 fw-bold text-dark mb-0">Payment History</h3>
                  </div>
                  <div class="card-body p-0">
                    <div class="list-group list-group-flush">
                      <div class="list-group-item border-0 py-3">
                        <div class="d-flex align-items-center">
                          <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                            <i class="bi bi-check-circle text-success"></i>
                          </div>
                          <div class="flex-grow-1">
                            <h6 class="mb-1 fw-semibold">Sarah Johnson - Mathematics</h6>
                            <p class="text-muted mb-0 small">2 hours • Calculus II</p>
                          </div>
                          <div class="text-end">
                            <div class="fw-semibold text-success">$90</div>
                            <div class="small text-muted">2 hours ago</div>
                          </div>
                        </div>
                      </div>
                      <div class="list-group-item border-0 py-3">
                        <div class="d-flex align-items-center">
                          <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                            <i class="bi bi-calendar-check text-primary"></i>
                          </div>
                          <div class="flex-grow-1">
                            <h6 class="mb-1 fw-semibold">Michael Chen - Computer Science</h6>
                            <p class="text-muted mb-0 small">2 hours • Data Structures</p>
                          </div>
                          <div class="text-end">
                            <div class="fw-semibold text-primary">$110</div>
                            <div class="small text-muted">1 week ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getTutorBookingsHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">My Sessions</h1>
            <p class="text-muted mb-0">Manage your tutoring sessions and track your teaching schedule</p>
          </div>
          <div class="col-lg-4 text-end">
            <button class="btn btn-primary">
              <i class="bi bi-plus-circle me-2"></i>Set Availability
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="row mb-4">
          <div class="col-12">
            <ul class="nav nav-pills" id="tutorBookingTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="upcoming-tab" data-bs-toggle="pill" data-bs-target="#upcoming" type="button" role="tab">
                  Upcoming Sessions
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="past-tab" data-bs-toggle="pill" data-bs-target="#past" type="button" role="tab">
                  Past Sessions
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="requests-tab" data-bs-toggle="pill" data-bs-target="#requests" type="button" role="tab">
                  Student Requests
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="tab-content" id="tutorBookingTabsContent">
          <!-- Upcoming Sessions -->
          <div class="tab-pane fade show active" id="upcoming" role="tabpanel">
            <div class="row">
              <div class="col-lg-8">
                <div class="card border-0 shadow-sm mb-4">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                        <i class="bi bi-person text-primary"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="fw-bold text-dark mb-1">John Smith</h5>
                        <p class="text-muted mb-0">Mathematics • University of California</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-primary">Tomorrow</div>
                        <div class="text-muted small">2:00 PM - 4:00 PM</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Subject:</strong> Calculus II</p>
                        <p class="mb-1"><strong>Duration:</strong> 2 hours</p>
                        <p class="mb-0"><strong>Your Rate:</strong> $45/hour</p>
                      </div>
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Your Earnings:</strong> $90</p>
                        <p class="mb-1"><strong>Status:</strong> <span class="badge bg-success">Confirmed</span></p>
                        <p class="mb-0"><strong>Location:</strong> Online</p>
                      </div>
                    </div>
                    <div class="d-flex gap-2 mt-3">
                      <button class="btn btn-outline-primary btn-sm">Reschedule</button>
                      <button class="btn btn-outline-danger btn-sm">Cancel</button>
                      <button class="btn btn-primary btn-sm">Start Session</button>
                    </div>
                  </div>
                </div>

                <div class="card border-0 shadow-sm mb-4">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                        <i class="bi bi-person text-success"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="fw-bold text-dark mb-1">Sarah Wilson</h5>
                        <p class="text-muted mb-0">Computer Science • Stanford University</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-success">Friday</div>
                        <div class="text-muted small">10:00 AM - 12:00 PM</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Subject:</strong> Data Structures</p>
                        <p class="mb-1"><strong>Duration:</strong> 2 hours</p>
                        <p class="mb-0"><strong>Your Rate:</strong> $45/hour</p>
                      </div>
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Your Earnings:</strong> $90</p>
                        <p class="mb-1"><strong>Status:</strong> <span class="badge bg-warning">Pending</span></p>
                        <p class="mb-0"><strong>Location:</strong> Online</p>
                      </div>
                    </div>
                    <div class="d-flex gap-2 mt-3">
                      <button class="btn btn-outline-primary btn-sm">Reschedule</button>
                      <button class="btn btn-outline-danger btn-sm">Cancel</button>
                      <button class="btn btn-outline-secondary btn-sm" disabled>Start Session</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="card border-0 shadow-sm">
                  <div class="card-header bg-white border-0 py-4">
                    <h3 class="h5 fw-bold text-dark mb-0">Quick Stats</h3>
                  </div>
                  <div class="card-body p-4">
                    <div class="row text-center">
                      <div class="col-6 mb-3">
                        <h4 class="fw-bold text-primary mb-1">5</h4>
                        <small class="text-muted">Upcoming</small>
                      </div>
                      <div class="col-6 mb-3">
                        <h4 class="fw-bold text-success mb-1">156</h4>
                        <small class="text-muted">Completed</small>
                      </div>
                      <div class="col-6">
                        <h4 class="fw-bold text-warning mb-1">$7,020</h4>
                        <small class="text-muted">Total Earned</small>
                      </div>
                      <div class="col-6">
                        <h4 class="fw-bold text-info mb-1">24</h4>
                        <small class="text-muted">Students</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Past Sessions -->
          <div class="tab-pane fade" id="past" role="tabpanel">
            <div class="row">
              <div class="col-lg-8">
                <div class="card border-0 shadow-sm mb-4">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                        <i class="bi bi-person text-success"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="fw-bold text-dark mb-1">Mike Johnson</h5>
                        <p class="text-muted mb-0">Physics • MIT</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-success">Completed</div>
                        <div class="text-muted small">2 hours ago</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Subject:</strong> Mechanics</p>
                        <p class="mb-1"><strong>Duration:</strong> 1.5 hours</p>
                        <p class="mb-0"><strong>Your Rate:</strong> $45/hour</p>
                      </div>
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Your Earnings:</strong> $67.50</p>
                        <p class="mb-1"><strong>Student Rating:</strong> <span class="text-warning">★★★★★</span></p>
                        <p class="mb-0"><strong>Status:</strong> <span class="badge bg-success">Completed</span></p>
                      </div>
                    </div>
                    <div class="d-flex gap-2 mt-3">
                      <button class="btn btn-outline-primary btn-sm">Book Again</button>
                      <button class="btn btn-outline-secondary btn-sm">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Student Requests -->
          <div class="tab-pane fade" id="requests" role="tabpanel">
            <div class="row">
              <div class="col-lg-8">
                <div class="card border-0 shadow-sm mb-4">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                        <i class="bi bi-person text-warning"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="fw-bold text-dark mb-1">Alex Brown</h5>
                        <p class="text-muted mb-0">Calculus • University of Texas</p>
                      </div>
                      <div class="text-end">
                        <div class="fw-bold text-warning">Pending</div>
                        <div class="text-muted small">2 hours • $90</div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Subject:</strong> Calculus I</p>
                        <p class="mb-1"><strong>Duration:</strong> 2 hours</p>
                        <p class="mb-0"><strong>Requested Time:</strong> Tomorrow 3:00 PM</p>
                      </div>
                      <div class="col-md-6">
                        <p class="mb-1"><strong>Your Rate:</strong> $45/hour</p>
                        <p class="mb-1"><strong>Your Earnings:</strong> $90</p>
                        <p class="mb-0"><strong>Location:</strong> Online</p>
                      </div>
                    </div>
                    <div class="d-flex gap-2 mt-3">
                      <button class="btn btn-success btn-sm">Accept</button>
                      <button class="btn btn-outline-danger btn-sm">Decline</button>
                      <button class="btn btn-outline-primary btn-sm">Counter Offer</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getMessagesPageHTML() {
  const user = AppState.currentUser;
  const userType = user ? user.userType : 'student';
  
  // Return tutor messages if user is a tutor
  if (userType === 'tutor') {
    return getTutorMessagesHTML();
  }
  
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">Messages</h1>
            <p class="text-muted mb-0">Communicate with your tutors and manage your conversations</p>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-4">
            <!-- Conversations List -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Conversations</h3>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div class="list-group-item border-0 py-3 active">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-person text-primary"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Sarah Johnson</h6>
                        <p class="text-muted mb-0 small">Mathematics • Stanford University</p>
                      </div>
                      <div class="text-end">
                        <div class="badge bg-primary rounded-pill">2</div>
                        <div class="small text-muted">2 min ago</div>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item border-0 py-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-person text-success"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Michael Chen</h6>
                        <p class="text-muted mb-0 small">Computer Science • MIT</p>
                      </div>
                      <div class="text-end">
                        <div class="small text-muted">1 hour ago</div>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item border-0 py-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-person text-info"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Emily Rodriguez</h6>
                        <p class="text-muted mb-0 small">Biology • UC Berkeley</p>
                      </div>
                      <div class="text-end">
                        <div class="small text-muted">3 hours ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications -->
            <div class="card border-0 shadow-sm mt-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Notifications</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-calendar text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold small">Session Reminder</h6>
                    <p class="text-muted mb-0 small">Mathematics with Sarah Johnson tomorrow at 2:00 PM</p>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-check-circle text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold small">Session Confirmed</h6>
                    <p class="text-muted mb-0 small">Michael Chen confirmed your Friday session</p>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-star text-warning"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold small">Rate Your Session</h6>
                    <p class="text-muted mb-0 small">Rate your recent session with Sarah Johnson</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-8">
            <!-- Chat Interface -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <div class="d-flex align-items-center">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h5 class="fw-bold text-dark mb-1">Sarah Johnson</h5>
                    <p class="text-muted mb-0 small">Mathematics • Stanford University</p>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm">Video Call</button>
                    <button class="btn btn-outline-secondary btn-sm">Info</button>
                  </div>
                </div>
              </div>
              <div class="card-body p-4" style="height: 400px; overflow-y: auto;">
                <!-- Chat Messages -->
                <div class="d-flex align-items-start mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="bg-light rounded-3 p-3">
                      <p class="mb-0">Hi! I'm looking forward to our session tomorrow. What topics would you like to focus on?</p>
                    </div>
                    <small class="text-muted">Sarah Johnson • 2:30 PM</small>
                  </div>
                </div>

                <div class="d-flex align-items-start mb-3 justify-content-end">
                  <div class="flex-grow-1 text-end">
                    <div class="bg-primary text-white rounded-3 p-3">
                      <p class="mb-0">Hi Sarah! I'd like to focus on integration techniques and differential equations. I'm struggling with the substitution method.</p>
                    </div>
                    <small class="text-muted">You • 2:32 PM</small>
                  </div>
                  <div class="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center ms-3 text-white fw-medium" style="width: 30px; height: 30px; font-size: 0.75rem;">
                    ${AppState.currentUser ? AppState.currentUser.firstName.charAt(0) : 'U'}
                  </div>
                </div>

                <div class="d-flex align-items-start mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="bg-light rounded-3 p-3">
                      <p class="mb-0">Perfect! I'll prepare some practice problems for integration by substitution. We can also review the fundamental theorem of calculus.</p>
                    </div>
                    <small class="text-muted">Sarah Johnson • 2:35 PM</small>
                  </div>
                </div>

                <div class="d-flex align-items-start mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="bg-light rounded-3 p-3">
                      <p class="mb-0">I'll also bring some visual aids to help explain the concepts. See you tomorrow at 2:00 PM!</p>
                    </div>
                    <small class="text-muted">Sarah Johnson • 2:36 PM</small>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-white border-0 py-3">
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="Type your message...">
                  <button class="btn btn-primary" type="button">
                    <i class="bi bi-send"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Study Groups -->
            <div class="card border-0 shadow-sm mt-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Study Groups</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-people text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Calculus Study Group</h6>
                    <p class="text-muted mb-0 small">5 members • Last active 1 hour ago</p>
                  </div>
                  <button class="btn btn-outline-primary btn-sm">Join</button>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-people text-info"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Computer Science Study Group</h6>
                    <p class="text-muted mb-0 small">8 members • Last active 3 hours ago</p>
                  </div>
                  <button class="btn btn-outline-primary btn-sm">Join</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getTutorMessagesHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">Messages</h1>
            <p class="text-muted mb-0">Communicate with your students and manage your tutoring conversations</p>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-4">
            <!-- Student Conversations List -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Student Conversations</h3>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div class="list-group-item border-0 py-3 active">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-person text-primary"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">John Smith</h6>
                        <p class="text-muted mb-0 small">Mathematics • University of California</p>
                      </div>
                      <div class="text-end">
                        <div class="badge bg-primary rounded-pill">2</div>
                        <div class="small text-muted">2 min ago</div>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item border-0 py-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-person text-success"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Sarah Wilson</h6>
                        <p class="text-muted mb-0 small">Computer Science • Stanford University</p>
                      </div>
                      <div class="text-end">
                        <div class="small text-muted">1 hour ago</div>
                      </div>
                    </div>
                  </div>
                  <div class="list-group-item border-0 py-3">
                    <div class="d-flex align-items-center">
                      <div class="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <i class="bi bi-person text-info"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-1 fw-semibold">Mike Johnson</h6>
                        <p class="text-muted mb-0 small">Physics • MIT</p>
                      </div>
                      <div class="text-end">
                        <div class="small text-muted">3 hours ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Teaching Notifications -->
            <div class="card border-0 shadow-sm mt-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Teaching Notifications</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-calendar text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold small">Session Reminder</h6>
                    <p class="text-muted mb-0 small">Mathematics with John Smith tomorrow at 2:00 PM</p>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-star text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold small">New Review</h6>
                    <p class="text-muted mb-0 small">5-star rating from Sarah Wilson</p>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-person-plus text-warning"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold small">New Student Request</h6>
                    <p class="text-muted mb-0 small">Alex Brown wants to book Calculus session</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-8">
            <!-- Chat Interface -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <div class="d-flex align-items-center">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h5 class="fw-bold text-dark mb-1">John Smith</h5>
                    <p class="text-muted mb-0 small">Mathematics • University of California</p>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary btn-sm">Video Call</button>
                    <button class="btn btn-outline-secondary btn-sm">Student Info</button>
                  </div>
                </div>
              </div>
              <div class="card-body p-4" style="height: 400px; overflow-y: auto;">
                <!-- Chat Messages -->
                <div class="d-flex align-items-start mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="bg-light rounded-3 p-3">
                      <p class="mb-0">Hi! I'm looking forward to our session tomorrow. What topics would you like to focus on?</p>
                    </div>
                    <small class="text-muted">John Smith • 2:30 PM</small>
                  </div>
                </div>

                <div class="d-flex align-items-start mb-3 justify-content-end">
                  <div class="flex-grow-1 text-end">
                    <div class="bg-primary text-white rounded-3 p-3">
                      <p class="mb-0">Hi John! I'd like to focus on integration techniques and differential equations. I'm struggling with the substitution method.</p>
                    </div>
                    <small class="text-muted">You • 2:32 PM</small>
                  </div>
                  <div class="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center ms-3 text-white fw-medium" style="width: 30px; height: 30px; font-size: 0.75rem;">
                    ${AppState.currentUser ? AppState.currentUser.firstName.charAt(0) : 'T'}
                  </div>
                </div>

                <div class="d-flex align-items-start mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="bg-light rounded-3 p-3">
                      <p class="mb-0">Perfect! I'll prepare some practice problems for integration by substitution. We can also review the fundamental theorem of calculus.</p>
                    </div>
                    <small class="text-muted">John Smith • 2:35 PM</small>
                  </div>
                </div>

                <div class="d-flex align-items-start mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="bg-light rounded-3 p-3">
                      <p class="mb-0">I'll also bring some visual aids to help explain the concepts. See you tomorrow at 2:00 PM!</p>
                    </div>
                    <small class="text-muted">John Smith • 2:36 PM</small>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-white border-0 py-3">
                <div class="input-group">
                  <input type="text" class="form-control" placeholder="Type your message...">
                  <button class="btn btn-primary" type="button">
                    <i class="bi bi-send"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Teaching Groups -->
            <div class="card border-0 shadow-sm mt-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Teaching Groups</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-people text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Calculus Study Group</h6>
                    <p class="text-muted mb-0 small">5 students • Last active 1 hour ago</p>
                  </div>
                  <button class="btn btn-outline-primary btn-sm">Manage</button>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-people text-info"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">Computer Science Study Group</h6>
                    <p class="text-muted mb-0 small">8 students • Last active 3 hours ago</p>
                  </div>
                  <button class="btn btn-outline-primary btn-sm">Manage</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getSettingsPageHTML() {
  const user = AppState.currentUser;
  const userType = user ? user.userType : 'student';
  
  // Return tutor settings if user is a tutor
  if (userType === 'tutor') {
    return getTutorSettingsHTML();
  }
  
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">Settings</h1>
            <p class="text-muted mb-0">Manage your account preferences and privacy settings</p>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-8">
            <!-- Account Information -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Account Information</h3>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">First Name</label>
                    <input type="text" class="form-control" value="${user ? user.firstName : ''}">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Last Name</label>
                    <input type="text" class="form-control" value="${user ? user.lastName : ''}">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Email</label>
                    <input type="email" class="form-control" value="${user ? user.email : ''}">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">University</label>
                    <input type="text" class="form-control" value="${user ? user.university || '' : ''}">
                  </div>
                </div>
                <div class="d-flex gap-2 mt-3">
                  <button class="btn btn-primary">Save Changes</button>
                  <button class="btn btn-outline-secondary">Cancel</button>
                </div>
              </div>
            </div>

            <!-- Notification Preferences -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Notification Preferences</h3>
              </div>
              <div class="card-body p-4">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="emailNotifications" checked>
                  <label class="form-check-label fw-semibold" for="emailNotifications">
                    Email Notifications
                  </label>
                  <p class="text-muted small mb-0">Receive updates about sessions, messages, and account activity</p>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="sessionReminders" checked>
                  <label class="form-check-label fw-semibold" for="sessionReminders">
                    Session Reminders
                  </label>
                  <p class="text-muted small mb-0">Get reminded about upcoming tutoring sessions</p>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="messageNotifications" checked>
                  <label class="form-check-label fw-semibold" for="messageNotifications">
                    Message Notifications
                  </label>
                  <p class="text-muted small mb-0">Notify me when I receive new messages from tutors</p>
                </div>
              </div>
            </div>

            <!-- Help & Support -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Help & Support</h3>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <h6 class="fw-semibold mb-2">Frequently Asked Questions</h6>
                    <p class="text-muted small mb-3">Find answers to common questions about tutoring, payments, and platform features.</p>
                    <button class="btn btn-outline-primary btn-sm">View FAQ</button>
                  </div>
                  <div class="col-md-6 mb-3">
                    <h6 class="fw-semibold mb-2">Contact Support</h6>
                    <p class="text-muted small mb-3">Need help? Our support team is here to assist you with any questions or issues.</p>
                    <button class="btn btn-outline-primary btn-sm">Contact Us</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <!-- Account Security -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Account Security</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-shield-check text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold small">Password</h6>
                    <p class="text-muted mb-0 small">Last changed 3 months ago</p>
                  </div>
                  <button class="btn btn-outline-primary btn-sm">Change</button>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-phone text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold small">Two-Factor Authentication</h6>
                    <p class="text-muted mb-0 small">Add an extra layer of security</p>
                  </div>
                  <button class="btn btn-outline-primary btn-sm">Enable</button>
                </div>
              </div>
            </div>

            <!-- Account Actions -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Account Actions</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-primary">Export Data</button>
                  <button class="btn btn-outline-warning">Deactivate Account</button>
                  <button class="btn btn-outline-danger">Delete Account</button>
                </div>
                <div class="mt-3">
                  <small class="text-muted">
                    <strong>Note:</strong> Account deletion is permanent and cannot be undone.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getTutorSettingsHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">Tutor Settings</h1>
            <p class="text-muted mb-0">Manage your tutoring preferences, rates, and teaching settings</p>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-8">
            <!-- Teaching Information -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Teaching Information</h3>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Subjects Taught</label>
                    <div class="d-flex flex-wrap gap-2 mb-3">
                      <span class="badge bg-primary">Mathematics</span>
                      <span class="badge bg-primary">Computer Science</span>
                      <span class="badge bg-primary">Physics</span>
                      <button class="btn btn-outline-primary btn-sm">+ Add Subject</button>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Hourly Rate</label>
                    <input type="text" class="form-control" value="$45/hour">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Teaching Experience</label>
                    <input type="text" class="form-control" value="3+ years">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Education Level</label>
                    <select class="form-select">
                      <option>Bachelor's Degree</option>
                      <option>Master's Degree</option>
                      <option>PhD</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div class="d-flex gap-2 mt-3">
                  <button class="btn btn-primary">Save Changes</button>
                  <button class="btn btn-outline-secondary">Cancel</button>
                </div>
              </div>
            </div>

            <!-- Availability Settings -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Availability Settings</h3>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Available Days</label>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="monday" checked>
                      <label class="form-check-label" for="monday">Monday</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="tuesday" checked>
                      <label class="form-check-label" for="tuesday">Tuesday</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="wednesday" checked>
                      <label class="form-check-label" for="wednesday">Wednesday</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="thursday" checked>
                      <label class="form-check-label" for="thursday">Thursday</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="friday" checked>
                      <label class="form-check-label" for="friday">Friday</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="saturday">
                      <label class="form-check-label" for="saturday">Saturday</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="sunday">
                      <label class="form-check-label" for="sunday">Sunday</label>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Available Hours</label>
                    <div class="row">
                      <div class="col-6">
                        <label class="form-label small">Start Time</label>
                        <input type="time" class="form-control" value="14:00">
                      </div>
                      <div class="col-6">
                        <label class="form-label small">End Time</label>
                        <input type="time" class="form-control" value="20:00">
                      </div>
                    </div>
                  </div>
                </div>
                <button class="btn btn-primary">Update Availability</button>
              </div>
            </div>

            <!-- Teaching Preferences -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Teaching Preferences</h3>
              </div>
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Session Duration</label>
                    <select class="form-select">
                      <option>1 hour</option>
                      <option>1.5 hours</option>
                      <option>2 hours</option>
                      <option>Flexible</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Teaching Style</label>
                    <select class="form-select">
                      <option>Interactive</option>
                      <option>Lecture-based</option>
                      <option>Problem-solving focused</option>
                      <option>Mixed approach</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Preferred Location</label>
                    <select class="form-select">
                      <option>Online only</option>
                      <option>In-person only</option>
                      <option>Both online and in-person</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold">Student Level</label>
                    <select class="form-select">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>All levels</option>
                    </select>
                  </div>
                </div>
                <button class="btn btn-primary">Update Preferences</button>
              </div>
            </div>

            <!-- Notification Preferences -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Notification Preferences</h3>
              </div>
              <div class="card-body p-4">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="sessionReminders" checked>
                  <label class="form-check-label fw-semibold" for="sessionReminders">
                    Session Reminders
                  </label>
                  <p class="text-muted small mb-0">Get reminded about upcoming tutoring sessions</p>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="studentRequests" checked>
                  <label class="form-check-label fw-semibold" for="studentRequests">
                    Student Requests
                  </label>
                  <p class="text-muted small mb-0">Notify me when students request tutoring sessions</p>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="newReviews" checked>
                  <label class="form-check-label fw-semibold" for="newReviews">
                    New Reviews
                  </label>
                  <p class="text-muted small mb-0">Notify me when students leave reviews</p>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="paymentNotifications" checked>
                  <label class="form-check-label fw-semibold" for="paymentNotifications">
                    Payment Notifications
                  </label>
                  <p class="text-muted small mb-0">Notify me about payments and earnings</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <!-- Account Security -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Account Security</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-shield-check text-success"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold small">Password</h6>
                    <p class="text-muted mb-0 small">Last changed 3 months ago</p>
                  </div>
                  <button class="btn btn-outline-primary btn-sm">Change</button>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 30px; height: 30px;">
                    <i class="bi bi-phone text-primary"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold small">Two-Factor Authentication</h6>
                    <p class="text-muted mb-0 small">Add an extra layer of security</p>
                  </div>
                  <button class="btn btn-outline-primary btn-sm">Enable</button>
                </div>
              </div>
            </div>

            <!-- Teaching Analytics -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Teaching Analytics</h3>
              </div>
              <div class="card-body p-4">
                <div class="row text-center">
                  <div class="col-6 mb-3">
                    <h4 class="fw-bold text-primary mb-1">24</h4>
                    <small class="text-muted">Students</small>
                  </div>
                  <div class="col-6 mb-3">
                    <h4 class="fw-bold text-success mb-1">156</h4>
                    <small class="text-muted">Sessions</small>
                  </div>
                  <div class="col-6">
                    <h4 class="fw-bold text-warning mb-1">4.9</h4>
                    <small class="text-muted">Rating</small>
                  </div>
                  <div class="col-6">
                    <h4 class="fw-bold text-info mb-1">$7,020</h4>
                    <small class="text-muted">Earned</small>
                  </div>
                </div>
                <button class="btn btn-outline-primary btn-sm w-100">View Detailed Analytics</button>
              </div>
            </div>

            <!-- Account Actions -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Account Actions</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-primary">Export Data</button>
                  <button class="btn btn-outline-warning">Deactivate Account</button>
                  <button class="btn btn-outline-danger">Delete Account</button>
                </div>
                <div class="mt-3">
                  <small class="text-muted">
                    <strong>Note:</strong> Account deletion is permanent and cannot be undone.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Booking modal functions
function openBookingModal(tutorId) {
  const tutor = AppState.tutors.find(t => t.id === tutorId);
  if (!tutor) return;
  
  // Create and show modal
  const modalHTML = getBookingModalHTML(tutor);
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
  modal.show();
  
  // Set up event listeners
  setupBookingModalEventListeners(tutor);
}

function getBookingModalHTML(tutor) {
  return `
    <div class="modal fade" id="bookingModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Book a Session with ${tutor.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Date</label>
                  <input type="date" class="form-control" id="booking-date" min="${new Date().toISOString().split('T')[0]}">
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Time</label>
                  <select class="form-select" id="booking-time">
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Subject</label>
              <select class="form-select" id="booking-subject">
                ${tutor.subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('')}
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Duration (hours)</label>
              <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" name="duration" id="duration-0.5" value="0.5">
                <label class="btn btn-outline-primary" for="duration-0.5">0.5h</label>
                
                <input type="radio" class="btn-check" name="duration" id="duration-1" value="1" checked>
                <label class="btn btn-outline-primary" for="duration-1">1h</label>
                
                <input type="radio" class="btn-check" name="duration" id="duration-1.5" value="1.5">
                <label class="btn btn-outline-primary" for="duration-1.5">1.5h</label>
                
                <input type="radio" class="btn-check" name="duration" id="duration-2" value="2">
                <label class="btn btn-outline-primary" for="duration-2">2h</label>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Session Type</label>
              <div class="row g-2">
                <div class="col-6">
                  <input type="radio" class="btn-check" name="session-type" id="session-online" value="online" checked>
                  <label class="btn btn-outline-primary w-100" for="session-online">
                    <i class="bi bi-camera-video me-2"></i>Online
                  </label>
                </div>
                <div class="col-6">
                  <input type="radio" class="btn-check" name="session-type" id="session-inperson" value="in-person">
                  <label class="btn btn-outline-primary w-100" for="session-inperson">
                    <i class="bi bi-geo-alt me-2"></i>In-Person
                  </label>
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Special Requests (Optional)</label>
              <textarea class="form-control" id="booking-notes" rows="3" placeholder="Any specific topics or requirements..."></textarea>
            </div>
            
            <div class="bg-light rounded-3 p-3">
              <h6 class="fw-semibold mb-3">Cost Breakdown</h6>
              <div class="d-flex justify-content-between">
                <span>Tutoring (1 hour @ $${tutor.hourlyRate}/hr)</span>
                <span id="tutoring-cost">$${tutor.hourlyRate}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span>Service fee (10%)</span>
                <span id="service-fee">$${(tutor.hourlyRate * 0.1).toFixed(1)}</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between fw-semibold">
                <span>Total</span>
                <span id="total-cost">$${(tutor.hourlyRate * 1.1).toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="confirmBooking(${tutor.id})">Book Session</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupBookingModalEventListeners(tutor) {
  // Update cost when duration changes
  const durationInputs = document.querySelectorAll('input[name="duration"]');
  durationInputs.forEach(input => {
    input.addEventListener('change', function() {
      updateBookingCost(tutor);
    });
  });
}

function updateBookingCost(tutor) {
  const duration = document.querySelector('input[name="duration"]:checked')?.value || 1;
  const tutoringCost = tutor.hourlyRate * duration;
  const serviceFee = tutoringCost * 0.1;
  const totalCost = tutoringCost + serviceFee;
  
  document.getElementById('tutoring-cost').textContent = `$${tutoringCost}`;
  document.getElementById('service-fee').textContent = `$${serviceFee.toFixed(1)}`;
  document.getElementById('total-cost').textContent = `$${totalCost.toFixed(1)}`;
}

function confirmBooking(tutorId) {
  const tutor = AppState.tutors.find(t => t.id === tutorId);
  if (!tutor) return;
  
  const date = document.getElementById('booking-date').value;
  const time = document.getElementById('booking-time').value;
  const subject = document.getElementById('booking-subject').value;
  const duration = document.querySelector('input[name="duration"]:checked')?.value || 1;
  const sessionType = document.querySelector('input[name="session-type"]:checked')?.value || 'online';
  const notes = document.getElementById('booking-notes').value;
  
  if (!date || !time || !subject) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Create booking
  const booking = {
    id: Date.now().toString(),
    studentId: AppState.currentUser?.email || 'guest',
    tutorId: tutorId.toString(),
    subject: subject,
    date: new Date(`${date}T${time}`).toISOString(),
    duration: parseFloat(duration),
    status: 'confirmed',
    totalCost: tutor.hourlyRate * duration * 1.1,
    notes: notes,
    createdAt: new Date().toISOString()
  };
  
  AppState.bookings.push(booking);
  
  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
  modal.hide();
  
  // Remove modal from DOM
  document.getElementById('bookingModal').remove();
  
  // Show success message
  alert('Booking confirmed! You will receive a confirmation email shortly.');
}
