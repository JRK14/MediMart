const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.lpr7kqb.mongodb.net/hospital_patient_db?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
})
.then(() => console.log('MongoDB Atlas connected successfully'))
.catch(err => console.error('MongoDB Atlas connection error:', err));

// Define schemas
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: String }, // Changed from dob to dateOfBirth to match frontend
    address: { type: String },
    bloodType: { type: String },
    allergies: [String],
    chronicConditions: [String],
    emergencyContact: { type: String }, // Simplified to match frontend
    createdAt: { type: Date, default: Date.now }
});

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    type: { type: String, enum: ['general', 'specialty', 'teaching', 'research'] },
    address: { type: String },
    specialties: [String],
    services: [String],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    totalBeds: { type: Number },
    staffCount: { type: Number },
    annualPatients: { type: Number },
    accreditation: { type: String },
    emergencyServices: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Blood Donation Schema
const bloodDonationSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    age: { type: Number, required: true, min: 18, max: 65 },
    weight: { type: Number, required: true, min: 45 },
    hemoglobin: { type: Number, required: true, min: 12.5, max: 20 },
    bloodType: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    healthStatus: {
        goodHealth: { type: Boolean, required: true },
        noInfections: { type: Boolean, required: true },
        noMedications: { type: Boolean, required: true },
        noRecentSurgery: { type: Boolean, required: true }
    },
    donationDate: { type: Date, required: true },
    donationCenter: { type: String },
    additionalNotes: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

// Medical Services Schema
const medicalServiceSchema = new mongoose.Schema({
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    serviceName: { type: String, required: true },
    category: { type: String, required: true, enum: ['cardiology', 'orthopedics', 'dermatology', 'neurology', 'oncology'] },
    price: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    waitTime: { type: String, required: true },
    successRate: { type: Number, required: true, min: 0, max: 100 },
    description: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Buying/Selling Schema
const marketplaceSchema = new mongoose.Schema({
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    type: { type: String, required: true, enum: ['buying', 'selling'] },
    itemName: { type: String, required: true },
    category: { type: String, required: true, enum: ['equipment', 'medications', 'supplies', 'services'] },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: String },
    budget: { type: String },
    description: { type: String, required: true },
    urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    condition: { type: String, enum: ['new', 'like-new', 'good', 'fair', 'poor'] },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

// Company Aid Providers Schema
const companyAidSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serviceType: { type: String, required: true, enum: ['billing', 'coding', 'transcription', 'claims', 'customer-service'] },
    location: { type: String, required: true, enum: ['local', 'national', 'international'] },
    teamSize: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    responseTime: { type: String, required: true },
    services: [String],
    contactInfo: {
        email: String,
        phone: String,
        website: String
    },
    createdAt: { type: Date, default: Date.now }
});

// Inventory Schema
const inventorySchema = new mongoose.Schema({
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalValue: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['in-stock', 'low-stock', 'out-of-stock'], default: 'in-stock' },
    reorderPoint: { type: Number, default: 10 },
    supplier: { type: String },
    lastUpdated: { type: Date, default: Date.now }
});

