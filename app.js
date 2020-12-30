/**
 *
 * Find and Update the invoice Id field
 */

//Custom dependencies
let helper = require('./helpers')
const constants = require('./constants')
const getInvoiceFromConversationThreads = require('./beaconFinder')
let request = require('./request')

async function run() {
  //Requirements
  const { customFieldsGetter, readLastConversationPage, inform, error } = helper
  //Setting up
  let startingPage = readLastConversationPage()
  let page = startingPage || 12
  let firstRequestMade = false
  let res = { page: { totalPages: 1 } }
  //Launching and looping for all conversation
  inform('Starting on page ' + page)

  while (!firstRequestMade || page < res.page.totalPages) {
    res = await request.AllConversations(page)

    if (res) {
      //Let's go throughout each conversations
      let conversations = res.result.conversations

      inform('Loaded ' + conversations.length + ' conversations successfully')
      for (let conversation of conversations) {
        let conversationID = conversation.id
        let invoice = customFieldsGetter(conversation.customFields).Invoice_ID

        
        if (!invoice) {
          invoice = await getInvoiceFromConversationThreads(conversationID)
          // If there is an invoice now
          if (invoice) {
            inform('Updating invoice Id fields')
            try {
              await request.updateConversationInvoice(conversationID, invoice)
              inform('Updated invoice for conversation ' + conversationID)
            } catch (error) {
              error('Could not update the invoice for ' + conversationID)
              console.log(error)
            }
          }
        }
        /*
        May run even the first if run because invoice value could be updated in it
        */
        if (invoice && !conversation.subject.includes(invoice)) {
          inform('Updating the subject line')
          let subject = 'Order ' + invoice + ' ' + conversation.subject
          try {
            await request.upConversationSubject(conversationID, subject)

            inform('Updated conversation subject for ' + conversationID)
          } catch (error) {
            error('Failed to Update conversation subject for ' + conversationID)
            console.error(error)
          }
        }
      }
    } else {
      error('No Response from gathering conversations')
    }

    page++
    helper.savePage(page)
    if (!firstRequestMade) firstRequestMade = true
  }
  inform('---** Successfully went through all conversations **--')
}

run()
