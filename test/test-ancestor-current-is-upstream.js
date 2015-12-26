var test = require('tape')
var gitjson = require('../index.js')

test('ancestor test check that current is upstream',function(assert) {
assert.plan(2)
var git = gitjson()
git.init()
git.save('mydocument', {foo:'bar', val:2})
git.add('mydocument')
git.commit('first commit')

git.branch('test')
git.checkout('test')
git.save('mydocument',{foo:'bar',val:3})
git.add('mydocument')
git.commit('added one to val to make it 3')

git.log()
assert.equal(true,git.ancestor('master'))
assert.equal(true,git.ancestor('test'))
})
