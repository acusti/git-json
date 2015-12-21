var gitjson = require('./index.js')
var git = gitjson()

git.init()

var obj = {foo:'bar', val:5}
git.save('mydocument',obj)
git.add('mydocument',obj)
git.commit('My first commit')
git.log()
