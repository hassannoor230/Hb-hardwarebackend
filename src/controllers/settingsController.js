const SiteSettings = require('../models/SiteSetting')
const BusinessInfo = require('../models/BusinessInfo')

exports.getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.getSettings()
    res.status(200).json({
      success: true,
      data: settings
    })
  } catch (error) {
    console.error('Get settings error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    })
  }
}

exports.updateSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne()
    if (!settings) {
      const newSettings = await SiteSettings.create(req.body)
      return res.status(201).json({
        success: true,
        message: 'Settings created successfully',
        data: newSettings
      })
    }

    Object.assign(settings, req.body)
    await settings.save()

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    })
  } catch (error) {
    console.error('Update settings error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    })
  }
}

exports.getBusinessInfo = async (req, res) => {
  try {
    const businessInfo = await BusinessInfo.getBusinessInfo()
    res.status(200).json({
      success: true,
      data: businessInfo
    })
  } catch (error) {
    console.error('Get business info error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business info',
      error: error.message
    })
  }
}

exports.updateBusinessInfo = async (req, res) => {
  try {
    const businessInfo = await BusinessInfo.findOne()
    if (!businessInfo) {
      const newBusinessInfo = await BusinessInfo.create(req.body)
      return res.status(201).json({
        success: true,
        message: 'Business info created successfully',
        data: newBusinessInfo
      })
    }

    Object.assign(businessInfo, req.body)
    await businessInfo.save()

    res.status(200).json({
      success: true,
      message: 'Business info updated successfully',
      data: businessInfo
    })
  } catch (error) {
    console.error('Update business info error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update business info',
      error: error.message
    })
  }
}