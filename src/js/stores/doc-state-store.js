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

var defaultBlock = function(){
  return Immutable.Map({
    type: 'paragraph',
    texts: Immutable.List([ defaultText() ])
  });
}

var defaultState = function() {
  return Immutable.Map({
    'blocks': Immutable.List([ defaultBlock() ]),
    'selection': Immutable.Map({
      'block': null,
      'text': null,
      'nativeSelection': null
    })
  });
};

var state = defaultState();

/////////////////////////////
// Private State Methods
var stateMethods = {
  _setCursor: function(state, block, text, selection) {
    return state = state.updateIn(['selection'],function(selectionObj){
      return selectionObj
      .set('block',block)
      .set('text',text)
      .set('startIndex', selection.baseOffset)
      .set('endIndex', selection.extentOffset)
      .set('nativeSelection', selection);
    });
  },

  _setSelection: function(state, block, text, startIndex, block2, text2, endIndex, char) {
    var range = document.createRange()
    range.setStart(node1, start);
    range.setEnd(node2, end);
    var sel = window.getSelection()
    sel.removeAllRanges();
    sel.addRange( range );
    return sel; 
  },

  _moveCursor: function(state){
    return state;
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