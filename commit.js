var jp = require('fast-json-patch')
/*
var a = {mydoc:{foo:'bar',val:23}}
var b = {plans:{baz:true}}

var diff = jp.compare(a,b)
console.log(diff)

*/


var a = {mydoc:{foo:'bar',val:23}}
var b = {plans:{baz:true},mydoc:{val:24}}

var diff = jp.compare(a,b)
console.log(diff)

