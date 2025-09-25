# TutorApp with SQLite Database

This project now includes a C# ASP.NET Core Web API backend with SQLite database integration.

## Project Structure

```
321Project1/
├── index.html              # Frontend HTML
├── styles/
│   └── main.css            # Frontend CSS
├── scripts/
│   ├── api.js              # API integration layer
│   └── main.js             # Frontend JavaScript
├── TutorApp.API/           # C# Backend API
│   ├── Controllers/        # API Controllers
│   ├── Models/             # Data Models
│   ├── Data/               # Database Context
│   ├── Program.cs          # API Startup
│   └── appsettings.json    # Configuration
└── README-DATABASE.md      # This file
```

## Setup Instructions

### 1. Install .NET 8 SDK
- Download and install .NET 8 SDK from https://dotnet.microsoft.com/download

### 2. Install Dependencies
```bash
cd TutorApp.API
dotnet restore
```

### 3. Run the API
```bash
cd TutorApp.API
dotnet run
```
The API will start on `http://localhost:5000`

### 4. Open the Frontend
- Open `index.html` in your browser
- Or use a local server like Live Server in VS Code

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Tutors
- `GET /api/tutors` - Get all tutors
- `GET /api/tutors/{id}` - Get specific tutor
- `POST /api/tutors` - Create tutor
- `PUT /api/tutors/{id}` - Update tutor
- `DELETE /api/tutors/{id}` - Delete tutor

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get specific booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Delete booking

## Database

The SQLite database file (`tutorapp.db`) will be created automatically when you first run the API. It includes:

- **Users table**: User accounts and authentication
- **Tutors table**: Tutor profiles and information
- **Bookings table**: Tutoring session bookings

## Features

### Frontend (HTML/CSS/JavaScript)
- Responsive Bootstrap 5 design
- Single-page application with client-side routing
- Real-time search and filtering
- Interactive booking system
- Local storage authentication

### Backend (C# ASP.NET Core)
- RESTful API with Entity Framework Core
- SQLite database with automatic migrations
- CORS enabled for frontend integration
- Swagger documentation (available at `/swagger`)

## Development

### Adding New Features
1. Add models in `TutorApp.API/Models/`
2. Update `TutorAppDbContext.cs` if needed
3. Create controllers in `TutorApp.API/Controllers/`
4. Update frontend API calls in `scripts/api.js`

### Database Changes
```bash
cd TutorApp.API
dotnet ef migrations add MigrationName
dotnet ef database update
```

## Troubleshooting

### CORS Issues
If you get CORS errors, make sure the API is running on `http://localhost:5000` and the frontend is being served from a local server (not file://).

### Database Issues
If the database doesn't create properly, delete `tutorapp.db` and restart the API.

### API Connection Issues
Check that the API is running and accessible at `http://localhost:5000/api/tutors`.
