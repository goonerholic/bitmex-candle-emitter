const candleEmitter = require('./lib/candleEmitter')

const client = candleEmitter({
	symbols: ['XBTUSD'],
	timeframe: 1,
	testnet: false
})

client.on('candle', candle => console.log(candle))