// Doctor Schema
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    specialty: { type: String, required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    qualification: { type: String }, // Medical degree
    availability: {
        monday: [{ start: String, end: String }],
        tuesday: [{ start: String, end: String }],
        wednesday: [{ start: String, end: String }],
        thursday: [{ start: String, end: String }],
        friday: [{ start: String, end: String }],
        saturday: [{ start: String, end: String }],
        sunday: [{ start: String, end: String }]
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Appointments Schema
const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Made optional for pending appointments
    doctorName: { type: String }, // Made optional for pending appointments
    specialty: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    appointmentType: { type: String, enum: ['consultation', 'follow-up', 'emergency'], default: 'consultation' },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed', 'rescheduled'], default: 'pending' },
    notes: { type: String },
    hospitalName: { type: String }, // Add hospital name field
    rescheduleReason: { type: String },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    completedAt: { type: Date },
    lastModified: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

// Create models
const Patient = mongoose.model('Patient', patientSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const BloodDonation = mongoose.model('BloodDonation', bloodDonationSchema);
const MedicalService = mongoose.model('MedicalService', medicalServiceSchema);
const Marketplace = mongoose.model('Marketplace', marketplaceSchema);
const CompanyAid = mongoose.model('CompanyAid', companyAidSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// API endpoints
app.post('/api/patient/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // In a real application, you would validate credentials against stored hash
        // This is simplified for demonstration purposes
        const patient = await Patient.findOne({ email });
        
        if (patient && patient.password === password) {
            res.status(200).json({ 
                success: true, 
                message: 'Patient login successful',
                user: {
                    id: patient._id,
                    name: patient.name,
                    email: patient.email
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Patient login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/hospital/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // In a real application, you would validate credentials against stored hash
        // This is simplified for demonstration purposes
        const hospital = await Hospital.findOne({ email });
        
        if (hospital && hospital.password === password) {
            res.status(200).json({ 
                success: true, 
                message: 'Hospital login successful',
                user: {
                    id: hospital._id,
                    name: hospital.name,
                    email: hospital.email
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Hospital login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/patient/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }
        
        // Check if patient already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        
        // Create new patient
        const newPatient = new Patient({ name, email, password });
        await newPatient.save();
        
        res.status(201).json({ success: true, message: 'Patient registered successfully' });
    } catch (error) {
        console.error('Patient registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/hospital/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }
        
        // Check if hospital already exists
        const existingHospital = await Hospital.findOne({ email });
        if (existingHospital) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        
        // Create new hospital
        const newHospital = new Hospital({ name, email, password });
        await newHospital.save();
        
        res.status(201).json({ success: true, message: 'Hospital registered successfully' });
    } catch (error) {
        console.error('Hospital registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start server
// Patient Dashboard APIs
app.post('/api/patient/blood-donation', async (req, res) => {
    try {
        const donationData = req.body;
        
        // Validate required fields
        if (!donationData.donorId) {
            return res.status(400).json({ success: false, message: 'Donor ID is required' });
        }
        
        if (!donationData.age || donationData.age < 18 || donationData.age > 65) {
            return res.status(400).json({ success: false, message: 'Valid age (18-65) is required' });
        }
        
        if (!donationData.weight || donationData.weight < 45) {
            return res.status(400).json({ success: false, message: 'Valid weight (45+ kg) is required' });
        }
        
        if (!donationData.hemoglobin || donationData.hemoglobin < 12.5 || donationData.hemoglobin > 20) {
            return res.status(400).json({ success: false, message: 'Valid hemoglobin level (12.5-20 g/dL) is required' });
        }
        
        if (!donationData.bloodType) {
            return res.status(400).json({ success: false, message: 'Blood type is required' });
        }
        
        if (!donationData.healthStatus || 
            !donationData.healthStatus.goodHealth || 
            !donationData.healthStatus.noInfections || 
            !donationData.healthStatus.noMedications || 
            !donationData.healthStatus.noRecentSurgery) {
            return res.status(400).json({ success: false, message: 'All health status requirements must be confirmed' });
        }
        
        if (!donationData.donationDate) {
            return res.status(400).json({ success: false, message: 'Donation date is required' });
        }
        
        // Create new blood donation
        const newDonation = new BloodDonation(donationData);
        await newDonation.save();
        
        console.log('Blood donation saved successfully:', {
            donorId: newDonation.donorId,
            bloodType: newDonation.bloodType,
            status: newDonation.status,
            createdAt: newDonation.createdAt
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Blood donation request submitted successfully',
            donationId: newDonation._id
        });
    } catch (error) {
        console.error('Blood donation error:', error);
        
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Validation failed', 
                errors: validationErrors 
            });
        }
        
        res.status(500).json({ success: false, message: 'Server error saving blood donation' });
    }
});

// Get blood donations for a specific patient
app.get('/api/patient/blood-donations/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        
        if (!patientId) {
            return res.status(400).json({ success: false, message: 'Patient ID is required' });
        }
        
        const donations = await BloodDonation.find({ donorId: patientId })
            .sort({ createdAt: -1 }) // Most recent first
            .select('-__v'); // Exclude version field
        
        res.status(200).json({ 
            success: true, 
            donations: donations 
        });
        
    } catch (error) {
        console.error('Error fetching blood donations:', error);
        res.status(500).json({ success: false, message: 'Server error fetching blood donations' });
    }
});

// Get all company aid providers for hospital dashboard
app.get('/api/hospital/company-aid', async (req, res) => {
    try {
        console.log('🏢 Fetching company aid providers for hospital dashboard...');
        
        const companies = await CompanyAid.find({})
            .sort({ rating: -1 }) // Highest rating first
            .select('-__v'); // Exclude version field
        
        console.log(`Found ${companies.length} company aid providers`);
        
        res.status(200).json({ 
            success: true, 
            companies: companies 
        });
        
    } catch (error) {
        console.error('Error fetching company aid providers for hospital:', error);
        res.status(500).json({ success: false, message: 'Server error fetching company aid providers' });
    }
});

// Get all blood donations for hospital dashboard (with patient details)
app.get('/api/hospital/blood-donations', async (req, res) => {
    try {
        console.log('Fetching blood donations for hospital dashboard...');
        
        const donations = await BloodDonation.find({})
            .populate('donorId', 'name email phone dateOfBirth address bloodType') // Get patient details
            .sort({ createdAt: -1 }) // Most recent first
            .select('-__v'); // Exclude version field
        
        console.log(`Found ${donations.length} blood donations`);
        
        // Transform data for hospital dashboard
        const transformedDonations = donations.map((donation, index) => {
            console.log(`Processing donation ${index + 1}:`, {
                _id: donation._id,
                donorId: donation.donorId,
                donorIdType: typeof donation.donorId,
                hasDonorId: !!donation.donorId
            });
            
            // Handle case where donorId might be null or undefined
            let donor = {};
            let donorId = null;
            
            if (donation.donorId && typeof donation.donorId === 'object') {
                donor = donation.donorId;
                donorId = donation.donorId._id;
                console.log(`Donor object found:`, { name: donor.name, email: donor.email });
            } else if (donation.donorId) {
                donorId = donation.donorId;
                console.log(`Donor ID found (string/ObjectId):`, donorId);
            } else {
                console.log(`No donor ID found for donation ${index + 1}`);
            }
            
            return {
                _id: donation._id,
                donorId: donorId,
                donorName: donor.name || 'Unknown',
                donorEmail: donor.email || 'No email',
                donorPhone: donor.phone || 'No phone',
                donorAddress: donor.address || 'No address',
                donorBloodType: donor.bloodType || 'Unknown',
                age: donation.age || 0,
                weight: donation.weight || 0,
                hemoglobin: donation.hemoglobin || 0,
                bloodType: donation.bloodType || 'Unknown',
                healthStatus: donation.healthStatus || {
                    goodHealth: false,
                    noInfections: false,
                    noMedications: false,
                    noRecentSurgery: false
                },
                donationDate: donation.donationDate || new Date(),
                donationCenter: donation.donationCenter || 'Not specified',
                additionalNotes: donation.additionalNotes || 'None',
                status: donation.status || 'pending',
                createdAt: donation.createdAt || new Date()
            };
        });
        
        console.log(`Successfully transformed ${transformedDonations.length} donations`);
        
        res.status(200).json({ 
            success: true, 
            donations: transformedDonations 
        });
        
    } catch (error) {
        console.error('Error fetching blood donations for hospital:', error);
        res.status(500).json({ success: false, message: 'Server error fetching blood donations' });
    }
});

// Create new appointment
app.post('/api/patient/appointments', async (req, res) => {
    try {
        const appointmentData = req.body;
        
        // Validate required fields
        if (!appointmentData.hospitalId || !appointmentData.doctorId || !appointmentData.appointmentDate || !appointmentData.appointmentTime) {
            return res.status(400).json({ 
                success: false, 
                message: 'Hospital ID, doctor ID, appointment date, and time are required' 
            });
        }
        
        // Check for appointment conflicts at the same hospital
        const appointmentDate = new Date(appointmentData.appointmentDate);
        const appointmentTime = appointmentData.appointmentTime;
        
        // Find existing appointments at the same hospital on the same date and time
        const conflictingAppointment = await Appointment.findOne({
            hospitalId: appointmentData.hospitalId,
            appointmentDate: {
                $gte: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate()),
                $lt: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate() + 1)
            },
            appointmentTime: appointmentTime,
            status: { $nin: ['cancelled', 'completed'] } // Don't count cancelled or completed appointments
        });
        
        if (conflictingAppointment) {
            return res.status(409).json({ 
                success: false, 
                message: `Appointment conflict: Another patient already has an appointment at this hospital on ${appointmentDate.toLocaleDateString()} at ${appointmentTime}. Please choose a different time or date.` 
            });
        }
        
        // If hospitalName is not provided, try to get it from the hospitalId
        if (!appointmentData.hospitalName && appointmentData.hospitalId) {
            try {
                const hospital = await Hospital.findById(appointmentData.hospitalId);
                if (hospital) {
                    appointmentData.hospitalName = hospital.name;
                }
            } catch (err) {
                console.log('Could not fetch hospital name, continuing without it');
            }
        }
        
        const newAppointment = new Appointment(appointmentData);
        await newAppointment.save();
        
        console.log(`✅ Appointment created successfully for patient ${appointmentData.patientId} at hospital ${appointmentData.hospitalId} on ${appointmentDate.toLocaleDateString()} at ${appointmentTime}`);
        console.log(`👨‍⚕️ Doctor Details: ID=${appointmentData.doctorId}, Name=${appointmentData.doctorName}`);
        console.log(`🏥 Hospital Name: ${appointmentData.hospitalName}`);
        console.log(`📋 Full Appointment Data:`, appointmentData);
        
        res.status(201).json({ 
            success: true, 
            message: 'Appointment created successfully', 
            appointment: newAppointment 
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get hospital appointments for approval
app.get('/api/hospital/:hospitalId/appointments', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        
        // Find all appointments for this hospital
        const appointments = await Appointment.find({ hospitalId })
            .populate('patientId', 'name email phone')
            .sort({ createdAt: -1 });
        
        // Transform appointments to include patient details
        const transformedAppointments = appointments.map(appointment => {
            const patient = appointment.patientId;
            return {
                _id: appointment._id,
                patientName: patient ? patient.name : 'Unknown Patient',
                patientEmail: patient ? patient.email : 'No email',
                patientPhone: patient ? patient.phone : 'No phone',
                doctorName: appointment.doctorName || 'TBD',
                specialty: appointment.specialty,
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                appointmentType: appointment.appointmentType,
                status: appointment.status,
                notes: appointment.notes,
                hospitalName: appointment.hospitalName,
                createdAt: appointment.createdAt,
                approvedAt: appointment.approvedAt,
                rejectedAt: appointment.rejectedAt,
                completedAt: appointment.completedAt
            };
        });
        
        console.log(`🏥 Found ${transformedAppointments.length} appointments for hospital ${hospitalId}`);
        
        res.status(200).json({
            success: true,
            appointments: transformedAppointments
        });
        
    } catch (error) {
        console.error('Error fetching hospital appointments:', error);
        res.status(500).json({ success: false, message: 'Server error fetching appointments' });
    }
});

// Approve appointment
app.put('/api/hospital/appointments/:appointmentId/approve', async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status, approvedAt } = req.body;
        
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        
        appointment.status = status;
        appointment.approvedAt = approvedAt;
        appointment.lastModified = new Date();
        
        await appointment.save();
        
        console.log(`✅ Appointment ${appointmentId} approved successfully`);
        
        res.status(200).json({
            success: true,
            message: 'Appointment approved successfully',
            appointment: appointment
        });
        
    } catch (error) {
        console.error('Error approving appointment:', error);
        res.status(500).json({ success: false, message: 'Server error approving appointment' });
    }
});

// Reject appointment
app.put('/api/hospital/appointments/:appointmentId/reject', async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status, rejectedAt } = req.body;
        
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        
        appointment.status = status;
        appointment.rejectedAt = rejectedAt;
        appointment.lastModified = new Date();
        
        await appointment.save();
        
        console.log(`❌ Appointment ${appointmentId} rejected successfully`);
        
        res.status(200).json({
            success: false,
            message: 'Appointment rejected successfully',
            appointment: appointment
        });
        
    } catch (error) {
        console.error('Error rejecting appointment:', error);
        res.status(500).json({ success: false, message: 'Server error rejecting appointment' });
    }
});

// Complete appointment
app.put('/api/hospital/appointments/:appointmentId/complete', async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status, completedAt } = req.body;
        
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        
        appointment.status = status;
        appointment.completedAt = completedAt;
        appointment.lastModified = new Date();
        
        await appointment.save();
        
        console.log(`✅ Appointment ${appointmentId} marked as completed`);
        
        res.status(200).json({
            success: true,
            message: 'Appointment marked as completed',
            appointment: appointment
        });
        
    } catch (error) {
        console.error('Error completing appointment:', error);
        res.status(500).json({ success: false, message: 'Server error completing appointment' });
    }
});

// ========================================
// DOCTOR MANAGEMENT ENDPOINTS
// ========================================

// Get all doctors for a hospital
app.get('/api/hospital/:hospitalId/doctors', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        
        console.log(`🏥 Fetching doctors for hospital: ${hospitalId}`);
        
        const doctors = await Doctor.find({ hospitalId: hospitalId });
        
        console.log(`✅ Found ${doctors.length} doctors for hospital ${hospitalId}`);
        
        res.status(200).json({
            success: true,
            doctors: doctors
        });
        
    } catch (error) {
        console.error('Error fetching hospital doctors:', error);
        res.status(500).json({ success: false, message: 'Server error fetching doctors' });
    }
});

