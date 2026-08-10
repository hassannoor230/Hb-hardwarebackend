const mongoose = require('mongoose')

const businessInfoSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    default: 'HB Hardware'
  },
  businessType: {
    type: String,
    default: 'Retail & Wholesale Hardware Store'
  },
  description: {
    type: String,
    trim: true,
    default: 'Your trusted hardware partner in Gujranwala. Quality products, expert advice, and exceptional service.'
  },
  establishedYear: {
    type: Number,
    default: 2014
  },
  phone: {
    type: String,
    required: true,
    default: '+92 300 1234567'
  },
  phoneSecondary: {
    type: String
  },
  email: {
    type: String,
    required: true,
    default: 'info@hbhardware.com'
  },
  emailSecondary: {
    type: String
  },
  address: {
    type: String,
    required: true,
    default: 'Deen Market, Krishan Nagar, Gujranwala'
  },
  city: {
    type: String,
    default: 'Gujranwala'
  },
  state: {
    type: String,
    default: 'Punjab'
  },
  country: {
    type: String,
    default: 'Pakistan'
  },
  postalCode: {
    type: String
  },
  coordinates: {
    lat: {
      type: String,
      default: '32.1590'
    },
    lng: {
      type: String,
      default: '74.1834'
    }
  },
  businessHours: {
    monday_friday: {
      type: String,
      default: '9:00 AM - 8:00 PM'
    },
    saturday: {
      type: String,
      default: '10:00 AM - 6:00 PM'
    },
    sunday: {
      type: String,
      default: 'Closed'
    }
  },
  socialMedia: {
    facebook: {
      type: String,
      default: '#'
    },
    instagram: {
      type: String,
      default: '#'
    },
    youtube: {
      type: String,
      default: '#'
    },
    twitter: {
      type: String,
      default: '#'
    },
    whatsapp: {
      type: String,
      default: 'https://wa.me/923001234567'
    }
  },
  logo: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Ensure only one business info document exists
businessInfoSchema.statics.getBusinessInfo = async function() {
  let info = await this.findOne()
  if (!info) {
    info = await this.create({})
  }
  return info
}

const BusinessInfo = mongoose.model('BusinessInfo', businessInfoSchema)

module.exports = BusinessInfo