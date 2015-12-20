git-json
========


example
=======

    var git = require('git-json')
    
    git.init()

    git.add(obj)

    git.commit()

    git.pull()



.init
=====

Init will set HEAD to null.   


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
