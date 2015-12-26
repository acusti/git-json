var test = require('tape')
var gitjson = require('../index.js')
var git = gitjson()

test('checkout with no arguments restores working directory',function(assert) {
assert.plan(1)
git.init()
git.save('mydocument', {foo:'bar', val:2})
git.add('mydocument')
git.commit('first commit')

git.branch('test')
git.checkout('test')
git.save('mydocument',{foo:'bar',val:3})
git.add('mydocument')
git.commit('added one to val to make it 3')


var obj = git.checkout()
assert.equal(obj['mydocument'].val, 3)
git.log()

// this test is for checkout without arguments after named checkout

})
