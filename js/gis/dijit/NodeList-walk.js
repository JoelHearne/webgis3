define(["dojo/query", "dojo/_base/lang", "dojo/NodeList-traverse"], function(query, lang) {

var NodeList = query.NodeList;

lang.extend(NodeList, {

_walk: function (node, func) {
func(node);
  console.log("NodeList 1");
  try {
	 var nc= query(node).children();
	 console.log("walk 1.1",nc);
     node = query(node).children().first()[0];
   } catch (ex){ console.log("error 1.2",ex); }
  console.log("NodeList 2");
while(node) {
	console.log("NodeList 3");
  this._walk(node, func);
  console.log("NodeList 4");
  node = query(node).next()[0];
  console.log("NodeList 5");
}
},

walk:  function (func) {
	console.log("NodeList 0.01",func);
  this.forEach(function (node) {
	console.log("NodeList 0.1",node);
    this._walk(node, func);
    console.log("NodeList 0.2");
  }, this);
}
});

return NodeList;
});