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
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Load user from localStorage
  loadUser();
  
  // Set initial page
  navigateTo('home');
  
  // Initialize tutors data from API
  loadTutorsFromAPI();
  AppState.bookings = mockBookings; // Keep mock bookings for now
  
  // Update UI based on auth state
  updateAuthUI();
}

async function loadTutorsFromAPI() {
  try {
    AppState.tutors = await TutorAppAPI.getTutors();
  } catch (error) {
    console.error('Failed to load tutors from API, using mock data:', error);
    AppState.tutors = mockTutors;
  }
}

// Authentication functions
function loadUser() {
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      AppState.currentUser = JSON.parse(savedUser);
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
    
    // Update user info
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    
    if (userAvatar) {
      userAvatar.textContent = AppState.currentUser.firstName.charAt(0);
    }
    if (userName) {
      userName.textContent = `${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
    }
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
      <main class="container py-5">
        <div class="text-center py-5">
          <h2 class="display-4 fw-bold text-dark mb-4">
            Find the Perfect Tutor
          </h2>
          <p class="lead text-muted mb-5 max-w-3xl mx-auto">
            Connect with qualified tutors in your area for personalized academic assistance. 
            Get help with any subject, anytime, anywhere.
          </p>
          <div class="mt-4">
            <button class="btn btn-primary btn-lg px-4 py-3" onclick="navigateTo('find-tutors')">
              Get Started
            </button>
          </div>
        </div>

        <!-- Features -->
        <div class="py-5">
          <div class="row g-4">
            <div class="col-md-4">
              <div class="text-center">
                <div class="bg-primary bg-opacity-10 rounded-3 p-4">
                  <h3 class="h5 fw-semibold text-dark">Verified Tutors</h3>
                  <p class="text-muted mb-0">
                    All tutors are verified students and professionals with proven academic records.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="text-center">
                <div class="bg-success bg-opacity-10 rounded-3 p-4">
                  <h3 class="h5 fw-semibold text-dark">Instant Booking</h3>
                  <p class="text-muted mb-0">
                    Book tutoring sessions instantly or schedule for later. Flexible timing to fit your schedule.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="text-center">
                <div class="bg-info bg-opacity-10 rounded-3 p-4">
                  <h3 class="h5 fw-semibold text-dark">All Subjects</h3>
                  <p class="text-muted mb-0">
                    From math and science to languages and humanities. Find help for any subject or course.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}

// Find Tutors page
function getFindTutorsPageHTML() {
  return `
    <div class="min-vh-100 bg-light">
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
    AppState.tutors = await TutorAppAPI.getTutors();
  } catch (error) {
    console.error('Failed to load tutors from API, using existing data:', error);
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
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="d-flex align-items-start">
              <div class="tutor-avatar me-3">
                ${tutor.name.charAt(0)}
              </div>
              <div class="flex-grow-1">
                <h5 class="card-title mb-1">${tutor.name}</h5>
                <div class="d-flex align-items-center text-muted small mb-1">
                  <span class="text-truncate">${tutor.major}</span>
                  <span class="mx-2">•</span>
                  <span>${tutor.year}</span>
                </div>
                ${tutor.university ? `<p class="small text-muted mb-0">${tutor.university}</p>` : ''}
              </div>
            </div>
            
            ${tutor.isVerified ? `
              <div class="badge bg-primary bg-opacity-10 text-primary">
                <i class="bi bi-check-circle-fill me-1"></i>
                Verified
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
    <div class="min-vh-100 bg-light d-flex align-items-center py-5">
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
    <div class="min-vh-100 bg-light d-flex align-items-center py-5">
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
function getBecomeTutorPageHTML() { return '<div class="container py-5"><h1>Become a Tutor Page</h1></div>'; }
function getHowItWorksPageHTML() { return '<div class="container py-5"><h1>How It Works Page</h1></div>'; }
function getSupportPageHTML() { return '<div class="container py-5"><h1>Support Page</h1></div>'; }
function getDashboardPageHTML() { return '<div class="container py-5"><h1>Dashboard Page</h1></div>'; }
function getProfilePageHTML() { return '<div class="container py-5"><h1>Profile Page</h1></div>'; }
function getBookingsPageHTML() { return '<div class="container py-5"><h1>Bookings Page</h1></div>'; }
function getMessagesPageHTML() { return '<div class="container py-5"><h1>Messages Page</h1></div>'; }
function getSettingsPageHTML() { return '<div class="container py-5"><h1>Settings Page</h1></div>'; }

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
