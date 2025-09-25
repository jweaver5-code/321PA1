// Authentication module
// Handles user login, logout, signup, and authentication state management

function loadUser() {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    AppState.currentUser = JSON.parse(userData);
    updateAuthUI();
  }
}

function login(userData) {
  AppState.currentUser = userData;
  localStorage.setItem('currentUser', JSON.stringify(userData));
  updateAuthUI();
}

function logout() {
  AppState.currentUser = null;
  localStorage.removeItem('currentUser');
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
    const userType = document.getElementById('user-type');
    
    if (userAvatar) {
      userAvatar.textContent = AppState.currentUser.firstName.charAt(0);
    }
    if (userName) {
      userName.textContent = `${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
    }
    if (userType) {
      userType.textContent = AppState.currentUser.userType === 'tutor' ? 'Tutor' : 'Student';
    }
    
    // Update mobile menu user info if elements exist
    const mobileUserAvatar = document.getElementById('mobile-user-avatar');
    const mobileUserName = document.getElementById('mobile-user-name');
    const mobileUserType = document.getElementById('mobile-user-type');
    
    if (mobileUserAvatar) {
      mobileUserAvatar.textContent = AppState.currentUser.firstName.charAt(0);
    }
    if (mobileUserName) {
      mobileUserName.textContent = `${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
    }
    if (mobileUserType) {
      mobileUserType.textContent = AppState.currentUser.userType === 'tutor' ? 'Tutor' : 'Student';
    }
  } else {
    // Show guest menu
    userMenu.classList.add('d-none');
    guestMenu.classList.remove('d-none');
    mobileUserMenu.classList.add('d-none');
    mobileGuestMenu.classList.remove('d-none');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const userData = await TutorAppAPI.login(email, password);
    login(userData);
    navigateTo('dashboard');
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: ' + error.message);
  }
}

async function handleSignup(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const userData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
    university: formData.get('university'),
    userType: formData.get('userType')
  };
  
  try {
    const newUser = await TutorAppAPI.signup(userData);
    login(newUser);
    navigateTo('dashboard');
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed: ' + error.message);
  }
}

// Export functions for use in other modules
window.AuthModule = {
  loadUser,
  login,
  logout,
  updateAuthUI,
  handleLogin,
  handleSignup
};
// Booking module
// Handles booking functionality, conflict detection, and booking modals

function openBookingModal(tutorId, tutorName, hourlyRate) {
  if (!AppState.currentUser) {
    alert('Please log in to book a session.');
    return;
  }

  const modal = document.getElementById('bookingModal');
  if (modal) {
    // Set tutor info
    document.getElementById('bookingTutorName').textContent = tutorName;
    document.getElementById('bookingTutorRate').textContent = `$${hourlyRate}/hr`;
    
    // Store tutor info for booking
    modal.dataset.tutorId = tutorId;
    modal.dataset.hourlyRate = hourlyRate;
    
    // Reset form
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingError').classList.add('d-none');
    document.getElementById('bookingSuccess').classList.add('d-none');
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }
}

async function checkBookingAvailability() {
  const tutorId = document.getElementById('bookingModal').dataset.tutorId;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  
  if (!startTime || !endTime) return;
  
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const availability = await TutorAppAPI.checkTutorAvailability(tutorId, start, end);
    
    const errorDiv = document.getElementById('bookingError');
    const successDiv = document.getElementById('bookingSuccess');
    
    if (availability.isAvailable) {
      errorDiv.classList.add('d-none');
      successDiv.classList.remove('d-none');
      successDiv.innerHTML = '<i class="bi bi-check-circle me-2"></i>Time slot is available!';
    } else {
      successDiv.classList.add('d-none');
      errorDiv.classList.remove('d-none');
      const conflicts = availability.conflictingBookings.map(b => 
        `${new Date(b.startTime).toLocaleString()} - ${new Date(b.endTime).toLocaleString()} (${b.subject})`
      ).join('<br>');
      errorDiv.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>Tutor is not available during this time.<br><strong>Conflicting sessions:</strong><br>${conflicts}`;
    }
  } catch (error) {
    console.error('Error checking availability:', error);
  }
}

async function submitBooking(event) {
  event.preventDefault();
  
  const tutorId = parseInt(document.getElementById('bookingModal').dataset.tutorId);
  const hourlyRate = parseFloat(document.getElementById('bookingModal').dataset.hourlyRate);
  const startTime = new Date(document.getElementById('startTime').value);
  const endTime = new Date(document.getElementById('endTime').value);
  const subject = document.getElementById('subject').value;
  const notes = document.getElementById('notes').value;
  
  const duration = (endTime - startTime) / (1000 * 60 * 60); // hours
  const totalCost = duration * hourlyRate;
  
  const bookingData = {
    studentId: AppState.currentUser.id,
    tutorId: tutorId,
    subject: subject,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    status: 'pending',
    totalCost: totalCost,
    notes: notes
  };
  
  try {
    const booking = await TutorAppAPI.createBooking(bookingData);
    
    // Show success message
    document.getElementById('bookingSuccess').classList.remove('d-none');
    document.getElementById('bookingSuccess').innerHTML = '<i class="bi bi-check-circle me-2"></i>Booking request submitted successfully!';
    document.getElementById('bookingError').classList.add('d-none');
    
    // Reset form
    document.getElementById('bookingForm').reset();
    
    // Close modal after 2 seconds
    setTimeout(() => {
      const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
      modal.hide();
    }, 2000);
    
  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Show error message
    document.getElementById('bookingError').classList.remove('d-none');
    document.getElementById('bookingError').innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>Error: ${error.message}`;
    document.getElementById('bookingSuccess').classList.add('d-none');
  }
}

