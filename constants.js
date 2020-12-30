/*
 * Module that define constants used in the app.
 *
 */

'use strict'

module.exports = Object.freeze({
  HTTP_STATUS_OK: 200,
  HTTP_STATUS_CREATED: 201,
  HTTP_STATUS_OK_NO_CONTENT: 204,
  HTTP_BAD_REQUEST: 400,
  HTTP_STATUS_UNAUTHORIZED: 403,
  HTTP_STATUS_NOT_FOUND: 404,
  HTTP_INTERNAL_SERVER_ERROR: 500,

  HTTP_METHOD_GET: 'GET',
  HTTP_METHOD_POST: 'post',
  HTTP_METHOD_PUT: 'put',
  HTTP_METHOD_DELETE: 'delete',
  BASE_URL: 'https://api.helpscout.net/v2/conversations/',
  THREADS_BASE_URL:
    ' https://api.helpscout.net/v2/conversations?_embeded=threads&mailbox=178750&status=active&sortOrder=asc&query=(body:"Beacon")',
  MINIMUM_API_LIMIT: 2,
  NO_ORDER: undefined,
  REMAINING_CALL: 'x-ratelimit-remaining-minute',
})
