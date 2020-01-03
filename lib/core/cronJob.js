const cron = require('cron')

function getCronJob(timeframe, callback) {
	//timeframe = 0 ~ 1440(60 * 24)
	const cronExpression =
		timeframe < 60
			? `0 */${timeframe} * * * *`
			: `0 0 */${timeframe / 60} * * * `

	const cronJob = new cron.CronJob(cronExpression, callback)

	return cronJob
}

module.exports = getCronJob
