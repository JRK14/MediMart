# MongoDB Database Structure for VMEDITHON Dashboards

## Overview
This guide explains how the MongoDB database is structured to support all the features in both the Patient and Hospital dashboards.

## Database Collections

### 1. **Patients Collection** (`patients`)
**Purpose**: Stores patient user accounts and profile information

**Schema Fields**:
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required),
  phone: String,
  dob: Date,
  address: String,
  bloodType: String,
  allergies: [String],
  chronicConditions: [String],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  createdAt: Date
}
```

**Dashboard Usage**: 
- Patient login/authentication
- Profile management
- Blood donation eligibility
- Emergency contact information

---

### 2. **Hospitals Collection** (`hospitals`)
**Purpose**: Stores hospital user accounts and institutional information

**Schema Fields**:
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required),
  phone: String,
  type: String (enum: ['general', 'specialty', 'teaching', 'research']),
  address: String,
  specialties: [String],
  totalBeds: Number,
  staffCount: Number,
  annualPatients: Number,
  accreditation: String,
  emergencyServices: Boolean,
  createdAt: Date
}
```

**Dashboard Usage**:
- Hospital login/authentication
- Profile management
- Service offerings
- Institutional statistics

---

### 3. **Blood Donations Collection** (`blooddonations`)
**Purpose**: Stores blood donation requests and donor information

**Schema Fields**:
```javascript
{
  _id: ObjectId,
  donorId: ObjectId (ref: 'Patient'),
  age: Number (18-65, required),
  weight: Number (min 45kg, required),
  hemoglobin: Number (12.5-20 g/dL, required),
  bloodType: String (enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  healthStatus: {
    goodHealth: Boolean (required),
    noInfections: Boolean (required),
    noMedications: Boolean (required),
    noRecentSurgery: Boolean (required)
  },
  donationDate: Date (required),
  donationCenter: String,
  additionalNotes: String,
  status: String (enum: ['pending', 'approved', 'rejected', 'completed']),
  createdAt: Date
}
```

**Dashboard Usage**:
- **Patient Dashboard**: Submit blood donation requests
- **Hospital Dashboard**: View and manage blood donor database

---

### 4. **Medical Services Collection** (`medicalservices`)
**Purpose**: Stores hospital service offerings for patient comparison

**Schema Fields**:
```javascript
{
  _id: ObjectId,
  hospitalId: ObjectId (ref: 'Hospital'),
  serviceName: String (required),
  category: String (enum: ['cardiology', 'orthopedics', 'dermatology', 'neurology', 'oncology']),
  price: {
    min: Number (required),
    max: Number (required)
  },
  waitTime: String (required),
  successRate: Number (0-100, required),
  description: String,
  rating: Number (0-5),
  totalRatings: Number,
  createdAt: Date
}
```

**Dashboard Usage**:
- **Patient Dashboard**: Compare medical services across hospitals
- **Hospital Dashboard**: Manage service offerings

---

### 5. **Marketplace Collection** (`marketplaces`)
**Purpose**: Stores buying and selling listings for medical equipment/supplies

**Schema Fields**:
```javascript
{
  _id: ObjectId,
  hospitalId: ObjectId (ref: 'Hospital'),
  type: String (enum: ['buying', 'selling']),
  itemName: String (required),
  category: String (enum: ['equipment', 'medications', 'supplies', 'services']),
  quantity: Number (min 1, required),
  price: String,
  budget: String,
  description: String (required),
  urgency: String (enum: ['low', 'medium', 'high', 'critical']),
  condition: String (enum: ['new', 'like-new', 'good', 'fair', 'poor']),
  status: String (enum: ['active', 'completed', 'cancelled']),
  createdAt: Date
}
```

**Dashboard Usage**:
- **Hospital Dashboard**: Post buying requests and selling listings
- **Patient Dashboard**: View available services (if applicable)

---

### 6. **Company Aid Providers Collection** (`companyaids`)
**Purpose**: Stores BPO companies offering medical support services

