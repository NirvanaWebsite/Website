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
    default: function () {
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
  },

  // Updated: New 5-tier role system
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'LEAD', 'CO_LEAD', 'DOMAIN_LEAD', 'MEMBER', 'USER'],
    default: 'USER'
  },

  // Role level for easy comparison (0-5)
  roleLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  // Link to Member if they are part of the team
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    default: null
  },

  // Track if email is from IIITS
  isIIITSEmail: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save middleware to set roleLevel and isIIITSEmail
userSchema.pre('save', function (next) {
  // Set role level based on role
  const roleLevels = {
    'SUPER_ADMIN': 5,
    'LEAD': 4,
    'CO_LEAD': 3,
    'DOMAIN_LEAD': 2,
    'MEMBER': 1,
    'USER': 0
  };
  this.roleLevel = roleLevels[this.role] || 0;

  // Check if email is from IIITS
  if (this.email) {
    this.isIIITSEmail = this.email.toLowerCase().endsWith('@iiits.in');
  }

  next();
});

// Indexes are now defined in the schema above

module.exports = mongoose.model('User', userSchema);
