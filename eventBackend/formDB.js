const mongoose = require('mongoose');
//saving user information to the database 
const formSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    event: String,
    guestSize: Number,
    budget: String,
    briefDescription: String,
    accessCode: String,
    codeExpixing: Date,
    status: {
        type: String,
        enum: ['waiting', 'approved', 'rejected', 'booked'],
        default: 'waiting'
    },
    booking: {
        date: Date,
        timeSlot: String,
        zoomLink: String
    },
    emailDrafts: [{
        type: {
            type: String,
            enum: ['accepted', 'rejected'],
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        requiresReview: {
            type: Boolean,
            default: true
        },
        sent: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.models.ConsultationForm || mongoose.model('ConsultationForm', formSchema);