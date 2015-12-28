var test = require('tape')
var gitjson = require('../index.js')
var git = gitjson()

test('merge no-fastforward,no conflicts test',function(assert) {

  assert.plan(2)
// this is code largely from the ancestor is not upstream test
  git.init()
  git.save('mydocument', {foo:'bar', val:2})
  git.add('mydocument')
  git.commit('first commit')

  git.branch('test')
  git.checkout('test')
  git.save('mydocument',{foo:'bar',val:3})
  git.add('mydocument')
  git.commit('added one to val to make it 3')

  git.save('mydocument',{foo:'bar',val:99,user:{name:'beans'}})
  git.add('mydocument')
  git.commit('changed val to 99')

  var obj = git.checkout('master')
  obj.mydocument.val = 99
  git.save('mydocument',obj.mydocument)
  git.save('anotherdoc',{x:42})
  git.add('mydocument')
  git.add('anotherdoc')
  git.commit('commit to master val 99,anotherdoc')
// at this point
//test: { mydocument: { foo: 'bar', val: 99, user: { name: 'beans' } } }
//HEAD (master): { mydocument: { foo: 'bar', val: 99 }, anotherdoc: { x: 42 } }
//ancestor: { mydocument: { foo: 'bar', val: 2 } }

  var results = git.merge('test')
  assert.deepEqual([],results.conflicts)
  assert.equals(3, results.reduced.length)
  console.log("results of merge:", results)
  var obj = git.checkout('master') 
  console.log("New master:", obj)
  git.log()
})
