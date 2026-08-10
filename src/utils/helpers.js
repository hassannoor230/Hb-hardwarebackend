const fs = require('fs')
const path = require('path')

exports.generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

exports.truncateText = (text, length = 100) => {
    if (!text) return ''
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
}

exports.getPagination = (page, limit) => {
    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 10
    const skip = (pageNum - 1) * limitNum
    return { page: pageNum, limit: limitNum, skip }
}

exports.sanitizeInput = (input) => {
    if (typeof input !== 'string') return input
    return input
        .trim()
        .replace(/[<>]/g, '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

exports.isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    return phoneRegex.test(phone)
}

exports.isValidEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/
    return emailRegex.test(email)
}

exports.isValidUrl = (url) => {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

exports.generateRandomString = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

exports.formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

exports.deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        if (!filePath) return resolve()
        const fullPath = path.join(__dirname, '../../', filePath)
        if (fs.existsSync(fullPath)) {
            fs.unlink(fullPath, (err) => {
                if (err) reject(err)
                resolve()
            })
        } else {
            resolve()
        }
    })
}

exports.validateFileType = (file, allowedTypes) => {
    if (!file) return false
    return allowedTypes.includes(file.mimetype)
}

exports.getClientIP = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip
}