var gitjson = require('./index.js')
var git = gitjson()

git.init()
var obj = {foo:'bar',val:'5'}
git.save('mydocument',obj)
git.add('mydocument')
git.commit('first commit')
git.log()


obj.val = 6;
git.save('mydocument',obj)
git.commit('second commit')


