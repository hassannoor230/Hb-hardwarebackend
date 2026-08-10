const mongoose = require('mongoose')

const siteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'HB Hardware'
  },
  siteDescription: {
    type: String,
    default: 'Premium Hardware Store in Gujranwala'
  },
  phone: {
    type: String,
    default: '+92 300 1234567'
  },
  phoneSecondary: {
    type: String
  },
  email: {
    type: String,
    default: 'info@hbhardware.com'
  },
  emailSecondary: {
    type: String
  },
  address: {
    street: {
      type: String,
      default: 'Deen Market'
    },
    area: {
      type: String,
      default: 'Krishan Nagar'
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
    }
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
  seo: {
    metaTitle: {
      type: String,
      default: 'HB Hardware - Premium Hardware Store in Gujranwala'
    },
    metaDescription: {
      type: String,
      default: 'Quality hardware products in Gujranwala. Construction materials, door hardware, cabinet hardware, and more.'
    },
    keywords: {
      type: [String],
      default: ['hardware', 'construction', 'tools', 'Gujranwala', 'Pakistan']
    },
    ogImage: {
      type: String
    }
  },
  analytics: {
    googleAnalytics: {
      type: String
    },
    facebookPixel: {
      type: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Ensure only one settings document exists
siteSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne()
  if (!settings) {
    settings = await this.create({})
  }
  return settings
}

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema)

module.exports = SiteSettings