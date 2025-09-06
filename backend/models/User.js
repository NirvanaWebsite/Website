const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    index: true,
    default: function() {
      return `user_${this.clerkId}@nirvanaclub.com`;
    }
  },
  firstName: {
    type: String,
    required: true,
    default: 'User'
  },
  lastName: {
    type: String,
    required: true,
    default: 'Member'
  },
  profileImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes are now defined in the schema above

module.exports = mongoose.model('User', userSchema);
