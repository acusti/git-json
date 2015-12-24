git-json
========


example
=======

    var gitjson = require('git-json')
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
    //  { mydocument: { foo: 'bar', val: 6 } }
    var obj3 = git.checkout('a56c7219c997d717b3ca9bdf859761d2895b64ea')
    // { mydocument: { foo: 'bar', val: '5' } }


.init
=====

Init will set HEAD to master and master to null


.commit
=======
  
commit forms a commit object:

      {
        tree: <abbreviated hash>,
        author: "David Wee <rook2pawn@gmail.com>",
        message: "my commit",
        hash: <hash>
      }
  
When a commit happens, 
  
* the HEAD pointer is retrieved for this author to form the parent commit, which
also fills in the 'tree' value. The first commit will have a null tree value. 

* each commit will also have a SHA key generated for it. This fills in the hash value.

* The HEAD pointer will then move to the SHA key for the commit that was just submitted.
        

HEAD
====
    
    Points to a commit of the last checked out state


TODO
====


checkout for specific documents

Error responses and method

Streaming interfaces for logs/api, async interface for actual db