**Schema Fields**:
```javascript
{
  _id: ObjectId,
  name: String (required),
  serviceType: String (enum: ['billing', 'coding', 'transcription', 'claims', 'customer-service']),
  location: String (enum: ['local', 'national', 'international']),
  teamSize: String (required),
  rating: Number (0-5, required),
  responseTime: String (required),
  services: [String],
  contactInfo: {
    email: String,
    phone: String,
    website: String
  },
  createdAt: Date
}
```

**Dashboard Usage**:
- **Hospital Dashboard**: Browse and contact BPO service providers
- **Patient Dashboard**: Not applicable

---

### 7. **Inventory Collection** (`inventories`)
**Purpose**: Tracks hospital medical supplies and equipment

**Schema Fields**:
```javascript
{
  _id: ObjectId,
  hospitalId: ObjectId (ref: 'Hospital'),
  itemName: String (required),
  category: String (required),
  quantity: Number (min 0, required),
  unitPrice: Number (min 0, required),
  totalValue: Number (min 0, required),
  status: String (enum: ['in-stock', 'low-stock', 'out-of-stock']),
  reorderPoint: Number (default: 10),
  supplier: String,
  lastUpdated: Date
}
```

**Dashboard Usage**:
- **Hospital Dashboard**: Manage inventory levels and reorder points
- **Patient Dashboard**: Not applicable

---

### 8. **Appointments Collection** (`appointments`)
**Purpose**: Manages patient appointments with hospitals

**Schema Fields**:
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: 'Patient'),
  hospitalId: ObjectId (ref: 'Hospital'),
  doctorName: String (required),
  specialty: String (required),
  appointmentDate: Date (required),
  appointmentTime: String (required),
  type: String (enum: ['consultation', 'follow-up', 'emergency']),
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  notes: String,
  createdAt: Date
}
```

**Dashboard Usage**:
- **Patient Dashboard**: View and manage appointments
- **Hospital Dashboard**: Manage patient appointments

---

## API Endpoints

### Patient Dashboard APIs
- `POST /api/patient/blood-donation` - Submit blood donation request
- `GET /api/patient/appointments/:patientId` - Get patient appointments
- `PUT /api/patient/profile/:patientId` - Update patient profile
- `GET /api/medical-services` - Get medical services for comparison

### Hospital Dashboard APIs
- `POST /api/hospital/marketplace` - Create buying/selling listing
- `GET /api/hospital/marketplace/:type` - Get marketplace listings
- `GET /api/hospital/blood-donors` - Get blood donor database
- `GET /api/hospital/company-aid` - Get company aid providers
- `GET /api/hospital/inventory/:hospitalId` - Get hospital inventory
- `POST /api/hospital/inventory` - Add inventory item
- `PUT /api/hospital/inventory/:itemId` - Update inventory item
- `PUT /api/hospital/profile/:hospitalId` - Update hospital profile

## Database Relationships

### One-to-Many Relationships
- **Hospital → Medical Services**: One hospital can offer many services
- **Hospital → Marketplace**: One hospital can have many buying/selling listings
- **Hospital → Inventory**: One hospital can have many inventory items
- **Patient → Blood Donations**: One patient can have many donation requests
- **Patient → Appointments**: One patient can have many appointments

### Many-to-Many Relationships
- **Patients ↔ Hospitals**: Through appointments and blood donations

## Sample Data

The database is populated with sample data including:
- 3 sample patients with complete profiles
- 3 sample hospitals with different specialties
- 2 blood donation requests
- 3 medical services for comparison
- 2 marketplace listings
- 3 company aid providers
- 3 inventory items
- 2 sample appointments

## How to Use

1. **Start the backend server**: `node server.js` (Port 3001)
2. **Start the frontend server**: `node simple_server.js` (Port 8090)
3. **Seed the database**: `node seed-database.js` (One-time setup)
4. **Access the application**: http://localhost:8090

## Testing the Database

You can test the database connections and view data using:
- **MongoDB Atlas**: View collections and documents
- **API Testing**: Use tools like Postman or curl to test endpoints
- **Frontend**: Use the dashboards to interact with the data

## Security Notes

- Passwords are stored in plain text (for demo purposes only)
- In production, implement proper password hashing
- Add authentication middleware for protected routes
- Implement rate limiting and input validation