// Add new doctor to hospital
app.post('/api/hospital/doctors', async (req, res) => {
    try {
        const doctorData = req.body;
        
        console.log('📝 Adding new doctor:', doctorData);
        
        // Validate required fields
        if (!doctorData.name || !doctorData.email || !doctorData.phone || !doctorData.specialty || !doctorData.qualification || !doctorData.hospitalId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, phone, specialty, qualification, and hospitalId are required' 
            });
        }
        
        // Check if doctor email already exists
        const existingDoctor = await Doctor.findOne({ email: doctorData.email });
        if (existingDoctor) {
            return res.status(400).json({ 
                success: false, 
                message: 'A doctor with this email already exists' 
            });
        }
        
        // Create new doctor
        const newDoctor = new Doctor({
            name: doctorData.name,
            email: doctorData.email,
            phone: doctorData.phone,
            specialty: doctorData.specialty,
            qualification: doctorData.qualification,
            department: doctorData.department || '',
            notes: doctorData.notes || '',
            hospitalId: doctorData.hospitalId
        });
        
        await newDoctor.save();
        
        console.log(`✅ Doctor ${doctorData.name} added successfully to hospital ${doctorData.hospitalId}`);
        
        res.status(201).json({
            success: true,
            message: 'Doctor added successfully',
            doctor: newDoctor
        });
        
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ success: false, message: 'Server error adding doctor' });
    }
});

