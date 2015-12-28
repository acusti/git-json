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

![Git-json Log Image](http://i.imgur.com/dQGB61Y.png)



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

Peforms a fast forward merge, non-ff conflictless merge. Supports detached merges as well.


.ancestor(branchname)
=====================

Returns true if current branch tip is upstream of branchname (i.e. "is branchname behind us"?)


.rebase(branchname)
===================

Rewinds head to tip of branchname and then rewrites / replays through to tip of current branh.


---

## Other useful functions ###

##### .config(obj)

Sets the git configuration. Typical use is 

    git.config({user:{email:'joe@bar.com',name:'Joe Bar'}})

##### .branch()

Returns the list of all branches and indicates which branch you are on.

##### .visual()

Show a tree-based visual representation of the repository

Contributions
=============

Please contribute, as I actively monitor discussions and pull requests. Note the TODO list

TODO
====

![Pencil Todo](http://i.imgur.com/7cCiqun.png) git remove  
![Pencil Todo](http://i.imgur.com/7cCiqun.png) treelib with commit hashes for visualizations  
![Pencil Todo](http://i.imgur.com/7cCiqun.png) NonFF merge with conflicts  
![Pencil Todo](http://i.imgur.com/7cCiqun.png) git rebase  

Recently added 
==============

* NonFF merge without conflicts

Thanks
======

\#git on freenode. 
trash icon provided by http://www.aspneticons.com/
Disk icon provided by  http://www.aha-soft.com

Copyright (C) 2016 David Wee

License MIT

