const setBoolean = require('is-funcs/set-boolean')
const setNumber = require('is-funcs/set-number')
const setString = require('is-funcs/set-string')
const throttle = require('raf-funcs/throttle')
const rect = require('viewport-funcs/rect')
const only = require('object-funcs/only')

module.exports = ScrollResize

function ScrollResize(cb, opts) {
  if (!(this instanceof ScrollResize)) return new ScrollResize(cb, opts)

  if (typeof cb !== 'function') throw new Error('ScrollResize require a callback')
  this.cb = cb

  this.opts = only(opts, 'delay ignore silent')
  this.opts.delay  = setNumber(this.opts.delay, 50, 25)
  this.opts.silent = setBoolean(this.opts.silent)
  this.opts.ignore = setString(this.opts.ignore, null, 'resize scroll')

  this.throttled = throttle(this.call, this.opts.delay, this)
  this.started = false
}

ScrollResize.prototype.start = function(skip) {
  if (this.started === true) return
  this.started = true

  if (this.opts.ignore != 'resize') window.addEventListener('resize', this.throttled, false)
  if (this.opts.ignore != 'scroll') window.addEventListener('scroll', this.throttled, false)

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
  if (this.opts.silent === true) this.cb()
  else this.cb(rect())
}
