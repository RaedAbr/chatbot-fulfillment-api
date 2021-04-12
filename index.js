const express = require('express')
const morgan = require('morgan')
const { WebhookClient } = require('dialogflow-fulfillment')

const { Handlers, IntentNames } = require('./handlers')
const { authentication } = require('./authentication')

process.env.DEBUG = 'dialogflow:debug'

const app = express()
app.use(morgan('combined'))
app.use(express.static('public'))

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), authentication, (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  const handlers = Handlers(agent)

  const intentMap = new Map()

  // Coffee item intent
  intentMap.set(IntentNames.CoffeeItem, handlers.coffeeItem)
  // Change coffee name intent
  intentMap.set(IntentNames.CoffeeNameChange, handlers.coffeeNameChange)
  // Change coffee size intent
  intentMap.set(IntentNames.CoffeeSizeChange, handlers.coffeeSizeChange)
  // Confirm coffee item yes
  intentMap.set(IntentNames.CoffeeItemConfirmYes, handlers.coffeeItemConfirmYes)
  // Show order intent
  intentMap.set(IntentNames.ShowOrder, handlers.showOrder)
  // Order done intent
  intentMap.set(IntentNames.OrderDone, handlers.orderDone)
  // Order done intent
  intentMap.set(IntentNames.ShowBill, handlers.showBill)

  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)
