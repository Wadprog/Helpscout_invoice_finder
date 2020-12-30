/**
 * All Request to the api are handle here
 */

//Dependencies
var HelpScout = require('helpscout-2.0')
//Custom imports
let config = require('./config')
let helper = require('./helpers')
let constants = require('./constants')

// Authenticating with helpscout
var HelpScoutClient = new HelpScout({
  clientId: config.APP_ID,
  clientSecret: config.APP_SECRET,
})

//Main object
let request = {}
//Global in request
request.MINIMUM_API_CALL = 2

request.fetch = async function (url, options) {
  //Sanity checking

  let method =
    options.method && typeof options.method == 'string'
      ? options.method.toUpperCase()
      : false
  var uri = url && typeof url == 'string' ? url : false
  let payload =
    options.payload && typeof options.payload == 'object'
      ? options.payload
      : undefined

  if (method && uri && payload === options.payload) {
    helper.sleep(200)
    //if we exceeded the ApiLimit wait another min
    if (request.MINIMUM_API_CALL < 2)
      helper.pauseIfLimitReach({ retry_after: 60000 })

    try {
      //Now we are making the call.
      let res = await HelpScoutClient.rawApi(method, uri, payload)
      //Processing the response once it is back
      if ('body' in res) {
        const body = res.body
        let data = {}
        if (method == constants.HTTP_METHOD_GET) {
          let parsedBody = helper.parseJsonToObject(body)
          data.result = parsedBody._embedded
          data.page = parsedBody.page
        }

        const { REMAINING_CALL } = constants

        request.MINIMUM_API_CALL = parseInt(res.headers[REMAINING_CALL])

        return {
          body,
          data,
          getResponseCode: () => res.statusCode,
          getContentText: () => body,
        }
      }
    } catch (error) {
      helper.error(`Failed to ${options.method} ${url} with ${options.payload}`)
      console.error(error)

      return {
        data: error,
        getResponseCode: () => res.statusCode,
        getContentText: () => '',
      }
    }
  } else {
    helper.warning(`Incorrect request arguments `)
    console.error({
      url,
      options,
    })
    return false
  }
}
//________________________________________________________________

request.AllConversations = async (page = false) => {
  let { THREADS_BASE_URL } = constants
  let url = page ? THREADS_BASE_URL + '&page=' + page : THREADS_BASE_URL

  try {
    var res = await request.fetch(url, { method: constants.HTTP_METHOD_GET })
    let statusCode = res.getResponseCode()
    if (statusCode == constants.HTTP_STATUS_OK) {
      helper.success('Successfully loaded emails in page ' + page)
      return res.data
    } else {
      helper.error('Failed to load email in page ' + page)
      return false
    }
  } catch (error) {
    helper.error('Failed to load email in page ' + page)
    console.error(error)
    return false
  }
}

request.upConversationSubject = async (conversationID, subject) => {
  if ((conversationID, subject)) {
    let url = constants.BASE_URL + conversationID
    await request.fetch(
      url,

      {
        method: 'PATCH',
        payload: { op: 'replace', path: '/subject', value: subject },
      }
    )
  }
}

request.updateConversationInvoice = async (conversationID, invoice) => {
  let url = constants.BASE_URL + conversationID + '/fields'

  await request.fetch(url, {
    method: 'PUT',
    payload: {
      fields: [
        {
          id: 16719,
          value: invoice,
        },
      ],
    },
  })
}

async function test(conversationID, invoice) {
  await request.updateConversationInvoice(conversationID, invoice)
}
test(1381956113, 123388690)
module.exports = request
