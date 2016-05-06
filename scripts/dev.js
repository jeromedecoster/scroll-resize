
const budo = require('budo')
const fs = require('fs')

//
// SERVER
//

budo('./src/index.js', {
   serve: 'bundle.js',
    live: true,
  stream: process.stdout,
     dir: 'public',
   debug: false,
    host: 'localhost',
    port: 3000,
    open: false
})
.on('update', function (buf) {
  fs.writeFileSync('public/bundle.js', buf)
})
