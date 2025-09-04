const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.lpr7kqb.mongodb.net/hospital_patient_db?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected successfully'))
.catch(err => console.error('MongoDB Atlas connection error:', err));

// Define schemas (same as server.js)
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    dob: { type: Date },
    address: { type: String },
    bloodType: { type: String },
    allergies: [String],
    chronicConditions: [String],
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
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
    totalBeds: { type: Number },
    staffCount: { type: Number },
    annualPatients: { type: Number },
    accreditation: { type: String },
    emergencyServices: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

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

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    doctorName: { type: String, required: true },
    specialty: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    type: { type: String, enum: ['consultation', 'follow-up', 'emergency'], default: 'consultation' },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Create models
const Patient = mongoose.model('Patient', patientSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);
const BloodDonation = mongoose.model('BloodDonation', bloodDonationSchema);
const MedicalService = mongoose.model('MedicalService', medicalServiceSchema);
const Marketplace = mongoose.model('Marketplace', marketplaceSchema);
const CompanyAid = mongoose.model('CompanyAid', companyAidSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Sample data
async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        // Clear existing data
        await Patient.deleteMany({});
        await Hospital.deleteMany({});
        await BloodDonation.deleteMany({});
        await MedicalService.deleteMany({});
        await Marketplace.deleteMany({});
        await CompanyAid.deleteMany({});
        await Inventory.deleteMany({});
        await Appointment.deleteMany({});

        console.log('Existing data cleared');

        // Create sample patients
        const patients = await Patient.insertMany([
            {
                name: 'John Smith',
                email: 'john.smith@email.com',
                password: 'password123',
                phone: '+1 (555) 123-4567',
                dob: new Date('1990-05-15'),
                address: '123 Main Street, City, State 12345',
                bloodType: 'O+',
                allergies: ['Penicillin', 'Shellfish'],
                chronicConditions: [],
                emergencyContact: {
                    name: 'Jane Smith',
                    relationship: 'Spouse',
                    phone: '+1 (555) 987-6543'
                }
            },
            {
                name: 'Sarah Johnson',
                email: 'sarah.j@email.com',
                password: 'password123',
                phone: '+1 (555) 234-5678',
                dob: new Date('1988-12-03'),
                address: '456 Oak Avenue, City, State 12345',
                bloodType: 'A+',
                allergies: [],
                chronicConditions: ['Hypertension'],
                emergencyContact: {
                    name: 'Mike Johnson',
                    relationship: 'Husband',
                    phone: '+1 (555) 876-5432'
                }
            },
            {
                name: 'Michael Chen',
                email: 'mchen@email.com',
                password: 'password123',
                phone: '+1 (555) 345-6789',
                dob: new Date('1995-08-22'),
                address: '789 Pine Road, City, State 12345',
                bloodType: 'B-',
                allergies: ['Dairy'],
                chronicConditions: [],
                emergencyContact: {
                    name: 'Lisa Chen',
                    relationship: 'Sister',
                    phone: '+1 (555) 765-4321'
                }
            }
        ]);

        console.log(`${patients.length} patients created`);

        // Create sample hospitals
        const hospitals = await Hospital.insertMany([
            {
                name: 'City General Hospital',
                email: 'admin@citygeneral.com',
                password: 'password123',
                phone: '+1 (555) 111-1111',
                type: 'general',
                address: '123 Medical Center Drive, City, State 12345',
                specialties: ['Cardiology', 'Orthopedics', 'Neurology', 'Emergency Medicine', 'General Surgery'],
                totalBeds: 250,
                staffCount: 1200,
                annualPatients: 15000,
                accreditation: 'Joint Commission Accredited',
                emergencyServices: true
            },
            {
                name: 'Metro Medical Center',
                email: 'admin@metromedical.com',
                password: 'password123',
                phone: '+1 (555) 222-2222',
                type: 'specialty',
                address: '456 Healthcare Boulevard, City, State 12345',
                specialties: ['Cardiology', 'Oncology', 'Pediatrics'],
                totalBeds: 180,
                staffCount: 800,
                annualPatients: 12000,
                accreditation: 'Joint Commission Accredited',
                emergencyServices: true
            },
            {
                name: 'Regional Heart Institute',
                email: 'admin@regionalheart.com',
                password: 'password123',
                phone: '+1 (555) 333-3333',
                type: 'specialty',
                address: '789 Cardiac Way, City, State 12345',
                specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Interventional Cardiology'],
                totalBeds: 120,
                staffCount: 500,
                annualPatients: 8000,
                accreditation: 'Joint Commission Accredited',
                emergencyServices: false
            }
        ]);

        console.log(`${hospitals.length} hospitals created`);

        // Create sample blood donations
        const bloodDonations = await BloodDonation.insertMany([
            {
                donorId: patients[0]._id,
                age: 28,
                weight: 70,
                hemoglobin: 14.2,
                bloodType: 'O+',
                healthStatus: {
                    goodHealth: true,
                    noInfections: true,
                    noMedications: true,
                    noRecentSurgery: true
                },
                donationDate: new Date('2025-09-15'),
                donationCenter: 'City General Hospital',
                additionalNotes: 'Regular donor, no issues',
                status: 'approved'
            },
            {
                donorId: patients[1]._id,
                age: 32,
                weight: 65,
                hemoglobin: 13.8,
                bloodType: 'A+',
                healthStatus: {
                    goodHealth: true,
                    noInfections: true,
                    noMedications: true,
                    noRecentSurgery: true
                },
                donationDate: new Date('2025-09-20'),
                donationCenter: 'Metro Medical Center',
                additionalNotes: 'First time donor',
                status: 'approved'
            }
        ]);

        console.log(`${bloodDonations.length} blood donations created`);

        // Create sample medical services
        const medicalServices = await MedicalService.insertMany([
            {
                hospitalId: hospitals[0]._id,
                serviceName: 'Cardiac Surgery',
                category: 'cardiology',
                price: { min: 25000, max: 35000 },
                waitTime: '2-3 weeks',
                successRate: 95,
                description: 'Advanced cardiac surgical procedures including bypass surgery and valve replacement',
                rating: 4.8,
                totalRatings: 150
            },
            {
                hospitalId: hospitals[1]._id,
                serviceName: 'Cardiac Surgery',
                category: 'cardiology',
                price: { min: 20000, max: 30000 },
                waitTime: '1-2 weeks',
                successRate: 92,
                description: 'Comprehensive cardiac care with experienced cardiologists',
                rating: 4.2,
                totalRatings: 89
            },
            {
                hospitalId: hospitals[2]._id,
                serviceName: 'Cardiac Surgery',
                category: 'cardiology',
                price: { min: 30000, max: 40000 },
                waitTime: '3-4 weeks',
                successRate: 97,
                description: 'Specialized cardiac procedures with cutting-edge technology',
                rating: 4.9,
                totalRatings: 234
            }
        ]);

        console.log(`${medicalServices.length} medical services created`);

        // Create sample marketplace listings
        const marketplaceListings = await Marketplace.insertMany([
            {
                hospitalId: hospitals[0]._id,
                type: 'buying',
                itemName: 'MRI Machine',
                category: 'equipment',
                quantity: 1,
                budget: '$500,000 - $800,000',
                description: 'Looking for a new or refurbished 3T MRI machine for our radiology department',
                urgency: 'medium'
            },
            {
                hospitalId: hospitals[1]._id,
                type: 'selling',
                itemName: 'Used X-Ray Machine',
                category: 'equipment',
                quantity: 1,
                price: '$25,000 or Best Offer',
                description: 'Well-maintained X-ray machine, 5 years old, perfect for smaller clinics',
                condition: 'good'
            }
        ]);

        console.log(`${marketplaceListings.length} marketplace listings created`);

        // Create sample company aid providers
        const companyAidProviders = await CompanyAid.insertMany([
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
                    phone: '+1 (555) 123-4567',
                    website: 'www.medcarebpo.com'
                }
            },
            {
                name: 'Global Health Services',
                serviceType: 'coding',
                location: 'international',
                teamSize: '500+',
                rating: 4.5,
                responseTime: '< 4 hours',
                services: ['ICD-10 Coding', 'CPT Coding', 'Audit Support', 'Compliance Training'],
                contactInfo: {
                    email: 'info@globalhealth.com',
                    phone: '+1 (555) 234-5678',
                    website: 'www.globalhealth.com'
                }
            },
            {
                name: 'HealthTech Solutions',
                serviceType: 'transcription',
                location: 'national',
                teamSize: '200+',
                rating: 4.8,
                responseTime: '< 1 hour',
                services: ['Voice Recognition', 'Document Management', 'Quality Assurance', '24/7 Support'],
                contactInfo: {
                    email: 'support@healthtech.com',
                    phone: '+1 (555) 345-6789',
                    website: 'www.healthtech.com'
                }
            }
        ]);

        console.log(`${companyAidProviders.length} company aid providers created`);

        // Create sample inventory items
        const inventoryItems = await Inventory.insertMany([
            {
                hospitalId: hospitals[0]._id,
                itemName: 'Surgical Masks',
                category: 'PPE',
                quantity: 500,
                unitPrice: 0.50,
                totalValue: 250.00,
                status: 'in-stock',
                reorderPoint: 100,
                supplier: 'MedSupply Co.'
            },
            {
                hospitalId: hospitals[0]._id,
                itemName: 'IV Bags',
                category: 'Supplies',
                quantity: 15,
                unitPrice: 2.00,
                totalValue: 30.00,
                status: 'low-stock',
                reorderPoint: 20,
                supplier: 'IV Solutions Inc.'
            },
            {
                hospitalId: hospitals[0]._id,
                itemName: 'Antibiotics',
                category: 'Medications',
                quantity: 0,
                unitPrice: 15.00,
                totalValue: 0.00,
                status: 'out-of-stock',
                reorderPoint: 50,
                supplier: 'PharmaCorp'
            }
        ]);

        console.log(`${inventoryItems.length} inventory items created`);

        // Create sample appointments
        const appointments = await Appointment.insertMany([
            {
                patientId: patients[0]._id,
                hospitalId: hospitals[0]._id,
                doctorName: 'Dr. Sarah Johnson',
                specialty: 'Cardiology',
                appointmentDate: new Date('2025-09-15'),
                appointmentTime: '2:00 PM',
                type: 'consultation',
                status: 'confirmed',
                notes: 'Follow-up appointment for cardiac evaluation'
            },
            {
                patientId: patients[1]._id,
                hospitalId: hospitals[1]._id,
                doctorName: 'Dr. Michael Chen',
                specialty: 'Orthopedics',
                appointmentDate: new Date('2025-09-20'),
                appointmentTime: '10:30 AM',
                type: 'follow-up',
                status: 'pending',
                notes: 'Post-surgery follow-up'
            }
        ]);

        console.log(`${appointments.length} appointments created`);

        console.log('Database seeding completed successfully!');
        console.log('\nSample data created:');
        console.log(`- ${patients.length} patients`);
        console.log(`- ${hospitals.length} hospitals`);
        console.log(`- ${bloodDonations.length} blood donations`);
        console.log(`- ${medicalServices.length} medical services`);
        console.log(`- ${marketplaceListings.length} marketplace listings`);
        console.log(`- ${companyAidProviders.length} company aid providers`);
        console.log(`- ${inventoryItems.length} inventory items`);
        console.log(`- ${appointments.length} appointments`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedDatabase();


