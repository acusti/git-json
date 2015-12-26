var test = require('tape')
var gitjson = require('../index.js')


test('branch but do not checkout ensure commits go to HEAD', function(assert) {
assert.plan(1)
var git = gitjson()
git.init()
git.save('mydocument', {foo:'bar', val:2})
git.add('mydocument')
git.commit('first commit')

git.branch('test')
git.save('mydocument',{foo:'bar',val:3})
git.add('mydocument')
git.commit('added one to val to make it 3')


var obj = git.checkout('test')
assert.equal(obj['mydocument'].val, 2)
git.log()
})


// repeat in git

// git init
// echo "foobar" > README
// git add .
// git commit -m 'first commit'

// git branch test
// echo "baz" >> README
// git commit -a -m 'second commit added baz'

// git checkout test
//  
// (README should not have baz)


