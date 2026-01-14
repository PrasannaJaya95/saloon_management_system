
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['SuperAdmin', 'Admin', 'Manager', 'Staff', 'User'], default: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beautec_db')
    .then(async () => {
        console.log('Connected to DB');
        const users = await User.find({});
        console.log('Users found:', users.length);
        console.log(users);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
