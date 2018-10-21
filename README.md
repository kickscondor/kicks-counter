[DEPRECATED]
============

**THIS MODULE HAS BEEN SUPERCEDED BY THE
[KICKTOCK](https://github.com/kickscondor/kicktock) MODULE.**

Track the progress of sets of callbacks or Promises.

```
npm install --save kicks-counter
```

For Callbacks
-------------

To track the progress of a callback, create a counter:

```
const counter = require('kicks-counter')
var count = counter()
```

Then, for every callback you initiate, call `todo` before the callback -
and `done` at the conclusion of the callback.

```
files.forEach(path => {
  count.todo()
  fs.readFile(path, (err, data) => {
    // Do things here
    count.done()
  })
})
```

You can also provide `todo` with a complete count before initiating the
callbacks:

```
count.todo(files.length)
files.forEach(path => {
  fs.readFile(path, (err, data) => {
    // Do things here
    count.done()
  })
})
```

When the progress is complete, an 'end' event will be sent. Be sure to set
up this event and start the counter.

```
count.on('end', () => {
  console.log('DONE')
})
count.start()
```

You can also track progress with the 'progress' event.

```
count.on('progress', () => {
  console.log(`Completed ${count.at} of ${count.total} tasks.`)
})
```

By default, the progress function will fire for every item. You can also use
a timer if you supply a microsecond count when you create the counter.

```
// Progress events will occur once per second
var count = counter(1000)
```

For Promises
------------

Similarly, setup the counter.

```
const counter = require('kicks-counter')
var count = counter()
```

Now add each promise to the counter.

```
count.todo(Promise.resolve(3))
count.todo(new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, 'foo')
})
```

And add the events and 'start' call.

```
count.on('end', () => {
  console.log('DONE')
count.start()
```

Passing the End Event to Start()
--------------------------------

You can also just supply an 'end' callback right to the `start()` method:

```
count.start(() => {
  console.log('DONE')
})
```

That's it! Enjoy.
