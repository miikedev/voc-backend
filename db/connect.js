const mongoose = require('mongoose')

const connect = (url) => {
    return mongoose.connect(url).then(() => console.log('connect success to database...'))
}

const disconnect = () => {
    return mongoose.disconnect()
}

module.exports = {
    connect,
    disconnect
}