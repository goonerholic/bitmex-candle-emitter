# bitmex-candle-emitter
Custom timeframed candle emitter for Bitmex based on EventEmitter.

## Installation
```cli
npm install bitmex-candle-emitter
```
or
```cli
yarn add bitmex-candle-emitter
```

## Usage
```javascript
import candleEmitter from 'bitmex-candle-emitter'

const client = candleEmitter({
  symbols: ['XBTUSD', 'ETHUSD']
  timeframe: 60 //(minute),
  testnet: false //(default false)
})

client.on('candle', candle => {
  /*
    candle = {
      symbol,
      timeframe,
      open,
      high,
      low,
      close,
    }
  */
  console.log(candle)
})
```
