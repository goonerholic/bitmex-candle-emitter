import CandleEmitter from './core/CandleEmitter.js'

function candleEmitter(symbols, timeframe, testnet) {
	const client = new CandleEmitter(symbols, timeframe, testnet)

	return client
}

export default candleEmitter
