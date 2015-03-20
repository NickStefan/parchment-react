var Immutable = require('immutable');
var _ = {
  mapValues: require('lodash/object/mapValues'),
  random: require('lodash/number/random')
};

/////////////////////////////
// Data Model

var defaultSpan = function(){
  return Immutable.Map({
    value: "bob is a cat. he has a hat. he hated cats. this is the end of the story."
  });
}

var defaultBlock = function(){
  return Immutable.Map({
    type: 'paragraph',
    spans: Immutable.List([ defaultSpan() ])
  });
}

var defaultData = function() {
  return Immutable.Map({
    'blocks': Immutable.List([ defaultBlock() ]),
    'docId': _.random(0,1000000000).toString(),
    'startBlock': null,
    'endBlock': null,
    'startSpan': null,
    'endSpan': null,
    'startOffset': null,
    'endOffset': null,
    'isCollapsed': null
  });
};

var data = defaultData();

/////////////////////////////
// Private Data Methods
var storeMethods = {

  _setSelection: function(data, startBlock, endBlock, startSpan, endSpan, startOffset, endOffset, isCollapsed){
    return data
    .set('startBlock', startBlock)
    .set('endBlock', endBlock)
    .set('startSpan', startSpan)
    .set('endSpan', endSpan)
    .set('startOffset', startOffset)
    .set('endOffset', endOffset)
    .set('isCollapsed', isCollapsed);
  },

  _typing: function(data, chr) {
    var startOffset = data.get('startOffset');
    var endOffset = data.get('endOffset');
    var indexChange;
    var collapsedDelete = false;

    if (chr === undefined){
      indexChange = 0;
    }
    if (chr === undefined && startOffset === endOffset){
      startOffset = startOffset - 1;
      indexChange = 0;
    }
    if (chr && chr.length){
      indexChange = chr.length;
    }

    // splice new character in at the index
    data = data.updateIn(['blocks', data.get('startBlock'), 'spans', data.get('startSpan')],function(textNode){
      var strArr = textNode.get('value').split("");
      strArr.splice(startOffset, endOffset - startOffset, chr);
      str = strArr.join("");
      return textNode.set('value', str);
    });

    return data
    .set('endOffset', parseInt(startOffset) + indexChange)
    .set('startOffset', parseInt(startOffset) + indexChange)
    .set('isCollapsed', true);
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