// Update doctor
app.put('/api/hospital/doctors/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        const updateData = req.body;
        
        console.log(`✏️ Updating doctor ${doctorId}:`, updateData);
        
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        
        // Update fields
        Object.keys(updateData).forEach(key => {
            if (key !== '_id' && key !== 'hospitalId') {
                doctor[key] = updateData[key];
            }
        });
        
        doctor.lastModified = new Date();
        await doctor.save();
        
        console.log(`✅ Doctor ${doctorId} updated successfully`);
        
        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            doctor: doctor
        });
        
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ success: false, message: 'Server error updating doctor' });
    }
});

// Delete doctor
app.delete('/api/hospital/doctors/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        console.log(`🗑️ Deleting doctor ${doctorId}`);
        
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        
        // Check if doctor has any appointments
        const hasAppointments = await Appointment.findOne({ doctorId: doctorId });
        if (hasAppointments) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete doctor with existing appointments. Please reassign or complete all appointments first.' 
            });
        }
        
        await Doctor.findByIdAndDelete(doctorId);
        
        console.log(`✅ Doctor ${doctorId} deleted successfully`);
        
        res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ success: false, message: 'Server error deleting doctor' });
    }
});

// Get patient profile
app.get('/api/patient/profile/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        
        const patient = await Patient.findById(patientId).select('-password');
        
        if (!patient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patient not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            patient: patient 
        });
        
    } catch (error) {
        console.error('Profile retrieval error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error retrieving profile' 
        });
    }
});

