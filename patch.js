var jp = require('fast-json-patch')



var objA = {user: {firstName: "Albert", lastName: "Einstein"}};
var objB = {user: {firstName: "Albert", lastName: "Collins"}};
var diff = jp.compare(objA, objA);
//diff == [{op: "replace", path: "/user/lastName", value: "Collins"}]
console.log(diff)
