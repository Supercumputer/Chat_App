const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found.`)
    next(error)
}

module.exports = notFound