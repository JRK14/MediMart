# Hospital and Patient Login Page with MongoDB Integration

This is a responsive login page designed for both hospitals and patients with MongoDB backend integration. The page features a tab-based interface that allows users to switch between hospital and patient login forms.

## Features

- Tab-based navigation between hospital and patient login forms
- Responsive design that works on desktop and mobile devices
- Form validation for login credentials
- MongoDB integration for storing user data
- Clean and modern UI following the provided design template
- Separate collections for patients and hospitals

## Files

- `index.html` - The main HTML structure
- `styles.css` - CSS styling for the login page
- `script.js` - JavaScript for tab switching and form handling with API integration
- `server.js` - Express.js server with MongoDB integration
- `package.json` - Node.js dependencies
- Image files:
  - `logo1.jpeg` - Logo for the header section
  - `user login 1.jpeg` - Image for the patient login section
  - `hospital 2.jpg` - Image for the hospital login section

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB Atlas account (already configured)

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install mongoose express body-parser cors
   ```
3. The application is already configured to connect to MongoDB Atlas using the provided connection string.
4. Start the server:
   ```
   node server.js
   ```
5. Access the application at http://localhost:3000

### MongoDB Atlas Configuration
The application is configured to use MongoDB Atlas with the following connection string:
```
mongodb+srv://<username>:<password>@cluster0.lpr7kqb.mongodb.net/retryWrites=true&w=majority&appName=Cluster0
```

## MongoDB Schema

### Patient Schema
- email (String, required, unique)
- password (String, required)
- createdAt (Date, default: current date)

### Hospital Schema
- email (String, required, unique)
- password (String, required)
- createdAt (Date, default: current date)

## API Endpoints

- POST `/api/patient/login` - Patient login
- POST `/api/hospital/login` - Hospital login
- POST `/api/patient/register` - Patient registration
- POST `/api/hospital/register` - Hospital registration

## Implementation Notes

- The design follows the provided template images
- Patient section includes text about compassionate care and well-being
- Hospital section includes text about value proposition and credibility
- Form data is securely stored in MongoDB collections
- Basic validation is implemented on both client and server sides
