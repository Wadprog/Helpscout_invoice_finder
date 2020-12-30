# Helpscout Invoice ID Finder.

Main function of the app is to update the Invoice ID fields in a conversation by finding the Invoice Id in the conversation Beacon section. 

It also update the subject line of the conversation by adding to the subject line the invoice number. This

The application will keep track of the latest pages it requested from Helpscout Api and will always continue from there each time you restart it. 

To use this Application Simply Create a `config.js` File containing the following: 

```jsx
*const* config = {
APP_ID: 'your app ID',
APP_SECRET: 'your app secret',
}
module.exports = config
```

After creating that file run `npm i` to install the dependencies. 

Run `npm start` to launch the app.