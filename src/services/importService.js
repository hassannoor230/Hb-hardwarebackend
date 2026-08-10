const Product = require('../models/Product')
const Service = require('../models/Service')
const ImportJob = require('../models/ImportJob')

const extractEntitiesFromAI = async (prompt, systemPrompt) => {
  const apiKey = process.env.AI_API_KEY
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase()

  if (!apiKey || apiKey.includes('your-') || apiKey.includes('changeme')) {
    throw new Error('AI_API_KEY is not configured. Please add a valid API key in server .env')
  }

  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      })
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`AI provider error ${response.status}: ${text}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) throw new Error('AI provider returned empty content')

    try {
      return JSON.parse(content)
    } catch (error) {
      throw new Error(`Invalid AI JSON response: ${error.message}`)
    }
  }

  throw new Error(`Unsupported AI provider: ${provider}`)
}

const normalizeText = (value) => {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') return String(value).trim() || null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

const normalizeNumber = (value) => {
  if (value === null || value === undefined) return null
  const num = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(num) ? num : null
}

const normalizeStringArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.map((item) => normalizeText(item)).filter(Boolean)
  return [normalizeText(value)].filter(Boolean)
}

const buildProductDocument = (item, jobId, source, sourceUrl) => ({
  name: normalizeText(item.name) || 'Untitled Product',
  category: normalizeText(item.category) || 'Uncategorized',
  subcategory: normalizeText(item.subcategory),
  description: normalizeText(item.description) || '',
  price: normalizeNumber(item.price),
  currency: (item.currency || 'PKR').toUpperCase(),
  images: normalizeStringArray(item.images),
  brand: normalizeText(item.brand),
  material: normalizeText(item.material),
  size: normalizeText(item.size),
  color: normalizeText(item.color),
  features: normalizeStringArray(item.features),
  availability: item.availability || null,
  sku: normalizeText(item.sku),
  source,
  sourceUrl: normalizeText(sourceUrl),
  confidence: normalizeNumber(item.confidence) || 0,
  status: 'pending',
  importJob: jobId
})

const buildServiceDocument = (item, jobId, source, sourceUrl) => ({
  name: normalizeText(item.name) || 'Untitled Service',
  category: normalizeText(item.category) || 'Uncategorized',
  description: normalizeText(item.description) || '',
  price: normalizeNumber(item.price),
  currency: (item.currency || 'PKR').toUpperCase(),
  image: normalizeText(item.image),
  source,
  sourceUrl: normalizeText(sourceUrl),
  confidence: normalizeNumber(item.confidence) || 0,
  status: 'pending',
  importJob: jobId
})

const deduplicateProducts = (items) => {
  const map = new Map()
  for (const item of items) {
    const key = `${(item.name || '').toLowerCase()}|${(item.category || '').toLowerCase()}`
    const existing = map.get(key)
    if (!existing) {
      map.set(key, item)
      continue
    }
    if ((item.confidence || 0) > (existing.confidence || 0)) {
      existing.name = existing.name || item.name
      existing.description = existing.description || item.description
      existing.images = Array.from(new Set([...(existing.images || []), ...(item.images || [])]))
      existing.confidence = Math.max(existing.confidence || 0, item.confidence || 0)
    }
  }
  return Array.from(map.values())
}

const deduplicateServices = (items) => {
  const map = new Map()
  for (const item of items) {
    const key = `${(item.name || '').toLowerCase()}|${(item.category || '').toLowerCase()}`
    const existing = map.get(key)
    if (!existing) {
      map.set(key, item)
      continue
    }
    if ((item.confidence || 0) > (existing.confidence || 0)) {
      existing.name = existing.name || item.name
      existing.description = existing.description || item.description
      existing.confidence = Math.max(existing.confidence || 0, item.confidence || 0)
    }
  }
  return Array.from(map.values())
}

const processAIResults = async (jobId, parsed, source, sourceUrl) => {
  const products = deduplicateProducts((parsed.products || []).map((item) => buildProductDocument(item, jobId, source, sourceUrl)))
  const services = deduplicateServices((parsed.services || []).map((item) => buildServiceDocument(item, jobId, source, sourceUrl)))

  const createdProducts = products.length ? await Product.insertMany(products) : []
  const createdServices = services.length ? await Service.insertMany(services) : []

  await ImportJob.findByIdAndUpdate(jobId, {
    status: 'completed',
    completedAt: new Date(),
    itemsFound: (products.length + services.length),
    productsFound: createdProducts.length,
    servicesFound: createdServices.length
  })

  return { products: createdProducts, services: createdServices }
}

const createDemoProducts = async (jobId, source, sourceUrl) => {
  const demoProducts = [
    {
      name: 'Demo Steel Hinges',
      category: 'Door Hardware',
      description: 'Demo stainless steel door hinge created because API key is not configured.',
      price: 1200,
      currency: 'PKR',
      images: ['/images/door-hardware.jpg'],
      features: ['Demo item', 'Stainless steel'],
      confidence: 0.5,
      source,
      sourceUrl: normalizeText(sourceUrl),
      status: 'pending',
      importJob: jobId
    },
    {
      name: 'Demo Cabinet Handle',
      category: 'Cabinet Hardware',
      description: 'Demo cabinet handle created because API key is not configured.',
      price: 2500,
      currency: 'PKR',
      images: ['/images/cabinet-hardware.jpg'],
      features: ['Demo item', 'Chrome finish'],
      confidence: 0.5,
      source,
      sourceUrl: normalizeText(sourceUrl),
      status: 'pending',
      importJob: jobId
    }
  ]

  const demoServices = [
    {
      name: 'Demo Delivery Service',
      category: 'Logistics',
      description: 'Demo delivery service created because API key is not configured.',
      price: null,
      currency: 'PKR',
      confidence: 0.5,
      source,
      sourceUrl: normalizeText(sourceUrl),
      status: 'pending',
      importJob: jobId
    }
  ]

  let createdProducts = []
  let createdServices = []

  try {
    createdProducts = await Product.insertMany(demoProducts)
    createdServices = await Service.insertMany(demoServices)
  } catch (dbError) {
    console.warn('Demo mode: database insert failed, storing demo data in job only:', dbError.message)
  }

  await ImportJob.findByIdAndUpdate(jobId, {
    status: 'completed',
    completedAt: new Date(),
    itemsFound: (demoProducts.length + demoServices.length),
    productsFound: createdProducts.length || demoProducts.length,
    servicesFound: createdServices.length || demoServices.length,
    errorMessages: ['Demo mode: AI_API_KEY not configured. Sample records created for testing.'],
    meta: {
      demoMode: true,
      demoProducts: demoProducts.map(p => ({ name: p.name, category: p.category, price: p.price })),
      demoServices: demoServices.map(s => ({ name: s.name, category: s.category }))
    }
  })

  return { products: createdProducts, services: createdServices, demo: !createdProducts.length }
}

const startGoogleImport = async (jobId) => {
  const job = await ImportJob.findById(jobId)
  if (!job) return

  await ImportJob.findByIdAndUpdate(jobId, { status: 'processing', startedAt: new Date() })

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey.includes('your-') || apiKey.includes('changeme')) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured. Please add a valid Google Places API key in server .env')
    }

    const url = new URL(job.sourceUrl)
    const placeId = url.searchParams.get('place_id')
    if (!placeId) throw new Error('Missing place_id in Google Maps URL')

    const placeResponse = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,types,rating,user_ratings_total,photos&key=${encodeURIComponent(apiKey)}`)

    if (!placeResponse.ok) throw new Error(`Google Places API error ${placeResponse.status}`)

    const placeData = await placeResponse.json()
    const place = placeData.result || {}

    const businessInfo = {
      name: place.name || null,
      address: place.formatted_address || null,
      phone: place.formatted_phone_number || null,
      website: place.website || null,
      openingHours: place.opening_hours?.weekday_text || null,
      category: (place.types || []).filter((type) => !['establishment', 'point_of_interest'].includes(type)).slice(0, 3).join(', ') || null,
      rating: place.rating || null,
      ratingCount: place.user_ratings_total || null
    }

    const aiKey = process.env.AI_API_KEY
    if (!aiKey || aiKey.includes('your-') || aiKey.includes('changeme')) {
      throw new Error('AI_API_KEY is not configured. Please add a valid OpenAI API key in server .env')
    }

    const prompt = `Extract products and services from this business profile. Only include items explicitly mentioned or clearly inferable. Use null for unknown fields.
Business: ${JSON.stringify(businessInfo)}
Respond with JSON containing products and services arrays.`

    const parsed = await extractEntitiesFromAI(prompt, 'You are a business data extraction assistant. Return only JSON.')

    await processAIResults(jobId, parsed, 'google', job.sourceUrl)
  } catch (error) {
    await ImportJob.findByIdAndUpdate(jobId, {
      status: 'failed',
      completedAt: new Date(),
      errorMessages: [error.message]
    })
  }
}

