var gitjson = require('./index.js')
var git = gitjson()

git.init()

var obj = {foo:'bar', val:5}
git.save('mydocument',obj)
git.add('mydocument')
git.commit('My first commit')
git.log()


obj.val = 6;
git.save('mydocument',obj)
git.commit('My second commit')
git.log()
