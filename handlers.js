const { FakeDatabase } = require('./fake-database')

const IntentNames = {
  CoffeeItem: 'CoffeeItem',
  CoffeeNameChange: 'CoffeeNameChange',
  CoffeeSizeChange: 'CoffeeSizeChange',
  CoffeeItemConfirmYes: 'CoffeeItemConfirmYes',
  ShowOrder: 'ShowOrder',
  OrderDone: 'OrderDone',
  ShowBill: 'ShowBill'
}

function Handlers (agent) {
  function buildConditionalPart (params) {
    const coffeeName = params.coffeeName
    const coffeeSize = params.coffeeSize
    const coffeeFlavor = params.coffeeFlavor
    const coffeeSugar = params.coffeeSugar

    const part1SizeName = `${coffeeSize} ${coffeeName}`
    let part2Flavor = ''
    let part3Sugar = ''

    if (coffeeFlavor) {
      part2Flavor += ` with ${coffeeFlavor} flavor`
    }
    if (coffeeSugar) {
      part3Sugar += ` and ${coffeeSugar}`
    }

    return `${part1SizeName}${part2Flavor}${part3Sugar}`
  }

  function coffeeItemResponse (itentName) {
    console.log('parameters: ', agent.parameters)

    const dynamicPart = buildConditionalPart(agent.parameters)

    switch (itentName) {
      case IntentNames.CoffeeItem:
        agent.add(`Perfect! That's ${dynamicPart}. Can you confirm?`)
        break
      case IntentNames.CoffeeNameChange:
      case IntentNames.CoffeeSizeChange:
        agent.add(`Sure! I've changed your order to ${dynamicPart}. Is that ok?`)
        break
      default:
        agent.add('Please try again!')
        break
    }
  }

  function coffeeItemConfirmYesResponse () {
    const item = agent.context.get('item')
    const coffeeName = item.parameters.coffeeName
    const coffeeSize = item.parameters.coffeeSize
    const coffeeFlavor = item.parameters.coffeeFlavor
    const coffeeSugar = item.parameters.coffeeSugar

    const orderContext = {
      name: 'order',
      lifespan: '50',
      parameters: {}
    }

    // Get the list of orderd items, if we already have ones, 
    // to append new item to the "order" context. Otherwise,
    // create new one
    let orderedItems = []
    if (agent.context.get('order')) {
      orderedItems = agent.context.get('order').parameters.orderedItems
    }
    orderedItems.push({
      coffeeName: coffeeName,
      coffeeSize: coffeeSize,
      coffeeFlavor: coffeeFlavor,
      coffeeSugar: coffeeSugar
    })

    console.log('orderedItems: ', orderedItems)

    orderContext.parameters.orderedItems = orderedItems
    agent.context.set(orderContext)

    agent.add("Great, I've added this to your order. Anything else?")
  }

  function showOrderResponse () {
    if (agent.context.get('order')) {
      const orderContext = agent.context.get('order')
      const orderedItems = orderContext.parameters.orderedItems

      const details = []
      orderedItems.forEach(item => {
        details.push(`- ${buildConditionalPart(item)}`)
      })

      agent.add('So far, you\'ve got: ')
      details.forEach(d => {
        agent.add(d)
      })
      agent.add('Just tell me if you want the bill')
      return
    }
    agent.add('No order yet. Which coffee do you want?')
  }

  function showBillResponse () {
    if (agent.context.get('order')) {
      const orderContext = agent.context.get('order')
      const orderedItems = orderContext.parameters.orderedItems
      let total = 0
      const details = []
      orderedItems.forEach(item => {
        let oneCoffee = '- '

        // coffee price
        let price = FakeDatabase.find(it => it.name === item.coffeeName).price
        oneCoffee += `${item.coffeeSize} ${item.coffeeName}(${price}$)`
        total += price

        // flavor price
        if (item.coffeeFlavor) {
          price = FakeDatabase.find(it => it.name === item.coffeeFlavor).price
          oneCoffee += `, ${item.coffeeFlavor}(${price}$)`
          total += price
        }

        // free sugar
        if (item.coffeeSugar) {
          oneCoffee += `, ${item.coffeeSugar}(0$)`
        }

        details.push(oneCoffee)
      })

      details.forEach(oneCoffee => {
        agent.add(oneCoffee)
      })
      agent.add(`Total: ${total}$`)
      return
    }
    agent.add('No order yet. Which coffee do you want?')
  }

  return {
    coffeeItem: () => {
      console.log(`==> "${IntentNames.CoffeeItem}" intent`)
      coffeeItemResponse(IntentNames.CoffeeItem)
    },

    coffeeNameChange: () => {
      console.log(`==> "${IntentNames.CoffeeNameChange}" intent`)
      coffeeItemResponse(IntentNames.CoffeeNameChange)
    },

    coffeeSizeChange: () => {
      console.log(`==> "${IntentNames.CoffeeSizeChange}" intent`)
      coffeeItemResponse(IntentNames.CoffeeSizeChange)
    },

    coffeeItemConfirmYes: () => {
      console.log(`==> "${IntentNames.CoffeeItemConfirmYes}" intent`)
      coffeeItemConfirmYesResponse()
    },

    showOrder: () => {
      console.log(`==> "${IntentNames.ShowOrder}" intent`)
      showOrderResponse()
    },

    orderDone: () => {
      console.log(`==> "${IntentNames.OrderDone}" intent`)
      showOrderResponse()
    },

    showBill: () => {
      console.log(`==> "${IntentNames.ShowBill}" intent`)
      showBillResponse()
    }
  }
}

module.exports = { Handlers, IntentNames }