const startFacebookImport = async (jobId) => {
  const job = await ImportJob.findById(jobId)
  if (!job) return

  await ImportJob.findByIdAndUpdate(jobId, { status: 'processing', startedAt: new Date() })

  try {
    const rawContent = job.rawPayload?.manualContent || ''
    if (!rawContent) throw new Error('No content provided for Facebook import')

    const aiKey = process.env.AI_API_KEY
    if (!aiKey || aiKey.includes('your-') || aiKey.includes('changeme')) {
      throw new Error('AI_API_KEY is not configured. Please add a valid OpenAI API key in server .env')
    }

    const prompt = `Analyze this Facebook business content and extract products and services. Only include items explicitly mentioned or clearly inferable. Use null for unknown fields.
Content:
${rawContent}
Respond with JSON containing products and services arrays.`

    const parsed = await extractEntitiesFromAI(prompt, 'You are a business content analyst. Return only JSON.')

    await processAIResults(jobId, parsed, 'facebook', job.sourceUrl)
  } catch (error) {
    await ImportJob.findByIdAndUpdate(jobId, {
      status: 'failed',
      completedAt: new Date(),
      errorMessages: [error.message]
    })
  }
}

module.exports = {
  startGoogleImport,
  startFacebookImport,
  extractEntitiesFromAI,
  processAIResults,
  createDemoProducts
}
