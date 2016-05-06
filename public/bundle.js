(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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

},{"raf-funcs":2,"viewport-funcs":3}],2:[function(require,module,exports){

exports.timeout  = timeout
exports.interval = interval
exports.throttle = throttle
exports.debounce = debounce
exports.clear    = clear

function timeout(cb, delay, ctx) {
  delay = safe(delay)
  if (ctx === undefined) ctx = this
  var start = Date.now()
  var data = {
  	id: requestAnimationFrame(loop)
  }

  return data

  function loop() {
  	if (Date.now() - start >= delay) return cb.call(ctx)
    data.id = requestAnimationFrame(loop)
  }
}

function interval(cb, delay, ctx) {
  delay = safe(delay)
  if (ctx == undefined) ctx = this
  var start = Date.now()
  var data = {
  	id: requestAnimationFrame(loop)
  }

  return data

  function loop() {
    if ((Date.now() - start) >= delay) {
      cb.call(ctx)
      start = Date.now()
    }
    data.id = requestAnimationFrame(loop)
  }
}

function throttle(cb, delay, ctx) {
  delay = safe(delay)
  var start = 0
  var data = {}
  var args

  function throttled() {
  	if (data.id == null) {
      if (ctx === undefined) ctx = this
  	  args = arguments
  	  data.id = requestAnimationFrame(loop)
  	}
  }

  throttled.immediate = function() {
    clear(data)
    delayed()
  }

  throttled.cancel = function() {
    clear(data)
  }

  return throttled

  function loop() {
    if (delay - (Date.now() - start) <= 0) return delayed()
    data.id = requestAnimationFrame(loop)
  }

  function delayed() {
    start = Date.now()
    data.id = null
    cb.apply(ctx, args)
  }
}

function debounce(cb, delay, ctx) {
  delay = safe(delay)
  var data = {}
  var start
  var args

  function debounced() {
    if (ctx == undefined) ctx = this
    args = arguments

    clear(data)
    start = Date.now()
    data.id = requestAnimationFrame(loop)
  }

  debounced.immediate = function() {
    clear(data)
    delayed()
  }

  debounced.cancel = function() {
    clear(data)
  }

  return debounced

  function loop() {
    if (delay - (Date.now() - start) <= 0) return delayed()
    data.id = requestAnimationFrame(loop)
  }

  function delayed() {
    data.id = null
    cb.apply(ctx, args)
  }
}

function clear(data) {
  if (data && data.id !== undefined) {
    cancelAnimationFrame(data.id)
    data.id = null
  }
}

function safe(delay) {
  return (delay == undefined || typeof delay != 'number' || delay !== delay || delay < 0)
    ? 0
    : delay
}

},{}],3:[function(require,module,exports){

exports.contains = contains
exports.margins  = margins
exports.rect     = rect

var cache = {
  rect: {
    prev: 0,
    data: null
  },
  margins: {
    prev: 0,
    data: null
  }
}

function rect() {
  if (Date.now() - cache.rect.prev > 10) {
    cache.rect.data = {
       width: window.innerWidth,
      height: window.innerHeight,
        left: window.scrollX,
         top: window.scrollY,
       right: window.scrollX + window.innerWidth,
      bottom: window.scrollY + window.innerHeight
    }

    cache.rect.prev = Date.now()
  }

  return cache.rect.data
}

function margins() {
  if (Date.now() - cache.margins.prev > 10) {
    var elm = document.documentElement
    var bod = document.body

    // documentWidth/Height is the max of the 3 tested sizes
    var width = elm.offsetWidth
    if (elm.scrollWidth > width) width = elm.scrollWidth
    if (bod.scrollWidth > width) width = bod.scrollWidth

    var height = elm.offsetHeight
    if (elm.scrollHeight > height) height = elm.scrollHeight
    if (bod.scrollHeight > height) height = bod.scrollHeight

    cache.margins.data = {
       width: window.innerWidth,
      height: window.innerHeight,
        left: window.scrollX,
         top: window.scrollY,
       right: width  - window.innerWidth  - window.scrollX,
      bottom: height - window.innerHeight - window.scrollY
    }

    cache.margins.prev = Date.now()
  }

  return cache.margins.data
}

function contains(el, offset) {
  if (!document.body.contains(el)
    || el.offsetWidth == 0
    || el.offsetHeight == 0
    || el.getClientRects().length == 0) return false

  offset = safe(offset)
  var r = el.getBoundingClientRect()

  return r.right  >= -offset
    &&   r.left   <= window.innerWidth  + offset
    &&   r.top    <= window.innerHeight + offset
    &&   r.bottom >= -offset
}

function safe(offset) {
  return offset == undefined || typeof offset != 'number' || offset !== offset
    ? 0
    : offset
}

},{}],4:[function(require,module,exports){

const ScrollResize = require('..')

const offset = document.querySelector('input[offset]')
const output = document.querySelector('.output')
const tl = document.querySelector('.tl')
const tr = document.querySelector('.tr')
const bl = document.querySelector('.bl')
const br = document.querySelector('.br')

qsa('button').forEach(function(e) {
  e.addEventListener('click', button)
})

var sr
var a = []

function button(evt) {
  var action = evt.target.getAttribute('action')
  var delay = +offset.value
  var ignore = getIgnore()
  var pref = action.substr(0, 5)
  var bool = action.substr(-4) == 'true'
  // console.log('delay:', delay, 'ignore:', ignore, 'pref:', pref, 'bool:', bool)

  if (pref == 'start') {
    if (sr) {
      sr.stop()
      sr = null
    }

    // uncomment to stress test
    // for (var i = 0; i <= 20000; i++) {
    //   a.push(new ScrollResize(function() {}, delay))
    //   a[a.length - 1].start(bool)
    // }

    sr = new ScrollResize(update, {delay:delay, ignore:ignore})
    sr.start(bool)
  } else {
    sr.stop(bool)
  }
}

function getIgnore() {
  if (document.querySelector('input#none').checked)   return 'none'
  if (document.querySelector('input#resize').checked) return 'resize'
  if (document.querySelector('input#scroll').checked) return 'scroll'
}

function update(data) {
  // uncomment to see stress test
  // var d = new Date()
  // console.log(d.toString().substr(16, 8) + '.' + d.getMilliseconds())

  tl.style.left = data.left + 'px'
  tl.style.top  = data.top + 'px'

  tr.style.left = data.right - 25 + 'px'
  tr.style.top  = data.top + 'px'

  bl.style.left = data.left + 'px'
  bl.style.top  = data.bottom - 25 + 'px'

  br.style.left = data.right - 25 + 'px'
  br.style.top  = data.bottom - 25 + 'px'

  var el = document.querySelector('.rect')
  el.querySelector('td[width]').textContent  = data.width
  el.querySelector('td[height]').textContent = data.height
  el.querySelector('td[left]').textContent   = data.left
  el.querySelector('td[top]').textContent    = data.top
  el.querySelector('td[right]').textContent  = data.right
  el.querySelector('td[bottom]').textContent = data.bottom
}

function qsa(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector))
}

function time() {
  var d = new Date()
  var ms = d.getMilliseconds().toString()
  while (ms.length < 3) ms = '0' + ms
  return d.toString().substr(15, 9) + '.' + ms
}

},{"..":1}]},{},[4]);
