const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.lpr7kqb.mongodb.net/retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected successfully'))
.catch(err => {
    console.error('MongoDB Atlas connection error:', err);
    process.exit(1);
});

// Define schemas
const patientSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const hospitalSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create models
const Patient = mongoose.model('Patient', patientSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);

// Create test data
async function createTestData() {
    try {
        // Create a test patient
        const testPatient = new Patient({
            email: 'testpatient@example.com',
            password: 'testpassword123'
        });
        
        await testPatient.save();
        console.log('Test patient created successfully');
        
        // Create a test hospital
        const testHospital = new Hospital({
            email: 'testhospital@example.com',
            password: 'testpassword123'
        });
        
        await testHospital.save();
        console.log('Test hospital created successfully');
    } catch (error) {
        if (error.code === 11000) {
            console.log('Test data already exists, skipping creation');
        } else {
            console.error('Error creating test data:', error);
        }
    }
}

// View all data
async function viewAllData() {
    try {
        // Get all patients
        const patients = await Patient.find({});
        console.log('\n--- PATIENTS ---');
        if (patients.length === 0) {
            console.log('No patients found');
        } else {
            patients.forEach(patient => {
                console.log(`Email: ${patient.email}`);
                console.log(`Password: ${patient.password}`);
                console.log(`Created: ${patient.createdAt}`);
                console.log('-------------------');
            });
        }
        
        // Get all hospitals
        const hospitals = await Hospital.find({});
        console.log('\n--- HOSPITALS ---');
        if (hospitals.length === 0) {
            console.log('No hospitals found');
        } else {
            hospitals.forEach(hospital => {
                console.log(`Email: ${hospital.email}`);
                console.log(`Password: ${hospital.password}`);
                console.log(`Created: ${hospital.createdAt}`);
                console.log('-------------------');
            });
        }
    } catch (error) {
        console.error('Error viewing data:', error);
    } finally {
        // Close the connection
        mongoose.connection.close();
        console.log('\nMongoDB connection closed');
    }
}

// Run the functions
async function run() {
    await createTestData();
    await viewAllData();
}

run();
