# scroll-resize

> Throttled window scroll and resize events

## Install

```bash
npm i scroll-resize
```

## API

#### constructor(cb, [opts])

| Argument | Action |
| :------ | :------- |
| **cb** | the callback |
| **opts.delay** | optional delay, default to 50 ms, min to 25 ms |
| **opts.ignore** | optional ignore, accept `scroll` or `resize`, default to `undefined` |

The callback receive an object with 6 properties

| Argument | Action |
| :------ | :------- |
| **width** | the window innerWidth |
| **height** | the window innerHeight |
| **left** | the window scrollX |
| **top** | the window scrollY |
| **right** | the window scrollX + window.innerWidth |
| **bottom** | the window scrollY + window.innerHeight |

```js
const SR = require('scroll-resize')

function update(data) {
  // {with:.., height:.., left:.., top:.., right:.., bottom:..}
  console.log(data)
}

var sr = new SR(update)

sr.start()
```

#### start([skip])

Start listening the `scroll` and|or `resize` events

By default, the callback fonction `cb` is called right after the `start` method is invoked

Set `skip` to `true` if you want instead wait the first real event

#### stop([skip])

Stop listening the events, cancel the internal throttling

By default, the callback fonction `cb` is called when the `stop` method is invoked

Set `skip` to `true` if you don't want this safer last call

## License

MIT
