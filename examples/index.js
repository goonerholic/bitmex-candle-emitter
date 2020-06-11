import candleEmitter from 'bitmex-candle-emitter'

const client = candleEmitter({
	symbols: ['XBTUSD', 'ETHUSD'],
	timeframe: 60, //(minute),
	testnet: false //(default false)
})

client.on('candle', (candle) => {
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
