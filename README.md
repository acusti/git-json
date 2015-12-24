[![Build Status](https://travis-ci.org/rook2pawn/git-json.svg?branch=master)](https://travis-ci.org/rook2pawn/git-json)

git-json
========

    var gitjson = require('git-json')
    var git = gitjson()
  
    git.init()
    git.save('mydocument',{foo:'bar',val:2})
    git.add('mydocument')
    git.commit('first commit')
    git.log()


.save(name,content)
===================

Save content under "file" name into the working directory


.add(name)
==========

Places "file" name into the staging index.


.commit(message)
=========

Peforms a commit with message



.branch(branchname)
===================

Create a branch with branchname



.checkout(branchname)
=====================

Returns the contents at the tip of branchname


.merge(branchname)
==================

Peforms a fast forward merge and replays the common ancestor of branchname and current branch 


.rebase(branchname)
===================

Rewinds head to tip of branchname and then rewrites / replays through to tip of current branh.
