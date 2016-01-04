var gitjson = require('../index.js')
var assert = require('assert')
var test = require('tape')
var treelib = require('treelib')


test('test rebase',function(assert) {
  assert.plan(1)
  var git = gitjson()
  //testing rebase
  git.init()

  //A
  git.save('mydoc',{foo:'bar'})
  git.add('mydoc')
  git.commit('first commit into master')

  //B
  git.save('bigplans',{baz:19})
  git.add('bigplans')
  git.commit('second commit into master')

  //W
  git.branch('topic')
  var obj = git.checkout('topic')
  obj.bigplans.baz--
  git.save('bigplans',obj.bigplans)
  git.add('bigplans')
  git.commit('first commit into topic branch bz is 18')

  //X
  obj.bigplans.baz--
  git.save('bigplans',obj.bigplans)
  git.add('bigplans')
  git.commit('second commit into topic branch bz is 17')


  //Y
  obj.bigplans.baz--
  git.save('bigplans',obj.bigplans)
  git.add('bigplans')
  git.commit('third commit into topic branch bz is 16')

  //C
  var obj = git.checkout('master')
  git.save('anotherdoc',{berry:true,count:0})
  git.add('anotherdoc')
  git.commit('third commit into master')

  //D 
  git.save('anotherdoc',{berry:true,count:1})
  git.add('anotherdoc')
  git.commit('fourth commit into master')

  /*

  A -> B -> C -> D      master
       \
        \_ W -> X -> Y  topic

  */

  git.checkout('topic')
  git.rebase('master')
  git.visual()
  git.log()
  var mytree = treelib()
  mytree.setTree(git.visualtree)
  assert.equals(mytree.checkPath('dc57103ee7f8c5c16091067962f84717e68abb46/1cf7d4e448eb0006f8c5989ae887c0630478a8ce/5ea0d30a839222ef088068561b9a9f1ada81f1e0/7880388867b39024d469b07c3b5b3cbe73790e31/259c9dbc467ad6dfbd4ccafa6aafe3a8e858a116/c05c403089c6e7f3ce3d76708930669dd0fe6ce4/b5cf769c4f8f5a89e840c795fcb546a9f6c0a8d9').depth,7)
})
