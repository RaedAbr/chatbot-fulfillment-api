# chatbot-dialogflow-api

This is an api for Dialogflow fulfillment of a chatbot created in the context of Advanced User Interface Master course practical work.

Link to the chatbot demo: [here](https://chatbot-fulfillment-api.herokuapp.com/)

Our Fialogflow chatbot model is exported in zip file `/Dialogflow_Essentials/Coffee-chatbot.zip`. You can simply import it in an empty Dialogflow project to train the chatbot.

> Do not forget to change the fulfillment configuration (hostname, username and password) in the Dialogflow dashboard to go with parameters of the deployed api (current node.js project)

# Start locally with `ngrok` tunnel

```shell
npm run ngrok
```

This will run the api locally, but make it available publicly throw `ngrok` tunnel, with username: `admin` and password: `password`

# Dev

```shell
npm run dev
```

This will run the api locally in listening on port `8080`, with username: `admin` and password: `password`
