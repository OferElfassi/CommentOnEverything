const fs = require('fs')
const morgan = require('morgan')
const path = require('path')

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs.log'), { flags: 'a' })

const morganLogs = () =>{
    return morgan('combined', { stream: accessLogStream })
}


module.exports =morganLogs
