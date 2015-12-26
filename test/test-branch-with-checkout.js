var test = require('tape')

test('branch with checkout test',function(assert) {
var gitjson = require('../index.js')
var git = gitjson()
assert.plan(1)
git.init()
git.save('mydocument', {foo:'bar', val:2})
git.add('mydocument')
git.commit('first commit')

git.branch('test')
git.checkout('test')
git.save('mydocument',{foo:'bar',val:3})
git.add('mydocument')
git.commit('added one to val to make it 3')


var obj = git.checkout('test')
assert.equal(obj['mydocument'].val, 3)
git.log()
})


// repeat in git

// git init
// echo "foobar" > README
// git add .
// git commit -m 'first commit'

// git branch test
// git checkout test
// echo "baz" >> README
// git commit -a -m 'second commit added baz'

//  
// (README should have baz)


