
const throttle = require('raf-funcs').throttle
const rect = require('viewport-funcs').rect

module.exports = ScrollResize

function ScrollResize(cb, opts) {
  if (!(this instanceof ScrollResize)) return new ScrollResize(cb, opts)

  if (!opts) opts = {}

  this.cb = cb
  this.ignore = opts.ignore
  this.throttled = throttle(this.call, safe(opts.delay), this)
  this.started = false
}

ScrollResize.prototype.start = function(skip) {
  if (this.started === true) return
  this.started = true

  if (this.ignore != 'resize') window.addEventListener('resize', this.throttled, false)
  if (this.ignore != 'scroll') window.addEventListener('scroll', this.throttled, false)

  if (skip === true) return
  this.throttled.immediate()
}

ScrollResize.prototype.stop = function(skip) {
  if (this.started !== true) return
  this.started = false

  this.throttled.cancel()

  window.removeEventListener('resize', this.throttled)
  window.removeEventListener('scroll', this.throttled)

  if (skip === true) return
  this.throttled.immediate()
}

ScrollResize.prototype.call = function () {
  this.cb(rect())
}

function safe(delay) {
  if (delay == undefined || typeof delay != 'number' || delay !== delay) return 50
  return delay < 25 ? 25 : delay
}
