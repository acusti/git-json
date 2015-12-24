var gitjson = require('./index.js')
var git = gitjson()

git.init()
var obj = {foo:'bar',val:'5'}
git.save('empty.txt',obj)
git.add('empty.txt')
git.commit('first commit')
git.log()

