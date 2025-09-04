const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://<username>:<password>@cluster0.lpr7kqb.mongodb.net/hospital_patient_db?retryWrites=true&w=majority&appName=Cluster0';

// Hospital Schema (simplified for seeding)
const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    type: { type: String },
    address: { type: String },
    specialties: [String],
    services: [String],
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    totalBeds: { type: Number },
    staffCount: { type: Number },
    annualPatients: { type: Number },
    accreditation: { type: String },
    emergencyServices: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Doctor Schema
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    specialty: { type: String, required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    qualification: { type: String },
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

const Hospital = mongoose.model('Hospital', hospitalSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);

// Sample doctors data
const sampleDoctors = [
    // Regional Heart Center - Cardiology Specialists (6 doctors)
    {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@regionalheart.com",
        phone: "+1-555-0101",
        specialty: "Cardiology",
        qualification: "MD, FACC, Cardiologist",
        availability: {
            monday: [{ start: "09:00", end: "17:00" }],
            tuesday: [{ start: "09:00", end: "17:00" }],
            wednesday: [{ start: "09:00", end: "17:00" }],
            thursday: [{ start: "09:00", end: "17:00" }],
            friday: [{ start: "09:00", end: "17:00" }],
            saturday: [{ start: "09:00", end: "13:00" }],
            sunday: []
        }
    },
    {
        name: "Dr. Michael Chen",
        email: "michael.chen@regionalheart.com",
        phone: "+1-555-0102",
        specialty: "Cardiology",
        qualification: "MD, Cardiologist",
        availability: {
            monday: [{ start: "08:00", end: "16:00" }],
            tuesday: [{ start: "08:00", end: "16:00" }],
            wednesday: [{ start: "08:00", end: "16:00" }],
            thursday: [{ start: "08:00", end: "16:00" }],
            friday: [{ start: "08:00", end: "16:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Jennifer Lee",
        email: "jennifer.lee@regionalheart.com",
        phone: "+1-555-0103",
        specialty: "Cardiology",
        qualification: "MD, FACS, Cardiologist",
        availability: {
            monday: [{ start: "07:00", end: "15:00" }],
            tuesday: [{ start: "07:00", end: "15:00" }],
            wednesday: [{ start: "07:00", end: "15:00" }],
            thursday: [{ start: "07:00", end: "15:00" }],
            friday: [{ start: "07:00", end: "15:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Robert Martinez",
        email: "robert.martinez@regionalheart.com",
        phone: "+1-555-0104",
        specialty: "Cardiology",
        qualification: "MD, Interventional Cardiologist",
        availability: {
            monday: [{ start: "08:00", end: "18:00" }],
            tuesday: [{ start: "08:00", end: "18:00" }],
            wednesday: [{ start: "08:00", end: "18:00" }],
            thursday: [{ start: "08:00", end: "18:00" }],
            friday: [{ start: "08:00", end: "18:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Lisa Wang",
        email: "lisa.wang@regionalheart.com",
        phone: "+1-555-0105",
        specialty: "Cardiology",
        qualification: "MD, Cardiologist",
        availability: {
            monday: [{ start: "09:00", end: "17:00" }],
            tuesday: [{ start: "09:00", end: "17:00" }],
            wednesday: [{ start: "09:00", end: "17:00" }],
            thursday: [{ start: "09:00", end: "17:00" }],
            friday: [{ start: "09:00", end: "17:00" }],
            saturday: [{ start: "09:00", end: "13:00" }],
            sunday: []
        }
    },
    {
        name: "Dr. Thomas Brown",
        email: "thomas.brown@regionalheart.com",
        phone: "+1-555-0106",
        specialty: "Cardiology",
        qualification: "MD, Cardiologist",
        availability: {
            monday: [{ start: "08:00", end: "16:00" }],
            tuesday: [{ start: "08:00", end: "16:00" }],
            wednesday: [{ start: "08:00", end: "16:00" }],
            thursday: [{ start: "08:00", end: "16:00" }],
            friday: [{ start: "08:00", end: "16:00" }],
            saturday: [],
            sunday: []
        }
    },

    // Metro Medical Center - Multiple Specialties (6 doctors)
    {
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@metromedical.com",
        phone: "+1-555-0201",
        specialty: "Oncology",
        qualification: "MD, PhD, Oncologist",
        availability: {
            monday: [{ start: "09:00", end: "18:00" }],
            tuesday: [{ start: "09:00", end: "18:00" }],
            wednesday: [{ start: "09:00", end: "18:00" }],
            thursday: [{ start: "09:00", end: "18:00" }],
            friday: [{ start: "09:00", end: "18:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. David Kim",
        email: "david.kim@metromedical.com",
        phone: "+1-555-0202",
        specialty: "Pediatrics",
        qualification: "MD, Pediatrician",
        availability: {
            monday: [{ start: "08:00", end: "17:00" }],
            tuesday: [{ start: "08:00", end: "17:00" }],
            wednesday: [{ start: "08:00", end: "17:00" }],
            thursday: [{ start: "08:00", end: "17:00" }],
            friday: [{ start: "08:00", end: "17:00" }],
            saturday: [{ start: "09:00", end: "14:00" }],
            sunday: []
        }
    },
    {
        name: "Dr. Amanda Davis",
        email: "amanda.davis@metromedical.com",
        phone: "+1-555-0203",
        specialty: "Radiology",
        qualification: "MD, Radiologist",
        availability: {
            monday: [{ start: "07:00", end: "19:00" }],
            tuesday: [{ start: "07:00", end: "19:00" }],
            wednesday: [{ start: "07:00", end: "19:00" }],
            thursday: [{ start: "07:00", end: "19:00" }],
            friday: [{ start: "07:00", end: "19:00" }],
            saturday: [{ start: "08:00", end: "16:00" }],
            sunday: [{ start: "08:00", end: "16:00" }]
        }
    },
    {
        name: "Dr. Christopher Taylor",
        email: "christopher.taylor@metromedical.com",
        phone: "+1-555-0204",
        specialty: "General Medicine",
        qualification: "MD, Internal Medicine",
        availability: {
            monday: [{ start: "08:00", end: "17:00" }],
            tuesday: [{ start: "08:00", end: "17:00" }],
            wednesday: [{ start: "08:00", end: "17:00" }],
            thursday: [{ start: "08:00", end: "17:00" }],
            friday: [{ start: "08:00", end: "17:00" }],
            saturday: [{ start: "09:00", end: "13:00" }],
            sunday: []
        }
    },
    {
        name: "Dr. Rachel Green",
        email: "rachel.green@metromedical.com",
        phone: "+1-555-0205",
        specialty: "Gynecology",
        qualification: "MD, OB/GYN",
        availability: {
            monday: [{ start: "08:00", end: "18:00" }],
            tuesday: [{ start: "08:00", end: "18:00" }],
            wednesday: [{ start: "08:00", end: "18:00" }],
            thursday: [{ start: "08:00", end: "18:00" }],
            friday: [{ start: "08:00", end: "18:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Steven White",
        email: "steven.white@metromedical.com",
        phone: "+1-555-0206",
        specialty: "Psychiatry",
        qualification: "MD, Psychiatrist",
        availability: {
            monday: [{ start: "09:00", end: "17:00" }],
            tuesday: [{ start: "09:00", end: "17:00" }],
            wednesday: [{ start: "09:00", end: "17:00" }],
            thursday: [{ start: "09:00", end: "17:00" }],
            friday: [{ start: "09:00", end: "17:00" }],
            saturday: [{ start: "10:00", end: "15:00" }],
            sunday: []
        }
    },

    // City General Hospital - General Medicine (6 doctors)
    {
        name: "Dr. Lisa Thompson",
        email: "lisa.thompson@citygeneral.com",
        phone: "+1-555-0301",
        specialty: "General Medicine",
        qualification: "MD, Family Medicine",
        availability: {
            monday: [{ start: "07:00", end: "19:00" }],
            tuesday: [{ start: "07:00", end: "19:00" }],
            wednesday: [{ start: "07:00", end: "19:00" }],
            thursday: [{ start: "07:00", end: "19:00" }],
            friday: [{ start: "07:00", end: "19:00" }],
            saturday: [{ start: "08:00", end: "16:00" }],
            sunday: [{ start: "09:00", end: "15:00" }]
        }
    },
    {
        name: "Dr. Robert Wilson",
        email: "robert.wilson@citygeneral.com",
        phone: "+1-555-0302",
        specialty: "Emergency Medicine",
        qualification: "MD, Emergency Medicine",
        availability: {
            monday: [{ start: "06:00", end: "18:00" }],
            tuesday: [{ start: "18:00", end: "06:00" }],
            wednesday: [{ start: "06:00", end: "18:00" }],
            thursday: [{ start: "18:00", end: "06:00" }],
            friday: [{ start: "06:00", end: "18:00" }],
            saturday: [{ start: "18:00", end: "06:00" }],
            sunday: [{ start: "18:00", end: "06:00" }]
        }
    },
    {
        name: "Dr. Michelle Johnson",
        email: "michelle.johnson@citygeneral.com",
        phone: "+1-555-0303",
        specialty: "General Medicine",
        qualification: "MD, Family Medicine",
        availability: {
            monday: [{ start: "08:00", end: "16:00" }],
            tuesday: [{ start: "08:00", end: "16:00" }],
            wednesday: [{ start: "08:00", end: "16:00" }],
            thursday: [{ start: "08:00", end: "16:00" }],
            friday: [{ start: "08:00", end: "16:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Daniel Clark",
        email: "daniel.clark@citygeneral.com",
        phone: "+1-555-0304",
        specialty: "General Medicine",
        qualification: "MD, Internal Medicine",
        availability: {
            monday: [{ start: "09:00", end: "17:00" }],
            tuesday: [{ start: "09:00", end: "17:00" }],
            wednesday: [{ start: "09:00", end: "17:00" }],
            thursday: [{ start: "09:00", end: "17:00" }],
            friday: [{ start: "09:00", end: "17:00" }],
            saturday: [{ start: "09:00", end: "13:00" }],
            sunday: []
        }
    },
    {
        name: "Dr. Sarah Miller",
        email: "sarah.miller@citygeneral.com",
        phone: "+1-555-0305",
        specialty: "General Medicine",
        qualification: "MD, Family Medicine",
        availability: {
            monday: [{ start: "08:00", end: "16:00" }],
            tuesday: [{ start: "08:00", end: "16:00" }],
            wednesday: [{ start: "08:00", end: "16:00" }],
            thursday: [{ start: "08:00", end: "16:00" }],
            friday: [{ start: "08:00", end: "16:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Kevin Adams",
        email: "kevin.adams@citygeneral.com",
        phone: "+1-555-0306",
        specialty: "Emergency Medicine",
        qualification: "MD, Emergency Medicine",
        availability: {
            monday: [{ start: "18:00", end: "06:00" }],
            tuesday: [{ start: "06:00", end: "18:00" }],
            wednesday: [{ start: "18:00", end: "06:00" }],
            thursday: [{ start: "06:00", end: "18:00" }],
            friday: [{ start: "18:00", end: "06:00" }],
            saturday: [{ start: "06:00", end: "18:00" }],
            sunday: [{ start: "06:00", end: "18:00" }]
        }
    },

    // MGM1 - Orthopedics and Surgery (6 doctors)
    {
        name: "Dr. James Anderson",
        email: "james.anderson@mgm1.com",
        phone: "+1-555-0401",
        specialty: "Orthopedics",
        qualification: "MD, Orthopedic Surgeon",
        availability: {
            monday: [{ start: "08:00", end: "16:00" }],
            tuesday: [{ start: "08:00", end: "16:00" }],
            wednesday: [{ start: "08:00", end: "16:00" }],
            thursday: [{ start: "08:00", end: "16:00" }],
            friday: [{ start: "08:00", end: "16:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Maria Garcia",
        email: "maria.garcia@mgm1.com",
        phone: "+1-555-0402",
        specialty: "Surgery",
        qualification: "MD, General Surgeon",
        availability: {
            monday: [{ start: "07:00", end: "17:00" }],
            tuesday: [{ start: "07:00", end: "17:00" }],
            wednesday: [{ start: "07:00", end: "17:00" }],
            thursday: [{ start: "07:00", end: "17:00" }],
            friday: [{ start: "07:00", end: "17:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Richard Thompson",
        email: "richard.thompson@mgm1.com",
        phone: "+1-555-0403",
        specialty: "Surgery",
        qualification: "MD, Neurosurgeon",
        availability: {
            monday: [{ start: "07:00", end: "15:00" }],
            tuesday: [{ start: "07:00", end: "15:00" }],
            wednesday: [{ start: "07:00", end: "15:00" }],
            thursday: [{ start: "07:00", end: "15:00" }],
            friday: [{ start: "07:00", end: "15:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Jennifer Lewis",
        email: "jennifer.lewis@mgm1.com",
        phone: "+1-555-0404",
        specialty: "Surgery",
        qualification: "MD, Plastic Surgeon",
        availability: {
            monday: [{ start: "09:00", end: "17:00" }],
            tuesday: [{ start: "09:00", end: "17:00" }],
            wednesday: [{ start: "09:00", end: "17:00" }],
            thursday: [{ start: "09:00", end: "17:00" }],
            friday: [{ start: "09:00", end: "17:00" }],
            saturday: [{ start: "09:00", end: "13:00" }],
            sunday: []
        }
    },
    {
        name: "Dr. Michael Davis",
        email: "michael.davis@mgm1.com",
        phone: "+1-555-0405",
        specialty: "Urology",
        qualification: "MD, Urologist",
        availability: {
            monday: [{ start: "08:00", end: "16:00" }],
            tuesday: [{ start: "08:00", end: "16:00" }],
            wednesday: [{ start: "08:00", end: "16:00" }],
            thursday: [{ start: "08:00", end: "16:00" }],
            friday: [{ start: "08:00", end: "16:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Patricia Moore",
        email: "patricia.moore@mgm1.com",
        phone: "+1-555-0406",
        specialty: "Surgery",
        qualification: "MD, Vascular Surgeon",
        availability: {
            monday: [{ start: "07:00", end: "17:00" }],
            tuesday: [{ start: "07:00", end: "17:00" }],
            wednesday: [{ start: "07:00", end: "17:00" }],
            thursday: [{ start: "07:00", end: "17:00" }],
            friday: [{ start: "07:00", end: "17:00" }],
            saturday: [],
            sunday: []
        }
    },

    // MGM Gold - Dermatology and Neurology (6 doctors)
    {
        name: "Dr. Amanda Foster",
        email: "amanda.foster@mgmgold.com",
        phone: "+1-555-0501",
        specialty: "Dermatology",
        qualification: "MD, Dermatologist",
        availability: {
            monday: [{ start: "09:00", end: "17:00" }],
            tuesday: [{ start: "09:00", end: "17:00" }],
            wednesday: [{ start: "09:00", end: "17:00" }],
            thursday: [{ start: "09:00", end: "17:00" }],
            friday: [{ start: "09:00", end: "17:00" }],
            saturday: [{ start: "09:00", end: "14:00" }],
            sunday: []
        }
    },
    {
        name: "Dr. Kevin Patel",
        email: "kevin.patel@mgmgold.com",
        phone: "+1-555-0502",
        specialty: "Neurology",
        qualification: "MD, Neurologist",
        availability: {
            monday: [{ start: "08:00", end: "16:00" }],
            tuesday: [{ start: "08:00", end: "16:00" }],
            wednesday: [{ start: "08:00", end: "16:00" }],
            thursday: [{ start: "08:00", end: "16:00" }],
            friday: [{ start: "08:00", end: "16:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Stephanie Wright",
        email: "stephanie.wright@mgmgold.com",
        phone: "+1-555-0503",
        specialty: "Dermatology",
        qualification: "MD, Dermatologist",
        availability: {
            monday: [{ start: "08:00", end: "17:00" }],
            tuesday: [{ start: "08:00", end: "17:00" }],
            wednesday: [{ start: "08:00", end: "17:00" }],
            thursday: [{ start: "08:00", end: "17:00" }],
            friday: [{ start: "08:00", end: "17:00" }],
            saturday: [{ start: "09:00", end: "13:00" }],
            sunday: []
        }
    },
    {
        name: "Dr. Andrew Jackson",
        email: "andrew.jackson@mgmgold.com",
        phone: "+1-555-0504",
        specialty: "Neurology",
        qualification: "MD, Neurologist",
        availability: {
            monday: [{ start: "09:00", end: "17:00" }],
            tuesday: [{ start: "09:00", end: "17:00" }],
            wednesday: [{ start: "09:00", end: "17:00" }],
            thursday: [{ start: "09:00", end: "17:00" }],
            friday: [{ start: "09:00", end: "17:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Nicole Taylor",
        email: "nicole.taylor@mgmgold.com",
        phone: "+1-555-0505",
        specialty: "Dermatology",
        qualification: "MD, Dermatologist",
        availability: {
            monday: [{ start: "08:00", end: "16:00" }],
            tuesday: [{ start: "08:00", end: "16:00" }],
            wednesday: [{ start: "08:00", end: "16:00" }],
            thursday: [{ start: "08:00", end: "16:00" }],
            friday: [{ start: "08:00", end: "16:00" }],
            saturday: [],
            sunday: []
        }
    },
    {
        name: "Dr. Brian Wilson",
        email: "brian.wilson@mgmgold.com",
        phone: "+1-555-0506",
        specialty: "Neurology",
        qualification: "MD, Neurologist",
        availability: {
            monday: [{ start: "09:00", end: "17:00" }],
            tuesday: [{ start: "09:00", end: "17:00" }],
            wednesday: [{ start: "09:00", end: "17:00" }],
            thursday: [{ start: "09:00", end: "17:00" }],
            friday: [{ start: "09:00", end: "17:00" }],
            saturday: [{ start: "09:00", end: "13:00" }],
            sunday: []
        }
    }
];

// Function to seed doctors
async function seedDoctors() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Clear existing doctors
        await Doctor.deleteMany({});
        console.log('🗑️ Cleared existing doctors');

        // Get hospital IDs from the database
        const hospitals = await Hospital.find({}).select('_id name');
        
        if (hospitals.length === 0) {
            console.log('❌ No hospitals found in database. Please seed hospitals first.');
            return;
        }

        console.log('🏥 Found hospitals:', hospitals.map(h => h.name).join(', '));

        // Map hospital names to IDs for doctor assignment
        const hospitalMap = {};
        hospitals.forEach(hospital => {
            if (hospital.name.includes('Regional Heart Center')) {
                hospitalMap['Regional Heart Center'] = hospital._id;
            } else if (hospital.name.includes('Metro Medical Center')) {
                hospitalMap['Metro Medical Center'] = hospital._id;
            } else if (hospital.name.includes('City General Hospital')) {
                hospitalMap['City General Hospital'] = hospital._id;
            } else if (hospital.name.includes('MGM1')) {
                hospitalMap['MGM1'] = hospital._id;
            } else if (hospital.name.includes('MGM gold')) {
                hospitalMap['MGM gold'] = hospital._id;
            }
        });

        // Assign hospital IDs to doctors
        const doctorsWithHospitalIds = sampleDoctors.map(doctor => {
            let hospitalId = null;
            
            // Determine hospital based on email domain
            if (doctor.email.includes('regionalheart.com')) {
                hospitalId = hospitalMap['Regional Heart Center'];
            } else if (doctor.email.includes('metromedical.com')) {
                hospitalId = hospitalMap['Metro Medical Center'];
            } else if (doctor.email.includes('citygeneral.com')) {
                hospitalId = hospitalMap['City General Hospital'];
            } else if (doctor.email.includes('mgm1.com')) {
                hospitalId = hospitalMap['MGM1'];
            } else if (doctor.email.includes('mgmgold.com')) {
                hospitalId = hospitalMap['MGM gold'];
            }

            if (!hospitalId) {
                console.log(`⚠️ Warning: Could not find hospital for ${doctor.name}`);
                // Assign to first available hospital as fallback
                hospitalId = hospitals[0]._id;
            }

            return {
                ...doctor,
                hospitalId: hospitalId
            };
        });

        // Insert doctors
        const insertedDoctors = await Doctor.insertMany(doctorsWithHospitalIds);
        console.log(`✅ Successfully seeded ${insertedDoctors.length} doctors`);

        // Display summary
        console.log('\n📊 Doctor Seeding Summary:');
        console.log('========================');
        
        const specialtyCount = {};
        const hospitalCount = {};
        
        insertedDoctors.forEach(doctor => {
            // Count by specialty
            specialtyCount[doctor.specialty] = (specialtyCount[doctor.specialty] || 0) + 1;
            
            // Count by hospital
            const hospital = hospitals.find(h => h._id.toString() === doctor.hospitalId.toString());
            if (hospital) {
                hospitalCount[hospital.name] = (hospitalCount[hospital.name] || 0) + 1;
            }
        });

        console.log('\n🏥 Doctors by Hospital:');
        Object.entries(hospitalCount).forEach(([hospital, count]) => {
            console.log(`   ${hospital}: ${count} doctors`);
        });

        console.log('\n👨‍⚕️ Doctors by Specialty:');
        Object.entries(specialtyCount).forEach(([specialty, count]) => {
            console.log(`   ${specialty}: ${count} doctors`);
        });

        console.log('\n🎯 Sample doctors created:');
        insertedDoctors.forEach(doctor => {
            const hospital = hospitals.find(h => h._id.toString() === doctor.hospitalId.toString());
            console.log(`   ${doctor.name} - ${doctor.specialty} at ${hospital ? hospital.name : 'Unknown Hospital'}`);
        });

    } catch (error) {
        console.error('❌ Error seeding doctors:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the seeding function
seedDoctors();
