var gitjson = require('./index.js')
var assert = require('assert')
var git = gitjson()

  git.init()
  git.save('mydocument', {foo:'bar', val:2})
  git.add('mydocument')
  git.commit('first commit')

  git.save('plans', {baz:false})
  git.add('plans')
  git.save('mydocument', {foo:'bar',val:4})
  git.add('mydocument')
  git.commit('added plans, modified mydocument to val is 4')

  git.branch('test')
  git.checkout('test')
  git.save('mydocument',{foo:'bar',val:3})
  git.add('mydocument')
  git.commit('added one to val to make it 3')


  git.save('mydocument',{foo:'bar',val:3,txt:'hello'})
  git.add('mydocument')
  git.commit('Added hello text')

  git.log()

  var obj = git.checkout('master')
  console.log(obj)
  obj.mydocument.val = 99
  git.save('mydocument',obj.mydocument)
  git.add('mydocument')
  git.commit('commit to master val 99')
  git.log()
  
  var obj = git.checkout('b3a2f28d6c385b520f104d420286992c09f52653')
  console.log(obj)
  console.log(git)
  
/*
  git.merge('test')
  git.log()
*/
