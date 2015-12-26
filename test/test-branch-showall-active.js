var test = require('tape')
var gitjson = require('../index.js')
var git = gitjson()

test('branch with no arguments, no test just visual inspection', function(assert) {
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
assert.comment("Visually inspect the branch command with no arguments produces a master and test with test marked active branch")
var x = git.branch()
assert.comment(x)
assert.pass("Manual pass")
assert.end()
})
