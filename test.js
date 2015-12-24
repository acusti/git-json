var gitjson = require('./index.js')
var git = gitjson()

git.init()
var obj = {foo:'bar',val:'5'}
git.save('mydocument',obj)
git.add('mydocument')
git.commit('first commit')
git.log()


obj.val = 6;
git.save('mydocument',obj)
// nothing to commit, nothing has been staged
git.commit('second commit')

git.add('mydocument')
git.commit('second commit')
// now it works

git.log()
/*
commit e89ee1cd307bb9c10a78ef1a6949a7f2635cd09c (master,HEAD)
Author: David Wee <rook2pawn@gmail.com> 1450796299 -0800
Date: Wed Dec 23 2015 18:30:08 GMT-0800 (PST)

    second commit
commit a56c7219c997d717b3ca9bdf859761d2895b64ea
Author: David Wee <rook2pawn@gmail.com> 1450796299 -0800
Date: Wed Dec 23 2015 18:30:08 GMT-0800 (PST)

    first commit
*/

var obj2 = git.checkout()
console.log("obj2:", obj2)

git.branch('baz')
//git.checkout('baz')
git.log()
console.log(git.refs)
