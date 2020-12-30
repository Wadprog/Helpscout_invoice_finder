/**
 * Make the call to find the invoice in Beacon
 */

//Dependency
let HTMLParser = require('node-html-parser')

//Custom dependencies
let helper = require('./helpers')
let request = require('./request')
let searchOrderNumber = require('./beaconDigger')
const constants = require('./constants')

const { NO_ORDER } = constants

async function getTreads(conversationID) {
  conversationID =
    conversationID && conversationID != null && conversationID != undefined
      ? conversationID
      : null

  if (conversationID) {
    let url =
      constants.BASE_URL +
      conversationID +
      '?embed=threads&mailbox=178750&status=active&tag=buying'
    let response = await request.fetch(url, {
      method: constants.HTTP_METHOD_GET,
    })
    if (
      response &&
      !response.data.error &&
      response.data.result &&
      response.data.result.threads &&
      Array.isArray(response.data.result.threads)
    )
      return response.data.result.threads

    return false
  }
  return false
}
function makeHTMLDoc(threads) {
  if (threads && Array.isArray(threads) && threads.length > 0) {
    //Empty DIV
    var document = false
    let lastThread = threads[threads.length - 1]

    if (lastThread && lastThread != null && lastThread != undefined) {
      if (lastThread.body != undefined && lastThread.body != null) {
        let stringThread = `<div>${lastThread.body}</div>`
        document = HTMLParser.parse(stringThread)
      }
    }
  }
  return document
}
async function getInvoiceFromConversationThreads(conversationID) {
  let threads = await getTreads(conversationID)

  if (threads) {
    let document = makeHTMLDoc(threads)
    if (document) return searchOrderNumber(document)
    else return NO_ORDER
  } else return NO_ORDER
}
async function test() {
  let r = await getInvoiceFromConversationThreads(1351137682) /*1351137682*/
  console.log({ r })
}
//test()
module.exports = getInvoiceFromConversationThreads
