var test = require('tape')
var gitjson = require('../index.js')
var git = gitjson()

test('merge fastforward test',function(assert) {
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

git.log()
//assert.equal(true,git.ancestor('master'))
console.log(git.ancestor('master'))
git.merge('master')
git.log()
assert.equal(git.refs['test'], git.refs['master'])
})