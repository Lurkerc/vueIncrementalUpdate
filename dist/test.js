var fs = require('fs')
var path = require('path')
var THREAD = require('os').cpus().length

var expand = function (file, callback) {
  fs.stat(file, function (err, stats) {
    if (err) { return callback(err) }
    if (!stats.isDirectory()) {
      return callback(null, stats.size)
    } else {
      fs.readdir(file, function (err, files) {
        if (err) { return callback(err) }
        for (var i = 0, len = files.length; i < len; i++) { files[i] = path.join(file, files[i]) }
        var size = 0
        var finish = 0
        var threadFinish = function () {
          finish++
          if (finish >= THREAD) { return callback(null, size) }
        }
        var next = function () {
          var f = files.pop()
          if (!f) { return threadFinish() }
          expand(f, function (err, s) {
            if (err) { return callback(err) }
            size += s
            next()
          })
        }
        for (var i = 0; i < THREAD; i++) { next() }
      })
    }
  })
}

var ts = new Date()
expand('F:\\AmBuf_Product6', function (err, size) {
  if (err) {
    console.log(err.stack)
  }
  var te = new Date()
  console.log('Size: ' + size)
  console.log('Spent: ' + (te - ts))
})
