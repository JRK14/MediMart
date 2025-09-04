const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB Atlas...');

// Connect to MongoDB Atlas with increased timeouts
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.lpr7kqb.mongodb.net/hospital_patient_db?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
})
.then(() => {
    console.log('MongoDB Atlas connected successfully!');
    
    // Create a simple schema and model
    const testSchema = new mongoose.Schema({
        name: String,
        date: { type: Date, default: Date.now }
    });
    
    const Test = mongoose.model('Test', testSchema);
    
    // Create a test document
    return Test.create({ name: 'Connection Test' })
        .then(doc => {
            console.log('Test document created successfully:');
            console.log(doc);
            return mongoose.connection.close();
        })
        .then(() => {
            console.log('Connection closed.');
            process.exit(0);
        });
})
.catch(err => {
    console.error('MongoDB Atlas connection error:', err);
    process.exit(1);
});


