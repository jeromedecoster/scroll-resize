
const ScrollResize = require('..')
var s = new ScrollResize(function() {}, {delay:1, ignore:'ko'})
s.start()

const offset = document.querySelector('input[offset]')
const silent = document.querySelector('input[silent]')
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

    sr = new ScrollResize(update, {delay:delay, ignore:ignore, silent:silent.checked})
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
  if (data == undefined) return console.log('silent')
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
