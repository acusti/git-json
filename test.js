var gitjson = require('./index.js')
var assert = require('assert')
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

