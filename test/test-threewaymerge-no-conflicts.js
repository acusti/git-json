var test = require('tape')
var m = require('../lib/threewaymerge')

test('threewaymerge no conflict test',function(assert) {
assert.plan(3)

var a = {foo:'bar', val:2}
var b = {foo:'bar',val:2, txt:'hello'}
var ancestor = { foo:'bar' }

// first generate two diff sets
var diffA = m.diff(ancestor,a)
var diffB = m.diff(ancestor,b)

// reduce two changes that are identical to one change
console.log("DiffA:", diffA, " diffB:", diffB)
var reduced = m.reducer(diffA,diffB)
console.log("reduced set:", reduced)

assert.deepEqual([ { op: 'add', path: '/val', value: 2 },  { op: 'add', path: '/txt', value: 'hello' } ],reduced)

var conflicts = m.conflict(reduced)
console.log("conflicts:",conflicts)
assert.deepEqual([],conflicts,'there should be no conflicts')

var finalset = m.reducer(reduced,conflicts)
console.log("final set:", finalset)
assert.deepEqual([ { op: 'add', path: '/val', value: 2 },
  { op: 'add', path: '/txt', value: 'hello' } ],finalset)
})