// Legacy booking functions (keeping for compatibility)
function openBookingModal(tutorId) {
  // This is the old function signature - redirect to new one
  const tutor = AppState.tutors.find(t => t.id === tutorId);
  if (tutor) {
    openBookingModal(tutorId, tutor.name, parseFloat(tutor.hourlyRate));
  }
}

function getBookingModalHTML(tutor) {
  return `
    <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bookingModalLabel">Book a Session with ${tutor.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <h6 class="fw-semibold">Tutor</h6>
                <p class="mb-0">${tutor.name}</p>
              </div>
              <div class="col-md-6">
                <h6 class="fw-semibold">Rate</h6>
                <p class="mb-0 text-primary fw-bold">$${tutor.hourlyRate}/hr</p>
              </div>
            </div>
            
            <form id="bookingForm" onsubmit="submitBooking(event)">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="startTime" class="form-label">Start Time</label>
                  <input type="datetime-local" class="form-control" id="startTime" required onchange="checkBookingAvailability()">
                </div>
                <div class="col-md-6">
                  <label for="endTime" class="form-label">End Time</label>
                  <input type="datetime-local" class="form-control" id="endTime" required onchange="checkBookingAvailability()">
                </div>
                <div class="col-12">
                  <label for="subject" class="form-label">Subject</label>
                  <input type="text" class="form-control" id="subject" placeholder="e.g., Mathematics, Physics" required>
                </div>
                <div class="col-12">
                  <label for="notes" class="form-label">Additional Notes (Optional)</label>
                  <textarea class="form-control" id="notes" rows="3" placeholder="Any specific topics you'd like to focus on..."></textarea>
                </div>
              </div>
              
              <div class="alert alert-danger d-none mt-3" id="bookingError"></div>
              <div class="alert alert-success d-none mt-3" id="bookingSuccess"></div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Book Session</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupBookingModalEventListeners(tutor) {
  // Event listeners for the booking modal
  const startTimeInput = document.getElementById('startTime');
  const endTimeInput = document.getElementById('endTime');
  
  if (startTimeInput) {
    startTimeInput.addEventListener('change', checkBookingAvailability);
  }
  if (endTimeInput) {
    endTimeInput.addEventListener('change', checkBookingAvailability);
  }
}

function updateBookingCost(tutor) {
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  
  if (startTime && endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / (1000 * 60 * 60); // hours
    const totalCost = duration * parseFloat(tutor.hourlyRate);
    
    const costDisplay = document.getElementById('bookingCost');
    if (costDisplay) {
      costDisplay.textContent = `$${totalCost.toFixed(2)}`;
    }
  }
}

function confirmBooking(tutorId) {
  // This function is called when the booking is confirmed
  const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
  modal.hide();
  
  // Remove modal from DOM
  document.getElementById('bookingModal').remove();
  
  // Show success message
  alert('Booking confirmed! You will receive a confirmation email shortly.');
}

// Export functions for use in other modules
window.BookingModule = {
  openBookingModal,
  checkBookingAvailability,
  submitBooking,
  getBookingModalHTML,
  setupBookingModalEventListeners,
  updateBookingCost,
  confirmBooking
};
// Pages module
// Handles generation of HTML for different pages

function getHomePageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <!-- Hero Section -->
      <div class="container py-5">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-dark mb-4">
              Connect with Expert Tutors
              <span class="text-primary">Instantly</span>
            </h1>
            <p class="lead text-muted mb-4">
              Find qualified tutors for any subject. Get personalized help from verified experts 
              at your university and beyond.
            </p>
            <div class="d-flex flex-column flex-sm-row gap-3">
              <button class="btn btn-primary btn-lg px-4" onclick="navigateTo('find-tutors')">
                <i class="bi bi-search me-2"></i>Find Tutors
              </button>
              <button class="btn btn-outline-primary btn-lg px-4" onclick="navigateTo('become-tutor')">
                <i class="bi bi-person-plus me-2"></i>Become a Tutor
              </button>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="text-center">
              <div class="bg-white rounded-4 shadow-lg p-5 mb-4">
                <h3 class="h4 fw-bold text-primary mb-3">Join Our Community</h3>
                <p class="text-muted mb-4">Connect with thousands of students and tutors across universities</p>
                <div class="row g-3">
                  <div class="col-4">
                    <div class="text-center">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 50px; height: 50px;">
                        <i class="bi bi-people-fill text-primary fs-5"></i>
                      </div>
                      <div class="fw-bold text-dark">500+</div>
                      <div class="small text-muted">Tutors</div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center">
                      <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 50px; height: 50px;">
                        <i class="bi bi-graduation-cap text-success fs-5"></i>
                      </div>
                      <div class="fw-bold text-dark">50+</div>
                      <div class="small text-muted">Universities</div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="text-center">
                      <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 50px; height: 50px;">
                        <i class="bi bi-star-fill text-warning fs-5"></i>
                      </div>
                      <div class="fw-bold text-dark">4.9</div>
                      <div class="small text-muted">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="container py-5">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                  <i class="bi bi-search display-6 text-primary"></i>
                </div>
                <h5 class="fw-bold text-dark mb-3">Find Perfect Match</h5>
                <p class="text-muted">Search by subject, university, or rating to find the ideal tutor for your needs.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                  <i class="bi bi-calendar-check display-6 text-success"></i>
                </div>
                <h5 class="fw-bold text-dark mb-3">Flexible Scheduling</h5>
                <p class="text-muted">Book sessions that fit your schedule with our easy-to-use booking system.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                  <i class="bi bi-shield-check display-6 text-warning"></i>
                </div>
                <h5 class="fw-bold text-dark mb-3">Verified Tutors</h5>
                <p class="text-muted">All tutors are verified and rated by students to ensure quality education.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getFindTutorsPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">Find Your Perfect Tutor</h1>
            <p class="text-muted mb-0">Browse our verified tutors and find the right match for your learning needs</p>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-md-4">
                <label for="searchInput" class="form-label fw-semibold">Search Tutors</label>
                <input type="text" class="form-control" id="searchInput" placeholder="Search by name, subject, or university...">
              </div>
              <div class="col-md-3">
                <label for="subjectFilter" class="form-label fw-semibold">Subject</label>
                <select class="form-select" id="subjectFilter">
                  <option value="">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Statistics">Statistics</option>
                </select>
              </div>
              <div class="col-md-3">
                <label for="universityFilter" class="form-label fw-semibold">University</label>
                <select class="form-select" id="universityFilter">
                  <option value="">All Universities</option>
                  <option value="Stanford University">Stanford University</option>
                  <option value="MIT">MIT</option>
                  <option value="UC Berkeley">UC Berkeley</option>
                  <option value="Harvard University">Harvard University</option>
                </select>
              </div>
              <div class="col-md-2">
                <label for="ratingFilter" class="form-label fw-semibold">Min Rating</label>
                <select class="form-select" id="ratingFilter">
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
                <button class="btn btn-outline-secondary me-2" onclick="clearFilters()">
                  <i class="bi bi-x-circle me-1"></i>Clear Filters
                </button>
                <span class="text-muted small" id="resultsCount">Loading tutors...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tutors Grid -->
        <div class="row g-4" id="tutorsGrid">
          <!-- Tutors will be loaded here -->
        </div>
      </div>
    </div>
  `;
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

          <!-- Rating -->
          <div class="d-flex align-items-center mb-3">
            <div class="star-rating">
              ${stars}
              <span class="ms-2 fw-medium">${tutor.rating}</span>
              <span class="text-muted">(${tutor.reviews})</span>
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
            <div class="fw-bold text-primary fs-5">$${tutor.hourlyRate}/hr</div>
            <button class="btn btn-primary" onclick="openBookingModal(${tutor.id}, '${tutor.name}', ${tutor.hourlyRate})">
              Book Session
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getLoginPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <div class="card border-0 shadow-lg">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <h2 class="h3 fw-bold text-dark">Welcome Back</h2>
                  <p class="text-muted">Sign in to your account to continue</p>
                </div>
                
                <form id="loginForm" onsubmit="handleLogin(event)">
                  <div class="mb-3">
                    <label for="loginEmail" class="form-label fw-semibold">Email Address</label>
                    <input type="email" class="form-control" id="loginEmail" required>
                  </div>
                  
                  <div class="mb-4">
                    <label for="loginPassword" class="form-label fw-semibold">Password</label>
                    <input type="password" class="form-control" id="loginPassword" required>
                  </div>
                  
                  <button type="submit" class="btn btn-primary w-100 py-2 mb-3">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                  </button>
                </form>
                
                <div class="text-center">
                  <p class="text-muted mb-0">Don't have an account? 
                    <a href="#" onclick="navigateTo('signup')" class="text-primary fw-semibold text-decoration-none">Sign up here</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getSignupPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="card border-0 shadow-lg">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <h2 class="h3 fw-bold text-dark">Create Your Account</h2>
                  <p class="text-muted">Join our community of students and tutors</p>
                </div>
                
                <form id="signupForm" onsubmit="handleSignup(event)">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label for="firstName" class="form-label fw-semibold">First Name</label>
                      <input type="text" class="form-control" id="firstName" name="firstName" required>
                    </div>
                    <div class="col-md-6">
                      <label for="lastName" class="form-label fw-semibold">Last Name</label>
                      <input type="text" class="form-control" id="lastName" name="lastName" required>
                    </div>
                    <div class="col-12">
                      <label for="email" class="form-label fw-semibold">Email Address</label>
                      <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    <div class="col-12">
                      <label for="password" class="form-label fw-semibold">Password</label>
                      <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    <div class="col-12">
                      <label for="university" class="form-label fw-semibold">University</label>
                      <input type="text" class="form-control" id="university" name="university" placeholder="e.g., Stanford University">
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-semibold">I want to:</label>
                      <div class="row g-2">
                        <div class="col-6">
                          <div class="form-check">
                            <input class="form-check-input" type="radio" name="userType" id="studentType" value="student" checked>
                            <label class="form-check-label" for="studentType">
                              Find Tutors
                            </label>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-check">
                            <input class="form-check-input" type="radio" name="userType" id="tutorType" value="tutor">
                            <label class="form-check-label" for="tutorType">
                              Become a Tutor
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button type="submit" class="btn btn-primary w-100 py-2 mt-4">
                    <i class="bi bi-person-plus me-2"></i>Create Account
                  </button>
                </form>
                
                <div class="text-center mt-3">
                  <p class="text-muted mb-0">Already have an account? 
                    <a href="#" onclick="navigateTo('login')" class="text-primary fw-semibold text-decoration-none">Sign in here</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getBecomeTutorPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-dark mb-4">
              Start Earning Today
            </h1>
            <p class="lead text-muted mb-4">
              Share your knowledge and help fellow students while earning money. 
              Join our community of verified tutors.
            </p>
            <div class="bg-primary bg-opacity-90 rounded-4 p-4 shadow-lg mb-4">
              <h3 class="h4 fw-bold text-white mb-3">
                <i class="bi bi-currency-dollar me-2"></i>Earn $25-75/hour
              </h3>
              <p class="text-white-50 mb-0">Set your own rates and schedule. Work when you want, where you want.</p>
            </div>
            <button class="btn btn-primary btn-lg px-4" onclick="navigateTo('signup')">
              <i class="bi bi-person-plus me-2"></i>Apply Now
            </button>
          </div>
          <div class="col-lg-6">
            <div class="row g-4">
              <div class="col-12">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                        <i class="bi bi-check-circle-fill text-primary fs-5"></i>
                      </div>
                      <h5 class="fw-bold text-dark mb-0">Easy Application</h5>
                    </div>
                    <p class="text-muted mb-0">Quick verification process. Get approved in 24 hours.</p>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                        <i class="bi bi-calendar-check text-success fs-5"></i>
                      </div>
                      <h5 class="fw-bold text-dark mb-0">Flexible Schedule</h5>
                    </div>
                    <p class="text-muted mb-0">Set your own hours and availability. Work around your studies.</p>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 50px; height: 50px;">
                        <i class="bi bi-people text-warning fs-5"></i>
                      </div>
                      <h5 class="fw-bold text-dark mb-0">Help Students</h5>
                    </div>
                    <p class="text-muted mb-0">Make a difference in students' academic journey while earning money.</p>
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

function getHowItWorksPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-5">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="h2 fw-bold text-dark mb-3">How It Works</h1>
            <p class="text-muted">Simple steps to connect with the perfect tutor or start tutoring</p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                  <span class="fw-bold text-primary fs-4">1</span>
                </div>
                <h5 class="fw-bold text-dark mb-3">Sign Up</h5>
                <p class="text-muted">Create your account as a student or tutor. Quick and easy registration process.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                  <span class="fw-bold text-success fs-4">2</span>
                </div>
                <h5 class="fw-bold text-dark mb-3">Find & Connect</h5>
                <p class="text-muted">Search for tutors by subject, university, or rating. Book sessions that fit your schedule.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                  <span class="fw-bold text-warning fs-4">3</span>
                </div>
                <h5 class="fw-bold text-dark mb-3">Learn & Earn</h5>
                <p class="text-muted">Students get personalized help. Tutors earn money while helping others succeed.</p>
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
      <div class="container py-5">
        <div class="row mb-5">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="h2 fw-bold text-dark mb-3">Support Center</h1>
            <p class="text-muted">We're here to help you succeed. Find answers to common questions or contact us directly.</p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body p-4">
                <h5 class="fw-bold text-dark mb-3">
                  <i class="bi bi-question-circle text-primary me-2"></i>Frequently Asked Questions
                </h5>
                <div class="accordion" id="faqAccordion">
                  <div class="accordion-item border-0">
                    <h2 class="accordion-header">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                        How do I book a tutoring session?
                      </button>
                    </h2>
                    <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div class="accordion-body">
                        Simply search for tutors, select one that matches your needs, and click "Book Session". 
                        Choose your preferred time slot and subject.
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item border-0">
                    <h2 class="accordion-header">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                        How much do tutoring sessions cost?
                      </button>
                    </h2>
                    <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div class="accordion-body">
                        Session costs vary by tutor and subject. Rates typically range from $25-75 per hour. 
                        Each tutor sets their own rates based on their expertise and experience.
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item border-0">
                    <h2 class="accordion-header">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                        How do I become a tutor?
                      </button>
                    </h2>
                    <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div class="accordion-body">
                        Click "Become a Tutor" and fill out the application form. We'll review your application 
                        and get back to you within 24 hours.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body p-4">
                <h5 class="fw-bold text-dark mb-3">
                  <i class="bi bi-headset text-primary me-2"></i>Contact Support
                </h5>
                <div class="d-grid gap-3">
                  <button class="btn btn-outline-primary" onclick="openLiveChat()">
                    <i class="bi bi-chat-dots me-2"></i>Live Chat
                  </button>
                  <button class="btn btn-outline-primary" onclick="openEmailForm()">
                    <i class="bi bi-envelope me-2"></i>Email Support
                  </button>
                  <button class="btn btn-outline-primary" onclick="showPhoneNumber()">
                    <i class="bi bi-telephone me-2"></i>Call Us
                  </button>
                </div>
                <div class="mt-4 p-3 bg-light rounded">
                  <h6 class="fw-semibold text-dark mb-2">Response Times</h6>
                  <ul class="list-unstyled mb-0 small text-muted">
                    <li>Live Chat: Instant</li>
                    <li>Email: Within 2 hours</li>
                    <li>Phone: 9 AM - 6 PM PST</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Export functions for use in other modules
window.PagesModule = {
  getHomePageHTML,
  getFindTutorsPageHTML,
  getTutorCardHTML,
  getLoginPageHTML,
  getSignupPageHTML,
  getBecomeTutorPageHTML,
  getHowItWorksPageHTML,
  getSupportPageHTML
};
// Dashboard module
// Handles dashboard, profile, bookings, messages, and settings pages

function getDashboardPageHTML() {
  const user = AppState.currentUser;
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userType = user ? user.userType : 'student';
  const isTutor = userType === 'tutor';

  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">Welcome back, ${userName}!</h1>
            <p class="text-muted mb-0">Here's what's happening with your ${userType} account</p>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-8">
            <div class="row g-4 mb-5">
              <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center p-4">
                    <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-calendar-check display-6 text-primary"></i>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-1">${isTutor ? '5' : '3'}</h3>
                    <p class="text-muted mb-0">${isTutor ? 'Sessions Today' : 'Upcoming Sessions'}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center p-4">
                    <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-${isTutor ? 'currency-dollar' : 'book'} display-6 text-success"></i>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-1">${isTutor ? '$450' : '4.8'}</h3>
                    <p class="text-muted mb-0">${isTutor ? 'Earned This Week' : 'Average Rating'}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center p-4">
                    <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                      <i class="bi bi-${isTutor ? 'people' : 'star'} display-6 text-warning"></i>
                    </div>
                    <h3 class="h4 fw-bold text-dark mb-1">${isTutor ? '12' : '15'}</h3>
                    <p class="text-muted mb-0">${isTutor ? 'Students Helped' : 'Sessions Completed'}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Recent Activity</h3>
              </div>
              <div class="card-body p-4">
                ${isTutor ? `
                  <div class="d-flex align-items-center mb-3">
                    <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                      <i class="bi bi-check-circle text-success"></i>
                    </div>
                    <div>
                      <p class="mb-0 fw-semibold">Session completed with Sarah</p>
                      <small class="text-muted">Mathematics - 2 hours ago</small>
                    </div>
                  </div>
                  <div class="d-flex align-items-center mb-3">
                    <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                      <i class="bi bi-calendar-plus text-primary"></i>
                    </div>
                    <div>
                      <p class="mb-0 fw-semibold">New booking request</p>
                      <small class="text-muted">Physics - 4 hours ago</small>
                    </div>
                  </div>
                ` : `
                  <div class="d-flex align-items-center mb-3">
                    <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                      <i class="bi bi-check-circle text-success"></i>
                    </div>
                    <div>
                      <p class="mb-0 fw-semibold">Session completed with Dr. Smith</p>
                      <small class="text-muted">Calculus - 1 hour ago</small>
                    </div>
                  </div>
                  <div class="d-flex align-items-center mb-3">
                    <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                      <i class="bi bi-calendar-check text-primary"></i>
                    </div>
                    <div>
                      <p class="mb-0 fw-semibold">Session booked with Prof. Johnson</p>
                      <small class="text-muted">Physics - Tomorrow at 2 PM</small>
                    </div>
                  </div>
                `}
              </div>
            </div>

            <!-- Recommended Section -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">${isTutor ? 'Teaching Opportunities' : 'Recommended Tutors'}</h3>
              </div>
              <div class="card-body p-4">
                ${isTutor ? `
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 class="fw-semibold mb-1">High Demand: Computer Science</h6>
                      <p class="text-muted mb-0 small">5 students looking for CS tutors</p>
                    </div>
                    <button class="btn btn-outline-primary btn-sm">View Requests</button>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="fw-semibold mb-1">New Subject: Data Structures</h6>
                      <p class="text-muted mb-0 small">Add this to your subjects to get more bookings</p>
                    </div>
                    <button class="btn btn-outline-success btn-sm">Add Subject</button>
                  </div>
                ` : `
                  <div class="row g-3">
                    <div class="col-md-6">
                      <div class="d-flex align-items-center p-3 border rounded">
                        <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                          <span class="fw-bold text-primary">SJ</span>
                        </div>
                        <div class="flex-grow-1">
                          <h6 class="fw-semibold mb-0">Sarah Johnson</h6>
                          <small class="text-muted">Computer Science • 4.9★</small>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="d-flex align-items-center p-3 border rounded">
                        <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                          <span class="fw-bold text-success">MC</span>
                        </div>
                        <div class="flex-grow-1">
                          <h6 class="fw-semibold mb-0">Michael Chen</h6>
                          <small class="text-muted">Mathematics • 4.8★</small>
                        </div>
                      </div>
                    </div>
                  </div>
                `}
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Quick Actions</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-grid gap-2">
                  ${isTutor ? `
                    <button class="btn btn-outline-primary" onclick="navigateTo('find-tutors')">
                      <i class="bi bi-calendar-plus me-2"></i>Set Availability
                    </button>
                    <button class="btn btn-outline-success" onclick="navigateTo('profile')">
                      <i class="bi bi-person-gear me-2"></i>Update Profile
                    </button>
                    <button class="btn btn-outline-warning" onclick="navigateTo('bookings')">
                      <i class="bi bi-clock-history me-2"></i>View Bookings
                    </button>
                  ` : `
                    <button class="btn btn-outline-primary" onclick="navigateTo('find-tutors')">
                      <i class="bi bi-search me-2"></i>Find Tutors
                    </button>
                    <button class="btn btn-outline-success" onclick="navigateTo('bookings')">
                      <i class="bi bi-calendar-check me-2"></i>My Bookings
                    </button>
                    <button class="btn btn-outline-warning" onclick="navigateTo('messages')">
                      <i class="bi bi-chat-dots me-2"></i>Messages
                    </button>
                  `}
                </div>
              </div>
            </div>

            <!-- Upcoming Sessions -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Upcoming Sessions</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-calendar text-primary"></i>
                  </div>
                  <div>
                    <h6 class="fw-semibold mb-0">${isTutor ? 'With Sarah M.' : 'Dr. Smith'}</h6>
                    <small class="text-muted">${isTutor ? 'Mathematics' : 'Calculus'} - Tomorrow 2:00 PM</small>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-calendar text-success"></i>
                  </div>
                  <div>
                    <h6 class="fw-semibold mb-0">${isTutor ? 'With Alex K.' : 'Prof. Johnson'}</h6>
                    <small class="text-muted">${isTutor ? 'Physics' : 'Physics'} - Friday 10:00 AM</small>
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
  const userEmail = user ? user.email : 'user@example.com';
  const userUniversity = user ? user.university : 'University';
  const userType = user ? user.userType : 'student';
  const isTutor = userType === 'tutor';

  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8">
            <!-- Personal Information -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Personal Information</h3>
              </div>
              <div class="card-body p-4">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">First Name</label>
                    <input type="text" class="form-control" value="${user ? user.firstName : ''}" readonly>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Last Name</label>
                    <input type="text" class="form-control" value="${user ? user.lastName : ''}" readonly>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-semibold">Email Address</label>
                    <input type="email" class="form-control" value="${userEmail}" readonly>
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-semibold">University</label>
                    <input type="text" class="form-control" value="${userUniversity}" readonly>
                  </div>
                </div>
              </div>
            </div>

            <!-- Teaching Information / Study Preferences -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">${isTutor ? 'Teaching Information' : 'Study Preferences'}</h3>
              </div>
              <div class="card-body p-4">
                ${isTutor ? `
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">Subjects I Teach</label>
                      <div class="d-flex flex-wrap gap-2">
                        <span class="badge bg-primary">Mathematics</span>
                        <span class="badge bg-primary">Computer Science</span>
                        <span class="badge bg-primary">Physics</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">Hourly Rate</label>
                      <input type="text" class="form-control" value="$45/hour" readonly>
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-semibold">Teaching Philosophy</label>
                      <textarea class="form-control" rows="3" readonly>I believe in making complex concepts simple and accessible. My approach focuses on building strong foundations and encouraging critical thinking.</textarea>
                    </div>
                  </div>
                ` : `
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">Subjects of Interest</label>
                      <div class="d-flex flex-wrap gap-2">
                        <span class="badge bg-primary">Mathematics</span>
                        <span class="badge bg-primary">Computer Science</span>
                        <span class="badge bg-primary">Physics</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-semibold">Preferred Learning Style</label>
                      <select class="form-select" disabled>
                        <option>Visual Learning</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-semibold">Academic Goals</label>
                      <textarea class="form-control" rows="3" readonly>Improve grades in calculus and prepare for computer science courses. Focus on understanding algorithms and data structures.</textarea>
                    </div>
                  </div>
                `}
              </div>
            </div>

            <!-- Student Feedback / Tutoring History -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">${isTutor ? 'Student Feedback' : 'Tutoring History'}</h3>
              </div>
              <div class="card-body p-4">
                ${isTutor ? `
                  <div class="d-flex align-items-center mb-3">
                    <div class="me-3">
                      <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                        <i class="bi bi-star-fill text-warning"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="fw-semibold mb-1">Excellent teaching style!</h6>
                      <p class="text-muted mb-1 small">"Sarah explained calculus concepts in a way that finally made sense to me. Highly recommend!"</p>
                      <div class="d-flex align-items-center">
                        <div class="star-rating me-2">
                          <i class="bi bi-star-fill star"></i>
                          <i class="bi bi-star-fill star"></i>
                          <i class="bi bi-star-fill star"></i>
                          <i class="bi bi-star-fill star"></i>
                          <i class="bi bi-star-fill star"></i>
                        </div>
                        <small class="text-muted">- Alex K.</small>
                      </div>
                    </div>
                  </div>
                ` : `
                  <div class="d-flex align-items-center mb-3">
                    <div class="me-3">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                        <span class="fw-bold text-primary">SJ</span>
                      </div>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="fw-semibold mb-1">Calculus Session</h6>
                      <p class="text-muted mb-1 small">2 hours • $90 • Completed</p>
                      <div class="d-flex align-items-center">
                        <div class="star-rating me-2">
                          <i class="bi bi-star-fill star"></i>
                          <i class="bi bi-star-fill star"></i>
                          <i class="bi bi-star-fill star"></i>
                          <i class="bi bi-star-fill star"></i>
                          <i class="bi bi-star-fill star"></i>
                        </div>
                        <small class="text-muted">Rated 5 stars</small>
                      </div>
                    </div>
                  </div>
                `}
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">${isTutor ? 'Teaching Stats' : 'Learning Progress'}</h3>
              </div>
              <div class="card-body p-4">
                <div class="row g-3 text-center">
                  <div class="col-6">
                    <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 50px; height: 50px;">
                      <i class="bi bi-${isTutor ? 'people' : 'book'} text-primary"></i>
                    </div>
                    <h6 class="fw-bold text-dark mb-0">${isTutor ? '24' : '12'}</h6>
                    <small class="text-muted">${isTutor ? 'Students' : 'Sessions'}</small>
                  </div>
                  <div class="col-6">
                    <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style="width: 50px; height: 50px;">
                      <i class="bi bi-star text-success"></i>
                    </div>
                    <h6 class="fw-bold text-dark mb-0">4.${isTutor ? '9' : '8'}</h6>
                    <small class="text-muted">Rating</small>
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
                  <button class="btn btn-outline-primary" onclick="navigateTo('settings')">
                    <i class="bi bi-gear me-2"></i>Edit Profile
                  </button>
                  <button class="btn btn-outline-success" onclick="navigateTo('${isTutor ? 'bookings' : 'find-tutors'}')">
                    <i class="bi bi-${isTutor ? 'calendar-check' : 'search'} me-2"></i>${isTutor ? 'Manage Bookings' : 'Find Tutors'}
                  </button>
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
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">My Bookings</h1>
            <p class="text-muted mb-0">Manage your tutoring sessions and bookings</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-5 text-center">
                <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style="width: 80px; height: 80px;">
                  <i class="bi bi-calendar-check display-4 text-primary"></i>
                </div>
                <h3 class="h4 fw-bold text-dark mb-3">Coming Soon</h3>
                <p class="text-muted mb-4">We're working on bringing you a comprehensive booking management system.</p>
                <button class="btn btn-primary" onclick="navigateTo('find-tutors')">
                  <i class="bi bi-search me-2"></i>Find Tutors to Book
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getMessagesPageHTML() {
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">Messages</h1>
            <p class="text-muted mb-0">Communicate with your tutors and students</p>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Conversations</h3>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div class="list-group-item border-0">
                    <div class="d-flex align-items-center">
                      <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <span class="fw-bold text-primary">SJ</span>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="fw-semibold mb-0">Sarah Johnson</h6>
                        <small class="text-muted">Hey, are you available for calculus help?</small>
                      </div>
                      <small class="text-muted">2m</small>
                    </div>
                  </div>
                  <div class="list-group-item border-0">
                    <div class="d-flex align-items-center">
                      <div class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                        <span class="fw-bold text-success">MC</span>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="fw-semibold mb-0">Michael Chen</h6>
                        <small class="text-muted">Great session today! See you next week.</small>
                      </div>
                      <small class="text-muted">1h</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-0 py-4">
                <div class="d-flex align-items-center">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <span class="fw-bold text-primary">SJ</span>
                  </div>
                  <div>
                    <h6 class="fw-semibold mb-0">Sarah Johnson</h6>
                    <small class="text-muted">Online</small>
                  </div>
                </div>
              </div>
              <div class="card-body p-4">
                <div class="text-center py-5">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style="width: 80px; height: 80px;">
                    <i class="bi bi-chat-dots display-4 text-primary"></i>
                  </div>
                  <h3 class="h4 fw-bold text-dark mb-3">Coming Soon</h3>
                  <p class="text-muted mb-4">We're building an amazing messaging system for you to communicate with tutors and students.</p>
                  <button class="btn btn-primary">
                    <i class="bi bi-envelope me-2"></i>Send Email Instead
                  </button>
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
  return `
    <div class="min-vh-100 bg-gradient-app">
      <div class="container py-5">
        <div class="row mb-4">
          <div class="col-lg-8">
            <h1 class="h2 fw-bold text-dark mb-2">Settings</h1>
            <p class="text-muted mb-0">Manage your account preferences and settings</p>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Account Information</h3>
              </div>
              <div class="card-body p-4">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Email Address</label>
                    <input type="email" class="form-control" value="user@example.com" readonly>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Phone Number</label>
                    <input type="tel" class="form-control" placeholder="+1 (555) 123-4567">
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-semibold">Bio</label>
                    <textarea class="form-control" rows="3" placeholder="Tell us about yourself..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Notification Preferences</h3>
              </div>
              <div class="card-body p-4">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="emailNotifications" checked>
                  <label class="form-check-label" for="emailNotifications">
                    Email Notifications
                  </label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="smsNotifications">
                  <label class="form-check-label" for="smsNotifications">
                    SMS Notifications
                  </label>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="pushNotifications" checked>
                  <label class="form-check-label" for="pushNotifications">
                    Push Notifications
                  </label>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Privacy Settings</h3>
              </div>
              <div class="card-body p-4">
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="profileVisibility" checked>
                  <label class="form-check-label" for="profileVisibility">
                    Make Profile Public
                  </label>
                </div>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="showOnlineStatus" checked>
                  <label class="form-check-label" for="showOnlineStatus">
                    Show Online Status
                  </label>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="allowMessages">
                  <label class="form-check-label" for="allowMessages">
                    Allow Direct Messages
                  </label>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 py-4">
                <h3 class="h5 fw-bold text-dark mb-0">Help & Support</h3>
              </div>
              <div class="card-body p-4">
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-primary" onclick="navigateTo('support')">
                    <i class="bi bi-question-circle me-2"></i>FAQ & Help Center
                  </button>
                  <button class="btn btn-outline-success">
                    <i class="bi bi-envelope me-2"></i>Contact Support
                  </button>
                  <button class="btn btn-outline-warning">
                    <i class="bi bi-download me-2"></i>Download Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Export functions for use in other modules
window.DashboardModule = {
  getDashboardPageHTML,
  getProfilePageHTML,
  getBookingsPageHTML,
  getMessagesPageHTML,
  getSettingsPageHTML
};
// Utilities module
// Handles utility functions, data loading, and common operations

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

function loadTutorsFromLocalStorage() {
  const tutorsData = localStorage.getItem('tutors');
  if (tutorsData) {
    AppState.tutors = JSON.parse(tutorsData);
    console.log('Loaded tutors from localStorage:', AppState.tutors.length);
  }
}

async function loadTutorsFromAPI() {
  try {
    const tutors = await TutorAppAPI.getTutors();
    console.log('Fetched tutors from API:', tutors.length);
    
    // Merge with existing tutors (don't overwrite)
    const existingTutorIds = new Set(AppState.tutors.map(t => t.id));
    const newTutors = tutors.filter(t => !existingTutorIds.has(t.id));
    
    AppState.tutors = [...AppState.tutors, ...newTutors];
    
    // Save to localStorage
    localStorage.setItem('tutors', JSON.stringify(AppState.tutors));
    
    return tutors;
  } catch (error) {
    console.error('Error loading tutors from API:', error);
    console.log('Using existing tutors data:', AppState.tutors.length);
    return AppState.tutors;
  }
}

async function loadTutors() {
  try {
    const tutors = await TutorAppAPI.getTutors();
    console.log('Fetched tutors from API:', tutors.length);
    
    // Merge with existing tutors (don't overwrite)
    const existingTutorIds = new Set(AppState.tutors.map(t => t.id));
    const newTutors = tutors.filter(t => !existingTutorIds.has(t.id));
    
    AppState.tutors = [...AppState.tutors, ...newTutors];
    
    // Save to localStorage
    localStorage.setItem('tutors', JSON.stringify(AppState.tutors));
    
    return tutors;
  } catch (error) {
    console.error('Error loading tutors from API:', error);
    console.log('Using existing tutors data:', AppState.tutors.length);
    return AppState.tutors;
  }
}

function getFilteredTutors() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const subjectFilter = document.getElementById('subjectFilter')?.value || '';
  const universityFilter = document.getElementById('universityFilter')?.value || '';
  const ratingFilter = document.getElementById('ratingFilter')?.value || '';

  return AppState.tutors.filter(tutor => {
    const matchesSearch = !searchTerm || 
      tutor.name.toLowerCase().includes(searchTerm) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm)) ||
      tutor.university?.toLowerCase().includes(searchTerm);

    const matchesSubject = !subjectFilter || tutor.subjects.includes(subjectFilter);
    const matchesUniversity = !universityFilter || tutor.university === universityFilter;
    const matchesRating = !ratingFilter || parseFloat(tutor.rating) >= parseFloat(ratingFilter);

    return matchesSearch && matchesSubject && matchesUniversity && matchesRating;
  });
}

function clearFilters() {
  const searchInput = document.getElementById('searchInput');
  const subjectFilter = document.getElementById('subjectFilter');
  const universityFilter = document.getElementById('universityFilter');
  const ratingFilter = document.getElementById('ratingFilter');

  if (searchInput) searchInput.value = '';
  if (subjectFilter) subjectFilter.value = '';
  if (universityFilter) universityFilter.value = '';
  if (ratingFilter) ratingFilter.value = '';

  setupFindTutorsEventListeners();
}

function setupFindTutorsEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const subjectFilter = document.getElementById('subjectFilter');
  const universityFilter = document.getElementById('universityFilter');
  const ratingFilter = document.getElementById('ratingFilter');

  const updateTutors = debounce(() => {
    const filteredTutors = getFilteredTutors();
    const tutorsGrid = document.getElementById('tutorsGrid');
    const resultsCount = document.getElementById('resultsCount');

    if (tutorsGrid) {
      tutorsGrid.innerHTML = filteredTutors.map(tutor => getTutorCardHTML(tutor)).join('');
    }

    if (resultsCount) {
      resultsCount.textContent = `${filteredTutors.length} tutors found`;
    }
  }, 300);

  if (searchInput) {
    searchInput.addEventListener('input', updateTutors);
  }
  if (subjectFilter) {
    subjectFilter.addEventListener('change', updateTutors);
  }
  if (universityFilter) {
    universityFilter.addEventListener('change', updateTutors);
  }
  if (ratingFilter) {
    ratingFilter.addEventListener('change', updateTutors);
  }
}

async function handleTutorApplication(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const tutorData = {
    name: formData.get('name'),
    major: formData.get('major'),
    year: formData.get('year'),
    university: formData.get('university'),
    subjects: formData.get('subjects').split(',').map(s => s.trim()),
    hourlyRate: formData.get('hourlyRate'),
    bio: formData.get('bio')
  };

  try {
    // Try to save to API first
    const newTutor = await TutorAppAPI.createTutor(tutorData);
    console.log('Tutor created via API:', newTutor);
    
    // Add to local state
    AppState.tutors.push(newTutor);
    localStorage.setItem('tutors', JSON.stringify(AppState.tutors));
    
    alert('Tutor application submitted successfully!');
    event.target.reset();
    
  } catch (error) {
    console.error('Error creating tutor via API:', error);
    
    // Fallback to localStorage
    const newTutor = {
      id: Date.now(),
      ...tutorData,
      rating: '4.5',
      reviews: 0,
      availability: 'Available now',
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    
    AppState.tutors.push(newTutor);
    localStorage.setItem('tutors', JSON.stringify(AppState.tutors));
    
    alert('Tutor application submitted successfully! (Saved locally)');
    event.target.reset();
  }
}

function handleSupportForm(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const supportData = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };
  
  console.log('Support form submitted:', supportData);
  alert('Thank you for your message! We\'ll get back to you within 24 hours.');
  event.target.reset();
}

function scrollToForm() {
  document.getElementById('contactForm')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToFAQ() {
  document.getElementById('faqAccordion')?.scrollIntoView({ behavior: 'smooth' });
}

function openLiveChat() {
  alert('Live chat feature coming soon! For now, please use email support.');
}

function openEmailForm() {
  scrollToForm();
}

function showPhoneNumber() {
  alert('Call us at: (555) 123-4567\nHours: Monday-Friday, 9 AM - 6 PM PST');
}

function updateRateDisplay() {
  const slider = document.getElementById('rateSlider');
  const display = document.getElementById('rateDisplay');
  if (slider && display) {
    display.textContent = `$${slider.value}/hour`;
  }
}

function updateRateSlider() {
  const input = document.getElementById('rateInput');
  const slider = document.getElementById('rateSlider');
  if (input && slider) {
    slider.value = input.value;
    updateRateDisplay();
  }
}

// Export functions for use in other modules
window.UtilsModule = {
  debounce,
  loadTutorsFromLocalStorage,
  loadTutorsFromAPI,
  loadTutors,
  getFilteredTutors,
  clearFilters,
  setupFindTutorsEventListeners,
  handleTutorApplication,
  handleSupportForm,
  scrollToForm,
  scrollToFAQ,
  openLiveChat,
  openEmailForm,
  showPhoneNumber,
  updateRateDisplay,
  updateRateSlider
};
