var Immutable = require('immutable');
var _ = {
  mapValues: require('lodash/object/mapValues')
};

/////////////////////////////
// State Model

var defaultText = function(){
  return Immutable.Map({
    selectionStart: null,
    selectionEnd: null
  });
}

var defaultLine = function(){
  return Immutable.Map({
    texts: Immutable.List([ defaultText() ])
  });
}

var defaultBlock = function(){
  return Immutable.Map({
    type: 'paragraph',
    lines: Immutable.List([ defaultLine() ])
  });
}

var defaultState = function() {
  return Immutable.Map({
    'blocks': Immutable.List([ defaultBlock() ]),
    selected: Immutable.Set()
  });
};

var state = defaultState();

/////////////////////////////
// Private State Methods
var stateMethods = {
  _setCursor: function(state, block, line, text, startIndex, endIndex) {
    state = state.updateIn(['selected'],function(selected){

      return selected.clear().add({
        block: block, line: line, text: text, startIndex: startIndex, endIndex: endIndex
      });
    });
    return state.updateIn(['blocks', block, 'lines', line, 'texts', text],function(textNode){
      return textNode
      .set('selectionStart', startIndex )
      .set('selectionEnd', endIndex );
    });
  },

  _moveCursor: function(state){
    var furthest = state.get('selected')
    .toArray()
    .sort(function(a,b){
      a = a.block + "_" + a.line + "_" + a.text + "_" + a.endIndex + "_";
      b = b.block + "_" + b.line + "_" + b.text + "_" + b.endIndex + "_";
      return a > b ? -1 : 1;
    });
    furthest = furthest[furthest.length - 1];
    var block = furthest.block, line = furthest.line, text = furthest.text,
    startIndex = furthest.startIndex, endIndex = furthest.endIndex;

    return state.updateIn(['selected'],function(selected){
      return selected
      .remove(furthest)
      .add({block: block, line: line, text: text,
        startIndex: startIndex + 1,
        endIndex: endIndex + 1
      });
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
stateMethods = _.mapValues(stateMethods, function(fn,fnName,classObj) {
  return function(){
    var store = arguments[0];
    arguments[1] = arguments[1] || [];
    var dispatchedArgs = arguments[1].length ? arguments[1] : undefined;
    var args = [ store ].concat(dispatchedArgs);
    return fn.apply(classObj, args);
  }
});

module.exports = {
  stateMethods: stateMethods,
  state: state
}