// Get hospital profile
app.get('/api/hospital/profile/:hospitalId', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        
        const hospital = await Hospital.findById(hospitalId).select('-password');
        
        if (!hospital) {
            return res.status(404).json({ 
                success: false, 
                message: 'Hospital not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            hospital: hospital 
        });
        
    } catch (error) {
        console.error('Hospital profile retrieval error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error retrieving hospital profile' 
        });
    }
});

// Update patient profile
app.put('/api/patient/profile/:patientId', async (req, res) => {
    try {
        const { patientId } = req.params;
        const updateData = req.body;
        
        // Validate required fields
        if (!updateData.name || !updateData.email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and email are required' 
            });
        }
        
        // Check if email is already taken by another patient
        const existingPatient = await Patient.findOne({ 
            email: updateData.email, 
            _id: { $ne: patientId } 
        });
        
        if (existingPatient) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is already registered by another patient' 
            });
        }
        
        // Update the patient profile
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            {
                name: updateData.name,
                email: updateData.email,
                phone: updateData.phone || '',
                dateOfBirth: updateData.dateOfBirth || '',
                address: updateData.address || '',
                bloodType: updateData.bloodType || '',
                allergies: Array.isArray(updateData.allergies) ? updateData.allergies : [],
                chronicConditions: Array.isArray(updateData.chronicConditions) ? updateData.chronicConditions : [],
                emergencyContact: updateData.emergencyContact || ''
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedPatient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patient not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Profile updated successfully', 
            patient: updatedPatient 
        });
        
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error updating profile' 
        });
    }
});

// Update hospital profile
app.put('/api/hospital/profile/:hospitalId', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const updateData = req.body;
        
        // Validate required fields
        if (!updateData.name || !updateData.email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and email are required' 
            });
        }
        
        // Check if email is already taken by another hospital
        const existingHospital = await Hospital.findOne({ 
            email: updateData.email, 
            _id: { $ne: hospitalId } 
        });
        
        if (existingHospital) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is already registered by another hospital' 
            });
        }
        
        // Update the hospital profile
        const updatedHospital = await Hospital.findByIdAndUpdate(
            hospitalId,
            {
                name: updateData.name,
                email: updateData.email,
                phone: updateData.phone || '',
                type: updateData.type || 'general',
                address: updateData.address || '',
                specialties: Array.isArray(updateData.specialties) ? updateData.specialties : [],
                totalBeds: updateData.totalBeds || 0,
                staffCount: updateData.staffCount || 0,
                annualPatients: updateData.annualPatients || 0,
                accreditation: updateData.accreditation || '',
                emergencyServices: updateData.emergencyServices || false
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedHospital) {
            return res.status(404).json({ 
                success: false, 
                message: 'Hospital not found' 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Hospital profile updated successfully', 
            hospital: updatedHospital 
        });
        
    } catch (error) {
        console.error('Hospital profile update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error updating hospital profile' 
        });
    }
});

