//
// Simple counter, based on https://github.com/hughsk/node-counter
//
var EventEmitter = require('events').EventEmitter

module.exports = counter

function counter (progress = null) {
  if (!(this instanceof counter)) return new counter(progress)
  this.total = 0
  this.at = 0
  this.ready = false
  this.progress = progress
  this.progressTimer = null
  this.promises = []
  EventEmitter.prototype.constructor.apply(this, arguments)
}

counter.prototype = new EventEmitter()

counter.prototype.start = function (fn = null) {
  this.ready = true
  if (this.progress) {
    this.progressTimer = setInterval(() => {
      this.emit('progress')
    }, this.progress)
  }
  if (fn) {
    this.on('end', fn)
  }
  if (this.promises.length > 0) {
    Promise.all(this.promises).then(ary => {
      this.promises = []
      this.done(0)
    })
  } else {
    this.done(0)
  }
  return this
}

counter.prototype.todo = function (num = 1) {
  if (num instanceof Promise) {
    var c = this
    num.then(() => {
      c.done(1)
    })
    this.total += 1
    this.promises.push(num)
  } else {
    this.total += num
  }
  return this
}

counter.prototype.done = function (num = 1) {
  this.at += num
  if (this.ready) {
    if (this.at == this.total) {
      this.ready = false
      clearInterval(this.progressTimer)
      this.emit('end')
    }
    if (!this.progress) {
      this.emit('progress')
    }
  }
  return this
}
