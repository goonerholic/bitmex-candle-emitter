import candleEmitter from './lib/candleEmitter.js'

const client = candleEmitter(['XBTUSD', 'ETHUSD'], 10, false)
client.on('candle', candle => {
	console.log(candle)
})
