var gitjson = require('../index.js')
var git = gitjson()
var assert = require('assert')

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
console.log(git.ancestor('test'))