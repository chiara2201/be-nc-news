exports.handlePSQLErrors = (err, req, res, next) => {
	const psqlErrCodes = ['22P02', '23502', '23503']
	const isPSQLErr = psqlErrCodes.includes(err.code)

	if (isPSQLErr) {
		console.log({
			code: err.code,
			message: err.message,
		})

		res.status(400).send({ message: 'Bad request' })
	} else next(err)
}

//Custom errors
exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ message: err.message })
	} else next(err)
}

exports.handle500Errors = (err, req, res, next) => {
	res.status(500).send({ message: 'Internal Server Error' })
}
