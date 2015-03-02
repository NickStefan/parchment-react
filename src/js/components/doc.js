var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');
var BlockView = require('./block');
var selectionUtil = require('./selection-util');

var DocView = React.createClass({
  componentDidMount: function(){
    window.addEventListener('keydown', this.preventBrowserBackspace );
  },
  componentWillUnmount: function(){
    window.removeEventListener('keydown',this.preventBrowserBackspace);
  },
  componentDidUpdate: function(){
    var selection = this.props.docState.get('selection');
    var range = document.createRange()
    var startIndex = selection.startIndex;
    var endIndex = selection.endIndex;

    // cant just use the ones in the old selection
    // as the the text nodes may have been recreated
    var baseNode = selectionUtil.getTextChildNode(selection.baseParentNode);
    var extentNode = selectionUtil.getTextChildNode(selection.extentParentNode);

    range.setStart(baseNode, startIndex);
    range.setEnd(extentNode, endIndex);
    
    var nativeSelection = window.getSelection();
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

    var docId = this.props.docState.get('docId')

    var selection = selectionUtil.selectionWrapper(window.getSelection());
    var docId1 = selection.docId1;
    var docId2 = selection.docId1;
    var block1 = selection.block1;
    var block2 = selection.block2;
    var text1 = selection.text1;
    var text2 = selection.text2;
    var startIndex = selection.startIndex; 
    var endIndex = selection.endIndex;

    if (docId1 !== docId2 || docId1 !== docId.toString()){
      // not this document being edited;
      return;
    }

    var simple = block1 === block1 && text1 === text2 && startIndex === endIndex;

    // SIMPLE INSERT
    if (simple && e.keyCode !== 8){
      AppActions.simpleInsert(selection, block1, block2, text1, text2, startIndex, endIndex, e.key);
    // SIMPLE DELETE
    } else if (simple && e.keyCode === 8){
      AppActions.simpleRemove(selection, block1, block2, text1, text2, startIndex, endIndex, e.key);
    }
  },

  ensureTextNode: function(e){
    selectionUtil.ensureTextNode(window.getSelection());
  },

  render: function(){
    var self = this;
    var docId = this.props.docState.get('docId');
    var blockStates = this.props.docState.get('blocks');
    var contentBlocks = this.props.doc.get('blocks')
    .toArray()
    // mutable array of immutables
    .map(function(block,i){
      return (
        <BlockView key={i} blockIndex={i} block={block}
        blockState={blockStates.get(i)} 
        docId={docId}></BlockView>
      )
    });

    return (
      <div onClick={this.ensureTextNode} tabIndex={-1} contentEditable={true} onKeyPress={this.type}>
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
