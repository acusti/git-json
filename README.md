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


your new working and staging functions
======================================
This chart summarizes the functions you will use in working vs staging.

|      | Working | Staging |
|------|---------|---------|
|![save](http://i.imgur.com/osgHYPP.png) | **.save** | **.add** |
|![trash](http://i.imgur.com/CZO14tR.png)| **.delete** | **.remove** |

.log()
======

Produces a git log similar to git log --all --decorate

![Git-json Log Image]
(http://i.imgur.com/dQGB61Y.png)



.save(name,content)
===================

Save content under "file" name into the working directory


.add(name)
==========

Places "file" name into the staging index.

.delete(name)
=============

Delete content under "file" name from the working directory

.remove(name)
=============

Issues a Remove "file" name order into the staging index


.commit(message)
================

Peforms a commit with message



.branch(branchname)
===================

Create a branch with branchname



.checkout(branchname)
=====================

Returns the contents at the tip of branchname


.merge(branchname)
==================

Peforms a fast forward merge  (three way non-ff merge coming).
Supports detached merges as well.


.ancestor(branchname)
=====================

Returns true if current branch tip is upstream of branchname (i.e. "is branchname behind us"?)


.rebase(branchname)
===================

Rewinds head to tip of branchname and then rewrites / replays through to tip of current branh.


---

## Other useful functions ###
##### .branch()

Returns the list of all branches and indicates which branch you are on.




Thanks
======

\#git on freenode. 
trash icon provided by http://www.aspneticons.com/
Disk icon provided by  http://www.aha-soft.com

Copyright (C) 2016 David Wee

License MIT

