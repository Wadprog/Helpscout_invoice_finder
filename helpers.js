/**
 * All functions that are too small to be there own modules
 */

let data = require('./data')

const helper = {}

helper.p = function (string) {
  try {
    let r = JSON.parse(string)
    return r
  } catch (err) {
    return {}
  }
}

helper.savePage = (page) => {
  data.write('infos', 'lastPage', { page: page }, (err) => {
    if (err) helper.error(err)
  })
}
helper.readLastConversationPage = () => {
  let pageInfo = data.readAsync('infos', 'lastPage')
  if (pageInfo) {
    return pageInfo.page
  } else return 1
}

helper.parseJsonToObject = (string) => {
  try {
    let obj = JSON.parse(string)
    return obj
  } catch (error) {
    return {}
  }
}
helper.sleep = (milliSeconds, message = null) => {
  let startTime = new Date().getTime()
  let lastLog = 0
  function updateDisplay(currentTime) {
    console.clear()
    let msg = ''
    if (message) msg = message + '\n'
    msg += '💤 🕑 Relaunching in: ' + currentTime + ' seconds'
    process.stdout.write(msg)
  }
  let currentTime = new Date().getTime()
  let lastTimeIChecked = currentTime
  let remaining = milliSeconds / 1000
  while (startTime + milliSeconds >= currentTime) {
    currentTime = new Date().getTime()

    if (currentTime - lastTimeIChecked >= 1000) {
      remaining--
      updateDisplay(remaining)
      lastTimeIChecked = currentTime
    }
  }
  //Restoring \n
  console.log('')
}



helper.customFieldsGetter = (customFields) => {
  let valueToreturn = {}

  customFields.forEach((field) => {
    valueToreturn[field.name.replace(/ /g, '_')] = field.value
  })
  return valueToreturn
}

helper.pauseIfLimitReach = (error) => {
  let msg = '\n\n🕕🕦🕑-script have been halted-🕕🕦🕑\n\n'
  let timeToWait =
    error.retry_after != undefined ? error.retry_after : constants.ONE_MINUTE
  helper.sleep(timeToWait, msg)
}
helper.log = (msg, type, symbol = null) => {
  const black = '\x1b[30m'
  const red = '\x1b[31m'
  const green = '\x1b[32m'
  const yellow = '\x1b[33m'
  const blue = '\x1b[34m'
  let colorCode = '\x1b[31m%s\x1b[0m'
  switch (type.toUpperCase()) {
    case 'ERROR':
      colorCode = red
      break
    case 'INFO':
      colorCode = blue
      break
    case 'SUCCESS':
      colorCode = green
      break
    case 'WARNING':
      colorCode = yellow
      break
    default:
      colorCode = black
      break
  }
  if (symbol) console.log(symbol, colorCode, msg)
  else console.log(colorCode, msg)
}
helper.error = (msg) => helper.log(msg, 'ERROR', '❌')
helper.inform = (msg) => helper.log(msg, 'INFO', 'ℹ️ ')
helper.success = (msg) => helper.log(msg, 'SUCCESS', '✅')
helper.warning = (msg) => helper.log(msg, 'WARNING', '🚧')

module.exports = helper