app.get('/api/patient/appointments/:patientId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.params.patientId })
            .populate('hospitalId', 'name address')
            .sort({ appointmentDate: 1 });
        
        // Transform the data to match frontend expectations
        const transformedAppointments = appointments.map(appointment => ({
            _id: appointment._id,
            doctorName: appointment.doctorName || 'Dr. Smith',
            specialty: appointment.specialty || 'General Medicine',
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime || '10:00 AM',
            hospitalName: appointment.hospitalId ? appointment.hospitalId.name : 'Hospital',
            appointmentType: appointment.appointmentType || 'Consultation',
            status: appointment.status || 'confirmed'
        }));
        
        res.status(200).json({ success: true, appointments: transformedAppointments });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Reschedule appointment
app.put('/api/patient/appointments/:appointmentId/reschedule', async (req, res) => {
    try {
        const { newDate, newTime, reason } = req.body;
        const appointmentId = req.params.appointmentId;

        // Validate required fields
        if (!newDate || !newTime) {
            return res.status(400).json({ success: false, message: 'New date and time are required' });
        }

        // First, get the current appointment to check hospitalId
        const currentAppointment = await Appointment.findById(appointmentId);
        if (!currentAppointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Check for appointment conflicts at the same hospital
        const appointmentDate = new Date(newDate);
        const appointmentTime = newTime;
        
        // Find existing appointments at the same hospital on the same date and time
        const conflictingAppointment = await Appointment.findOne({
            hospitalId: currentAppointment.hospitalId,
            appointmentDate: {
                $gte: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate()),
                $lt: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate() + 1)
            },
            appointmentTime: appointmentTime,
            status: { $nin: ['cancelled', 'completed'] }, // Don't count cancelled or completed appointments
            _id: { $ne: appointmentId } // Exclude the current appointment being rescheduled
        });
        
        if (conflictingAppointment) {
            return res.status(409).json({ 
                success: false, 
                message: `Appointment conflict: Another patient already has an appointment at this hospital on ${appointmentDate.toLocaleDateString()} at ${appointmentTime}. Please choose a different time or date.` 
            });
        }

        // Find and update the appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            {
                appointmentDate: new Date(newDate),
                appointmentTime: newTime,
                status: 'rescheduled',
                rescheduleReason: reason,
                lastModified: new Date()
            },
            { new: true, runValidators: true }
        );

        console.log(`✅ Appointment ${appointmentId} rescheduled successfully to ${appointmentDate.toLocaleDateString()} at ${appointmentTime}`);

        res.status(200).json({ 
            success: true, 
            message: 'Appointment rescheduled successfully',
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error('Reschedule appointment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Quote request endpoint
app.post('/api/patient/quote-request', async (req, res) => {
    try {
        const { serviceId, hospitalId, name, email, phone, message } = req.body;
        
        // Validate required fields
        if (!serviceId || !hospitalId || !name || !email || !phone) {
            return res.status(400).json({ success: false, message: 'Service ID, hospital ID, name, email, and phone are required' });
        }

        // In a real application, you would save this to a quote requests collection
        // For now, we'll just return success
        const quoteRequest = {
            serviceId,
            hospitalId,
            name,
            email,
            phone,
            message: message || '',
            status: 'pending',
            createdAt: new Date()
        };

        // Log the quote request (in production, save to database)
        console.log('Quote request received:', quoteRequest);

        res.status(201).json({ 
            success: true, 
            message: 'Quote request submitted successfully',
            quoteRequest
        });
    } catch (error) {
        console.error('Quote request error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Find available doctors for a specific specialty, hospital, date, and time
app.get('/api/hospital/:hospitalId/available-doctors', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { specialty, date, time } = req.query;
        
        // Validate required parameters
        if (!specialty || !date || !time) {
            return res.status(400).json({ 
                success: false, 
                message: 'Specialty, date, and time are required' 
            });
        }
        
        // Validate date format
        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid date format. Please use YYYY-MM-DD format.' 
            });
        }
        
        // Get day of week for availability check
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayOfWeek = days[appointmentDate.getDay()];
        
        // Find doctors with the specified specialty at the hospital
        const doctors = await Doctor.find({
            hospitalId: hospitalId,
            specialty: specialty,
            isActive: true
        }).select('name email phone qualification availability');
        
        if (doctors.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No doctors found for this specialty at this hospital',
                doctors: [],
                availableDoctors: []
            });
        }
        
        // Check which doctors are available at the specified time
        const availableDoctors = [];
        
        for (const doctor of doctors) {
            // Check if doctor has availability for this day
            if (doctor.availability && doctor.availability[dayOfWeek]) {
                // Check if the requested time falls within any available slot
                const isAvailable = doctor.availability[dayOfWeek].some(slot => {
                    return time >= slot.start && time <= slot.end;
                });
                
                if (isAvailable) {
                    // Check if doctor has any conflicting appointments
                    const conflictingAppointment = await Appointment.findOne({
                        doctorId: doctor._id,
                        appointmentDate: {
                            $gte: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate()),
                            $lt: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate() + 1)
                        },
                        appointmentTime: time,
                        status: { $nin: ['cancelled', 'completed'] }
                    });
                    
                    if (!conflictingAppointment) {
                        availableDoctors.push({
                            _id: doctor._id,
                            name: doctor.name,
                            email: doctor.email,
                            phone: doctor.phone,
                            specialty: doctor.specialty,
                            qualification: doctor.qualification,
                            availability: doctor.availability[dayOfWeek]
                        });
                    }
                }
            }
        }
        
        res.status(200).json({
            success: true,
            hospitalId: hospitalId,
            specialty: specialty,
            date: appointmentDate.toLocaleDateString(),
            time: time,
            totalDoctors: doctors.length,
            availableDoctors: availableDoctors,
            totalAvailable: availableDoctors.length
        });
        
    } catch (error) {
        console.error('Find available doctors error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Check available time slots for a hospital on a specific date
app.get('/api/hospital/:hospitalId/available-slots/:date', async (req, res) => {
    try {
        const { hospitalId, date } = req.params;
        
        // Validate date format
        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid date format. Please use YYYY-MM-DD format.' 
            });
        }
        
        // Define available time slots (you can customize these)
        const availableTimeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
        ];
        
        // Get all appointments for this hospital on this date
        const existingAppointments = await Appointment.find({
            hospitalId: hospitalId,
            appointmentDate: {
                $gte: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate()),
                $lt: new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate() + 1)
            },
            status: { $nin: ['cancelled', 'completed'] }
        });
        
        // Get booked time slots
        const bookedTimeSlots = existingAppointments.map(apt => apt.appointmentTime);
        
        // Filter out booked time slots
        const availableSlots = availableTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));
        
        res.status(200).json({
            success: true,
            hospitalId: hospitalId,
            date: appointmentDate.toLocaleDateString(),
            availableSlots: availableSlots,
            bookedSlots: bookedTimeSlots,
            totalAvailable: availableSlots.length,
            totalBooked: bookedTimeSlots.length
        });
        
    } catch (error) {
        console.error('Check available slots error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all doctors by specialty for availability display
app.get('/api/hospital/:hospitalId/doctors-by-specialty', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { specialty } = req.query;
        
        if (!specialty) {
            return res.status(400).json({
                success: false,
                message: 'Specialty is required'
            });
        }

        // Validate hospital ID
        if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid hospital ID'
            });
        }

        // Find all doctors with the specified specialty at the hospital
        const doctors = await Doctor.find({
            hospitalId: hospitalId,
            specialty: specialty,
            isActive: true
        }).select('name qualification availability');

        res.json({
            success: true,
            doctors,
            message: `Found ${doctors.length} doctor(s) for ${specialty}`
        });

    } catch (error) {
        console.error('Error getting doctors by specialty:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Check for appointment conflicts in the appointments collection
app.get('/api/hospital/:hospitalId/check-appointment-conflicts', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { specialty, date, time } = req.query;
        
        if (!specialty || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Specialty, date, and time are required'
            });
        }

        // Validate hospital ID
        if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid hospital ID'
            });
        }

        console.log('🔍 Checking appointment conflicts for:', { hospitalId, specialty, date, time });

        // Check the appointments collection for conflicts
        const conflictingAppointments = await Appointment.find({
            hospitalId: hospitalId,
            appointmentDate: date,
            appointmentTime: time,
            status: { $nin: ['cancelled', 'completed'] } // Exclude cancelled and completed appointments
        });

        console.log(`📊 Found ${conflictingAppointments.length} conflicting appointments`);

        // If there are conflicting appointments, check if any are for the same specialty
        let hasConflict = false;
        if (conflictingAppointments.length > 0) {
            // Check if any conflicting appointment is for the same specialty
            const specialtyConflict = conflictingAppointments.find(apt => apt.specialty === specialty);
            if (specialtyConflict) {
                hasConflict = true;
                console.log(`❌ Specialty conflict found: ${specialtyConflict.specialty} appointment already exists`);
            } else {
                console.log(`⚠️ Time conflict found but different specialty - may still be available`);
            }
        }

        res.json({
            success: true,
            hasConflict: hasConflict,
            conflictingAppointments: conflictingAppointments.length,
            message: hasConflict ? 
                `Conflict found: ${specialty} appointment already exists at ${date} ${time}` :
                `No conflicts found for ${specialty} at ${date} ${time}`
        });

    } catch (error) {
        console.error('Error checking appointment conflicts:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Cancel appointment
app.put('/api/patient/appointments/:appointmentId/cancel', async (req, res) => {
    try {
        const { reason } = req.body;
        const appointmentId = req.params.appointmentId;

        // Validate required fields
        if (!reason) {
            return res.status(400).json({ success: false, message: 'Cancellation reason is required' });
        }

        // Find and update the appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            {
                status: 'cancelled',
                cancellationReason: reason,
                cancelledAt: new Date(),
                lastModified: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Appointment cancelled successfully',
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/patient/profile/:patientId', async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.patientId,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, patient: updatedPatient });
    } catch (error) {
        console.error('Update patient profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Medical Services APIs
app.get('/api/medical-services', async (req, res) => {
    try {
        const { category, price, rating } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (rating) query.rating = { $gte: parseInt(rating) };
        
        const services = await MedicalService.find(query)
            .populate('hospitalId', 'name address')
            .sort({ rating: -1 });
        
        res.status(200).json({ success: true, services });
    } catch (error) {
        console.error('Get medical services error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Hospital Dashboard APIs
app.post('/api/hospital/marketplace', async (req, res) => {
    try {
        const marketplaceData = req.body;
        const newListing = new Marketplace(marketplaceData);
        await newListing.save();
        res.status(201).json({ success: true, message: 'Listing created successfully' });
    } catch (error) {
        console.error('Marketplace error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/hospital/marketplace/:type', async (req, res) => {
    try {
        const listings = await Marketplace.find({ type: req.params.type, status: 'active' })
            .populate('hospitalId', 'name address')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, listings });
    } catch (error) {
        console.error('Get marketplace error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Blood Donors Database API
app.get('/api/hospital/blood-donors', async (req, res) => {
    try {
        const { bloodType, location, availability } = req.query;
        let query = { status: 'approved' };
        
        if (bloodType) query.bloodType = bloodType;
        if (availability) {
            const today = new Date();
            if (availability === 'available') {
                query.donationDate = { $gte: today };
            }
        }
        
        const donors = await BloodDonation.find(query)
            .populate('donorId', 'name email phone')
            .sort({ donationDate: 1 });
        
        res.status(200).json({ success: true, donors });
    } catch (error) {
        console.error('Get blood donors error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Company Aid Providers API
app.get('/api/hospital/company-aid', async (req, res) => {
    try {
        const { serviceType, location } = req.query;
        let query = {};
        
        if (serviceType) query.serviceType = serviceType;
        if (location) query.location = location;
        
        const companies = await CompanyAid.find(query).sort({ rating: -1 });
        res.status(200).json({ success: true, companies });
    } catch (error) {
        console.error('Get company aid error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Inventory Management APIs
app.get('/api/hospital/inventory/:hospitalId', async (req, res) => {
    try {
        const inventory = await Inventory.find({ hospitalId: req.params.hospitalId })
            .sort({ lastUpdated: -1 });
        res.status(200).json({ success: true, inventory });
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/hospital/inventory', async (req, res) => {
    try {
        const inventoryData = req.body;
        const newItem = new Inventory(inventoryData);
        await newItem.save();
        res.status(201).json({ success: true, message: 'Inventory item added successfully' });
    } catch (error) {
        console.error('Add inventory error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/hospital/inventory/:itemId', async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.itemId,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, item: updatedItem });
    } catch (error) {
        console.error('Update inventory error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Hospital Profile API
app.put('/api/hospital/profile/:hospitalId', async (req, res) => {
    try {
        const updatedHospital = await Hospital.findByIdAndUpdate(
            req.params.hospitalId,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, hospital: updatedHospital });
    } catch (error) {
        console.error('Update hospital profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get Hospital Details API
app.get('/api/hospital/:hospitalId', async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.hospitalId);
        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }
        res.status(200).json({ success: true, hospital });
    } catch (error) {
        console.error('Get hospital error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get Hospital Services API
app.get('/api/hospital/:hospitalId/services', async (req, res) => {
    try {
        const services = await MedicalService.find({ hospitalId: req.params.hospitalId })
            .sort({ rating: -1 });
        res.status(200).json({ success: true, services });
    } catch (error) {
        console.error('Get hospital services error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get Hospitals for Medical Services Comparison API
app.get('/api/hospitals/medical-comparison', async (req, res) => {
    try {
        console.log('🏥 Fetching hospitals for medical services comparison...');
        
        // Fetch all hospitals with their ratings, sorted by rating in descending order
        const hospitals = await Hospital.find({})
            .select('name type specialties services rating totalRatings address phone email')
            .sort({ rating: -1, totalRatings: -1 }); // Sort by rating first, then by number of ratings
        
        console.log(`Found ${hospitals.length} hospitals for comparison`);
        
        // Transform data to include rating display
        const transformedHospitals = hospitals.map(hospital => ({
            _id: hospital._id,
            name: hospital.name,
            type: hospital.type,
            specialties: hospital.specialties || [],
            services: hospital.services || [],
            rating: hospital.rating || 0,
            totalRatings: hospital.totalRatings || 0,
            address: hospital.address || 'Not specified',
            phone: hospital.phone || 'Not specified',
            email: hospital.email || 'Not specified',
            hasRating: hospital.totalRatings > 0
        }));
        
        res.status(200).json({
            success: true,
            hospitals: transformedHospitals
        });
    } catch (error) {
        console.error('Error fetching hospitals for medical comparison:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching hospitals for comparison' 
        });
    }
});

// Rate Hospital API
app.post('/api/hospital/:hospitalId/rate', async (req, res) => {
    try {
        const { rating } = req.body;
        const hospitalId = req.params.hospitalId;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }
        
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ 
                success: false, 
                message: 'Hospital not found' 
            });
        }
        
        // Calculate new average rating
        const currentTotal = hospital.rating * hospital.totalRatings;
        const newTotal = currentTotal + rating;
        const newTotalRatings = hospital.totalRatings + 1;
        const newAverageRating = newTotal / newTotalRatings;
        
        // Update hospital rating
        const updatedHospital = await Hospital.findByIdAndUpdate(
            hospitalId,
            {
                rating: Math.round(newAverageRating * 10) / 10, // Round to 1 decimal place
                totalRatings: newTotalRatings
            },
            { new: true }
        );
        
        console.log(`Hospital ${hospital.name} rated: ${rating}/5. New average: ${updatedHospital.rating}/5`);
        
        res.status(200).json({
            success: true,
            hospital: updatedHospital,
            message: 'Hospital rated successfully'
        });
    } catch (error) {
        console.error('Error rating hospital:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error rating hospital' 
        });
    }
});

// Seed data for testing
app.post('/api/seed-data', async (req, res) => {
    try {
        // Create sample medical services
        const sampleServices = [
            {
                hospitalId: new mongoose.Types.ObjectId(), // You'll need to replace with actual hospital ID
                serviceName: 'Cardiac Surgery',
                category: 'cardiology',
                price: { min: 25000, max: 35000 },
                waitTime: '2-3 weeks',
                successRate: 95,
                description: 'Advanced cardiac surgical procedures',
                rating: 4.8,
                totalRatings: 150
            }
        ];
        
        await MedicalService.insertMany(sampleServices);
        
        // Create sample company aid providers
        const sampleCompanies = [
            {
                name: 'MedCare BPO Solutions',
                serviceType: 'billing',
                location: 'local',
                teamSize: '150+',
                rating: 4.7,
                responseTime: '< 2 hours',
                services: ['Claims Processing', 'Payment Posting', 'Denial Management', 'Patient Billing'],
                contactInfo: {
                    email: 'contact@medcarebpo.com',
                    phone: '+1-555-123-4567',
                    website: 'www.medcarebpo.com'
                }
            }
        ];
        
        await CompanyAid.insertMany(sampleCompanies);
        
        res.status(200).json({ success: true, message: 'Sample data created successfully' });
    } catch (error) {
        console.error('Seed data error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
