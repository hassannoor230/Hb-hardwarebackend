const mongoose = require('mongoose')
const Product = require('./src/models/Product')
const Service = require('./src/models/Service')
require('dotenv').config()

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not configured in .env')
      process.exit(1)
    }

    console.log('Using MongoDB URI:', process.env.MONGODB_URI ? `${process.env.MONGODB_URI.slice(0, 40)}...` : 'missing')
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4,
    })
    console.log('Connected to MongoDB')

    const products = [
      {
        name: 'Premium Door Hinges',
        category: 'Door Hardware',
        price: 1200,
        currency: 'PKR',
        images: ['/images/door-hardware.jpg'],
        description: 'Heavy-duty stainless steel door hinges designed for durability and smooth operation. Suitable for residential and commercial doors.',
        features: ['Stainless steel construction', 'Anti-rust coating', 'Quiet closing mechanism', 'Load capacity up to 40kg'],
        status: 'approved',
        source: 'manual',
        confidence: 1
      },
      {
        name: 'Cabinet Handles Set',
        category: 'Cabinet Hardware',
        price: 2500,
        currency: 'PKR',
        images: ['/images/cabinet-hardware.jpg'],
        description: 'Elegant cabinet handle set with modern design. Perfect for kitchen cabinets, wardrobes, and bathroom vanities.',
        features: ['Modern minimalist design', 'Zinc alloy construction', 'Easy installation', 'Set of 6 handles'],
        status: 'approved',
        source: 'manual',
        confidence: 1
      },
      {
        name: 'Bathroom Faucet',
        category: 'Bathroom Hardware',
        price: 4500,
        currency: 'PKR',
        images: ['/images/bathroom-hardware.jpg'],
        description: 'Premium single-handle bathroom faucet with ceramic disc valve for leak-free operation.',
        features: ['Ceramic disc valve', 'Water-saving aerator', 'Easy installation', '5-year warranty'],
        status: 'approved',
        source: 'manual',
        confidence: 1
      },
      {
        name: 'Kitchen Cabinet Pulls',
        category: 'Kitchen Hardware',
        price: 3200,
        currency: 'PKR',
        images: ['/images/kitchen-hardware.jpg'],
        description: 'Stylish kitchen cabinet pulls that add a contemporary touch to your kitchen.',
        features: ['Contemporary design', 'Solid brass construction', 'Fade-resistant finish', 'Set of 8 pulls'],
        status: 'approved',
        source: 'manual',
        confidence: 1
      },
      {
        name: 'Construction Grade Steel',
        category: 'Construction Hardware',
        price: 8500,
        currency: 'PKR',
        images: ['/images/construction-hardware.jpg'],
        description: 'High-grade construction steel bars for reinforced concrete structures.',
        features: ['High tensile strength', 'ISO certified', 'Corrosion resistant', 'Available in multiple sizes'],
        status: 'approved',
        source: 'manual',
        confidence: 1
      },
      {
        name: 'Heavy Duty Drill Machine',
        category: 'Tools & Equipment',
        price: 12000,
        currency: 'PKR',
        images: ['/images/hardware-shelves.jpg'],
        description: 'Professional-grade heavy duty drill machine for construction and industrial use.',
        features: ['2000W powerful motor', 'Variable speed control', 'Ergonomic grip', '1-year warranty'],
        status: 'approved',
        source: 'manual',
        confidence: 1
      }
    ]

    const services = [
      {
        name: 'Hardware Consultation',
        category: 'Consultation',
        description: 'Expert advice on hardware selection for your construction or renovation project.',
        price: null,
        currency: 'PKR',
        status: 'approved',
        source: 'manual',
        confidence: 1
      },
      {
        name: 'Delivery Service',
        category: 'Logistics',
        description: 'Fast and reliable delivery of hardware products across Gujranwala and surrounding areas.',
        price: null,
        currency: 'PKR',
        status: 'approved',
        source: 'manual',
        confidence: 1
      },
      {
        name: 'Bulk Orders',
        category: 'Sales',
        description: 'Competitive wholesale pricing for bulk orders. Contact us for volume discounts.',
        price: null,
        currency: 'PKR',
        status: 'approved',
        source: 'manual',
        confidence: 1
      }
    ]

    const normalizeSlug = (name) =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

    products.forEach((product) => {
      if (!product.slug && product.name) {
        product.slug = normalizeSlug(product.name)
      }
    })

    services.forEach((service) => {
      if (!service.slug && service.name) {
        service.slug = normalizeSlug(service.name)
      }
    })

    await Product.deleteMany({})
    await Service.deleteMany({})

    await Product.insertMany(products)
    console.log(`Seeded ${products.length} products`)

    await Service.insertMany(services)
    console.log(`Seeded ${services.length} services`)

    console.log('Seed completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

seedData()
