var Immutable = require('immutable');
var _ = {
  mapValues: require('lodash/object/mapValues')
};

/////////////////////////////
// Data Model

var defaultText = function(){
  return Immutable.Map({
    value: 'bob'
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
  _addText: function(data, block, text, startIndex, endIndex, char) {
    return data.updateIn(['blocks', block, 'texts', text],function(textNode){
      var strArr = textNode.get('value').split("")
      strArr.splice(startIndex, endIndex - startIndex, char)
      str = strArr.join("");
      return textNode.set('value', str);
    });
  },
  _removeText: function(data, block, text, startIndex, endIndex, char){
    return data.updateIn(['blocks', block, 'texts', text],function(textNode){
      return textNode.set('value', textNode.get('value').slice(0,-1) );
    });
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