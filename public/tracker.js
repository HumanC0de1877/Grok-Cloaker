;(function () {
  'use strict'

  var campaignId = new URLSearchParams(location.search).get('utm_campaign') || ''
  if (!campaignId) return

  var data = {
    campaignId: campaignId,
    fingerprint: '',
    cpuCores: navigator.hardwareConcurrency || 0,
    deviceMemory: navigator.deviceMemory || 0,
    platform: navigator.platform || '',
    languages: Array.from(navigator.languages || [navigator.language || '']),
    screenResolution: screen.width + 'x' + screen.height,
    hasWebdriver: !!navigator.webdriver,
    hasChrome: typeof window.chrome !== 'undefined',
    isBot: false,
    mouseMovements: 0,
    clicks: 0,
    scrollDepth: 0,
    timeOnPage: 0,
  }

  // Bot detection
  if (navigator.webdriver || !window.chrome) {
    data.isBot = true
  }

  // Canvas fingerprint
  try {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('cloaker-fp', 2, 2)
    data.fingerprint = canvas.toDataURL().slice(-32)
  } catch (e) {
    data.fingerprint = 'err'
  }

  // Behavioral tracking
  document.addEventListener('mousemove', function () { data.mouseMovements++ }, { passive: true })
  document.addEventListener('click', function () { data.clicks++ }, { passive: true })

  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY + window.innerHeight
    var total = document.documentElement.scrollHeight
    var depth = Math.round((scrolled / total) * 100)
    if (depth > data.scrollDepth) data.scrollDepth = depth
  }, { passive: true })

  var startTime = Date.now()

  function send() {
    data.timeOnPage = Math.round((Date.now() - startTime) / 1000)
    var payload = JSON.stringify(data)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', new Blob([payload], { type: 'application/json' }))
    }
  }

  // Send on page unload
  window.addEventListener('pagehide', send)
  window.addEventListener('beforeunload', send)

  // Send every 10 seconds
  setInterval(send, 10000)
})()
