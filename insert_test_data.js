const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.lpr7kqb.mongodb.net/hospital_patient_db?retryWrites=true&w=majority&appName=Cluster0', {
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
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const hospitalSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create models
const Patient = mongoose.model('Patient', patientSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);

// Insert test data
async function insertTestData() {
    try {
        // Create a test patient
        const testPatient = new Patient({
            email: 'patient@example.com',
            password: 'password123'
        });
        
        await testPatient.save();
        console.log('Test patient created successfully');
        
        // Create a test hospital
        const testHospital = new Hospital({
            email: 'hospital@example.com',
            password: 'password123'
        });
        
        await testHospital.save();
        console.log('Test hospital created successfully');
        
        // Close connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error inserting test data:', error);
        await mongoose.connection.close();
    }
}

// Run the function
insertTestData();


