const CandleEmitter = require('./core/CandleEmitter')

function candleEmitter(options) {
	const testnet = options.testnet ? options.testnet : false
	const { symbols, timeframe } = options
	const client = new CandleEmitter(symbols, timeframe, testnet)

	return client
}

module.exports = candleEmitter
