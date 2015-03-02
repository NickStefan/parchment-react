var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var BlockView = require('./block');

function getTextChildNode(node){
    if (node.nodeType === 3){
        return node;
    } else if (node.childNodes.length){
        for (var i = 0; i < node.childNodes.length; i++){
            return getTextChildNode(node.childNodes[i]);
        }
    }
}

var DocView = React.createClass({
  componentDidMount: function(){
    window.addEventListener('keydown', this.preventBrowserBackspace );
  },
  componentWillUnmount: function(){
    window.removeEventListener('keydown',this.preventBrowserBackspace);
  },
  componentDidUpdate: function(){
    var selection = this.props.docState.get('selection');
    var nativeSelection = this.props.docState.get('selection').get('nativeSelection');
    var range = document.createRange()
    var startIndex = selection.get('startIndex');
    var endIndex = selection.get('endIndex');
    var baseNode = getTextChildNode(nativeSelection.baseNode);
    var extentNode = getTextChildNode(nativeSelection.extentNode);
    range.setStart(baseNode, startIndex);
    range.setEnd(extentNode, endIndex);
    
    nativeSelection.removeAllRanges();
    nativeSelection.addRange( range );
  },


  preventBrowserBackspace: function(e){
    // this swallows backspace keys on any non-input element.
    // prevent browser's backspace from popping browser history stack
    var regex = /INPUT|SELECT|TEXTAREA/i;
    if( e.which == 8 ){ // 8 == backspace
      if(!regex.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
          e.preventDefault();
          e.stopPropagation();
          this.type(e);
      }
    }
  },

  type: function(e){
    e.stopPropagation();
    e.preventDefault();
    var block = this.props.docState.get('selection').get('block');
    var text = this.props.docState.get('selection').get('text');
    var nativeSelection = this.props.docState.get('selection').get('nativeSelection');
    var startIndex = nativeSelection.baseOffset;
    var endIndex = nativeSelection.extentOffset;

    // delete key with a caret
    if (e.keyCode === 8 && nativeSelection.type === 'Caret'){
      AppActions.typeStuff(block, text, startIndex - 1, endIndex, "");
    // anything else
    } else {
      AppActions.typeStuff(block, text, startIndex, endIndex, e.key);
    }
  },

  render: function(){
    var self = this;
    var blockStates = this.props.docState.get('blocks');
    var contentBlocks = this.props.doc.get('blocks')
    .toArray()
    // mutable array of immutables
    .map(function(block,i){
      return (
        <BlockView key={i} blockIndex={i} block={block} blockState={blockStates.get(i)}></BlockView>
      )
    });

    return (
      <div tabIndex={-1} contentEditable={true} onKeyPress={this.type}>
        { contentBlocks }
      </div>
    )
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.docState === nextProps.docState &&
        this.props.doc === nextProps.doc) {
      return false;
    }
    return true;
  }

});

module.exports = DocView;
