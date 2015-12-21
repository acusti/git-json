var gitjson = require('./index.js')
var git = gitjson()

git.init()
git.commit('My first commit')
git.log()
