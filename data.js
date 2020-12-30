/**
 * functions for managing data, all data is stored in the
 * .data folder.
 *
 */

'use strict'

// Dependencies
const fs = require('fs')
const path = require('path')

//Simple Helper functions
let parseJsonToObject = (string) => {
  try {
    let obj = JSON.parse(string)
    return obj
  } catch (error) {
    return {}
  }
}
//Base folder for all data
const basePath = path.join(__dirname, './.data/')

const createDocumentNameWithExtension = (document) => {
  return document + '.json'
}
const createFullDocumentPath = (collection, document) => {
  return basePath + collection + '/' + createDocumentNameWithExtension(document)
}

// Writing data to a new document in an existing collection
const write = (collection, documentName, data, callback) => {
  const path = createFullDocumentPath(collection, documentName)
  data = typeof data == 'object' ? JSON.stringify(data) : false
  if (data)
    fs.writeFile(path, data, { flag: 'w' }, (err) => {
      if (err) return callback('Error write to file:' + err + path)
      else callback(false)
    })
  else return callback('Error :invalid data provided')
}

//Reading  from a document and returning the data
const read = (collection, documentName, callback) => {
  const path = createFullDocumentPath(collection, documentName)
  fs.readFile(path, 'UTF-8', (err, data) => {
    if (err) return callback('Error: could no read from file', undefined)
    else {
      const dataParsed = parseJsonToObject(data)
      return callback(false, dataParsed)
    }
  })
}
//Reading from a document and returning the data instantly
const readAsync = (collection, documentName) => {
  const path = createFullDocumentPath(collection, documentName)
  let data = fs.readFileSync(path, 'UTF-8')

  if (Object.keys(data).length > 0) {
    const dataParsed = parseJsonToObject(data)

    return dataParsed
  }
  return false
}
//Writing data to a document and returning the data instantly
const writeAsync = (collection, documentName, data) => {
  const path = createFullDocumentPath(collection, documentName)
  data = typeof data == 'object' ? JSON.stringify(data) : false
  if (data) fs.writeFileSync(path, data, { flag: 'w' })
  else return false
}
//Updating the data on a document
const update = (collection, documentName, NewData, callback) => {
  const path = createFullDocumentPath(collection, documentName)

  read(collection, documentName, (err, oldData) => {
    if (err) return callback('Error finding what you want to update')
    else {
      write(collection, documentName, { ...oldData, ...NewData }, (err) => {
        if (err) return callback('Error writing to your file')
        else return callback(false)
      })
    }
  })
}
//Deleting a document
const remove = (collection, documentName, callback) => {
  const path = createFullDocumentPath(collection, documentName)

  fs.unlink(path, (err) => {
    if (err) return callback(err)
    else return callback(false)
  })
}
//List all documents names  in a folder
const list = (collection, callback, withoutExt = false) => {
  const path = basePath + collection
  fs.readdir(path, (err, files) => {
    if (err) return callback(err, undefined)
    else {
      return callback(false, files)
    }
  })
}

const db = { writeAsync, readAsync, write, read, update, delete: remove, list }
module.exports = db
