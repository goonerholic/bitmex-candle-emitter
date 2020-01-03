const EventEmitter = require('events')
const WebSocket = require('ws')
const getCronJob = require('./cronJob')

const endPoint = {
	mainnet: 'wss://www.bitmex.com/realtime',
	testnet: 'wss://testnet.bitmex.com/realtime'
}

class CandleEmitter extends EventEmitter {
	constructor(symbols, timeframe, testnet) {
		super()
		const timeframeMS = 1000 * 60 * timeframe

		this._counter = {}
		this._storage = {}
		this._buffer = {}
		this._subscription = []
		this._url = testnet ? endPoint.testnet : endPoint.mainnet
		this._processing = false

		for (let symbol of symbols) {
			this._storage[symbol] = []
			this._counter[symbol] = false
			this._buffer[symbol] = []
			this._subscription.push(`"trade:${symbol}"`)
		}

		this._client = new WebSocket(this._url)
		this.addEventListeners()

		this._cronJob = getCronJob(timeframe, () => {
			symbols.forEach(symbol => {
				this._processing = true
				const currentTimeMS =
					Math.floor(Date.now() / timeframeMS) * timeframeMS

				const trades = this._storage[symbol].filter(data => {
					const timestampMS = Date.parse(data.timestamp)
					return (
						timestampMS >= currentTimeMS - timeframeMS &&
						timestampMS < currentTimeMS
					)
				})

				const prices = trades.map(trade => trade.price)

				const candle = {
					symbol,
					timestamp: new Date(currentTimeMS).toISOString(),
					open: prices[0],
					high: Math.max(...prices),
					low: Math.min(...prices),
					close: prices[prices.length - 1]
				}

				if (this._counter[symbol]) {
					this.emit('candle', candle)
					this._storage[symbol] = [
						{
							symbol,
							timestamp: new Date(currentTimeMS).toISOString(),
							price: prices[prices.length - 1]
						},
						...this._buffer[symbol]
					]
				}
				this._counter[symbol] = true
				this._processing = false
			})
		})

		this._cronJob.start()
	}

	onMessage(message) {
		const data = JSON.parse(message)
		const date = new Date().toISOString()

		if (data.info) console.log(`[${date}] ${data.info}`)
		if (data.subscribe)
			console.log(`[${date}] Subscription: ${data.subscribe}`)
		if (data.table) return data.data[0]
	}

	addEventListeners() {
		const client = this._client
		client.on('open', () => {
			console.log(
				`[${new Date().toISOString()}] WebSocket connection opend.`
			)
			client.send(`{"op": "subscribe", "args": [${this._subscription}]}`)
		})

		client.on('message', message => {
			const data = this.onMessage(message)

			if (data) {
				const { symbol, timestamp, price } = data
				const info = {
					symbol,
					timestamp,
					price
				}
				if (this._processing) {
					this._buffer[symbol].push(info)
				} else {
					this._storage[symbol].push(info)
				}
			}
		})

		client.on('close', () => {
			console.log('WebSocket connection closed. Reconnect in 5sec...')

			setTimeout(() => {
				this._client = new WebSocket(this._url)
				this.addEventListeners()
				this._cronJob.start()
			}, 1000 * 5)
		})
	}
}

module.exports = CandleEmitter
