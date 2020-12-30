/**
 * Get Invoice ID  from conversation bottom
 */

//Custom imports/ local dependencies

let helper = require('./helpers')

let { NO_ORDER } = require('./constants')

const getOrderFromAnchorsInBeacon = (beacon) => {
  let anchors = beacon.querySelector('a')

  if (anchors) {
    if (Array.isArray(anchors)) {
      for (let anchor of anchors) {
        console.log('IN')
        var orderNUmber = getOrderFromAnchor(anchor)
        if (orderNUmber != NO_ORDER && orderNUmber != 0 && orderNUmber > 0) {
          break
          return orderNUmber
        }
      }
      return NO_ORDER
    } else {
      let orderNUmber = getOrderFromAnchor(anchors)
      if (orderNUmber != NO_ORDER && orderNUmber != 0 && orderNUmber > 0)
        return orderNUmber
      else return NO_ORDER
    }
  }
  return NO_ORDER
}
const getOrderFromAnchor = (anchor) => {
  let value = anchor.innerText
  if (value.indexOf('Order #') != -1) {
    let order = value.split('#')[1]
    order = order.split('|')[0]
    return parseInt(order)
  }
  return NO_ORDER
}

function searchOrderNumber(document) {
  //get beacons
  let BeaconHistoryTimelineListItem = document.querySelector(
    '.c-BeaconHistoryTimelineListItem'
  )

  if (BeaconHistoryTimelineListItem) {
    if (Array.isArray(BeaconHistoryTimelineListItem)) {
      for (let beacon of BeaconHistoryTimelineListItem) {
        var order = getOrderFromAnchorsInBeacon(beacon)
        if (
          order != NO_ORDER &&
          parseInt(order.toString()[0]) == 1 &&
          parseInt(order.toString()[1]) < 3
        )
          return order
      }
      return NO_ORDER
    } else {
      return getOrderFromAnchorsInBeacon(BeaconHistoryTimelineListItem)
    }
  }
}
module.exports = searchOrderNumber
