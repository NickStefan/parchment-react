var Immutable = require('immutable');
var _ = {
  mapValues: require('lodash/object/mapValues')
};

/////////////////////////////
// Data Model

var defaultText = function(){
  return Immutable.Map({
    value: ""
  });
}

var defaultBlock = function(){
  return Immutable.Map({
    type: 'paragraph',
    texts: Immutable.List([ defaultText() ])
  });
}

var defaultData = function() {
  return Immutable.Map({
    'blocks': Immutable.List([ defaultBlock() ])
  });
};

var data = defaultData();

/////////////////////////////
// Private Data Methods
var storeMethods = {
  _simpleInsert: function(data, selection, block1, block2, text1, text2, startIndex, endIndex, chr) {
    // splice new character in at the index
    return data.updateIn(['blocks', block1, 'texts', text1],function(textNode){
      var strArr = textNode.get('value').split("");
      strArr.splice(startIndex, endIndex - startIndex, chr);
      str = strArr.join("");
      return textNode.set('value', str);
    });
  },
  _simpleRemove: function(data, selection, block1, block2, text1, text2, startIndex, endIndex, chr){
    var startIndex = startIndex - 1;
    var chr = "";
    // essentually splice a blank character to overwrite one character back
    return this._simpleInsert(data, selection, block1, block2, text1, text2, startIndex, endIndex, chr);
  }

}

// map the invoked arguments to the expected arguments defined above.
// this is a convenience to keep actions, dispatchers, etc generic
// up until actually invoking the store methods above
// example: 
// invoked in the dispatcher as:
//   store.Method(store1, args); 
// invokes the methods defined above as
//   store.Method(store1, args[0], args[1] ... etc )
storeMethods = _.mapValues(storeMethods, function(fn,fnName,classObj) {
  return function(){
    var store = arguments[0];
    arguments[1] = arguments[1] || [];
    var dispatchedArgs = arguments[1].length ? arguments[1] : undefined;
    var args = [ store ].concat(dispatchedArgs);
    return fn.apply(classObj, args);
  };
});

module.exports = {
  storeMethods: storeMethods,
  data: data
};