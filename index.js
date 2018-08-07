const express = require('express')
const amqplib = require('amqplib')
const bodyParser = require('body-parser')
const config = require('./config')

const app = express()
const port = 3000
const queue = 'queue.sms.spearfly'
const exchange = 'exchange.sms.spearfly'
const type = 'topic'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const main = async () => {
    let conn = await amqplib.connect(config.amqp)
    
    let channel = await conn.createChannel()
    await channel.assertExchange(exchange, type)
    let response = await channel.assertQueue(queue)
    
    let messageCount = response.messageCount
    console.log(messageCount)
    response = await channel.bindQueue(response.queue, exchange, '*')
    console.log(response)
    // response = await channel.consume(response.queue, logMessage(messageCount), {noAck: false})
    
}

main()

app.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log(`Server Started Successfully : ${port} : 0.0.0.0`)
})
