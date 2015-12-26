var test = require('tape')
var m = require('../lib/threewaymerge')

test('threewaymerge remover test', function(assert) {
  assert.plan(1)
var a = {foo:'bar', val:2}
var b = {foo:'bar',val:3, txt:'hello'}
var ancestor = { foo:'bar' }

// first generate two diff sets
var diffA = m.diff(ancestor,a)
var diffB = m.diff(ancestor,b)
// reduce two changes that are identical to one change
var reduced = m.reducer(diffA,diffB)

console.log("reduced set:", reduced)

var conflicts = m.conflict(reduced)
console.log("conflicts:",conflicts)

// subtract the conflicts
var finalset = m.remover(reduced,conflicts)
console.log("final set:", finalset)
assert.deepEqual([ { op: 'add', path: '/txt', value: 'hello' } ],finalset)

})
