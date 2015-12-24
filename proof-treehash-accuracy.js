
// git init
// touch empty.txt
// git add .
// git commit -m 'first commit'


var crypto = require('crypto')
var shasum = crypto.createHash('sha1')     
var shakey = shasum.update('blob 0\0').digest('hex')

// git ls-tree HEAD
// 100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391  empty.txt


//  find .git/objects/ -type f
//
// .git/objects/93/d7495093d727c8d5bf320c51f0b4018fb6aac7
// .git/objects/e6/9de29bb2d1d6434b8b29ae775ad8c2e48c5391
// .git/objects/70/15cf066692cff6f1cc228eeb31632b73cef98a


// we can see our blob in the middle e6/9de29bb2 ...
// 
// git cat-file -t 7015cf066692cff6f1cc228eeb31632b73cef98a
// tree
// 
// git cat-file -t 93d7495093d727c8d5bf320c51f0b4018fb6aac7
// commit


// so our desired tree hash 7015cf066692cff6f1cc228eeb31632b73cef98a

var genHash = function(n) {
  var head_buf = new Buffer('tree '.concat(n).concat('\0').concat('100644 empty.txt\0'))
  var sha_buf = new Buffer(shakey,'hex')

  var buffers = [head_buf,sha_buf]
  var totalLength = 0;
  for (var i = 0; i < buffers.length; i++) {
    totalLength += buffers[i].length;
  }

  var tree_buf = Buffer.concat([head_buf,sha_buf],totalLength)
  var shasum2 = crypto.createHash('sha1')     
  return shasum2.update(tree_buf).digest('hex')
}

  console.log(genHash(37))

// 7015cf066692cff6f1cc228eeb31632b73cef98a


