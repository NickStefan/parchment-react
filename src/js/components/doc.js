var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');
var BlockView = require('./block');

var DocView = React.createClass({
  componentDidMount: function(){
    window.addEventListener('keydown', this.preventBrowserBackspace );
  },
  componentWillUnmount: function(){
    window.removeEventListener('keydown',this.preventBrowserBackspace);
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

  clearSelection: function(e){
    var cursor = document.getElementsByClassName('cursor')[0];
    if (cursor){
      document.getElementsByTagName('BODY')[0].removeChild(cursor);
    }
  },

  setSelection: function(e){
    var selection = window.getSelection();
    if (selection.rangeCount && selection.isCollapsed){
      var isCollapsed = true;
      var span = e.target;
      var attr = this.getAttributes(span);
      var r = {
        startBlock: attr['block-index'],
        endBlock: attr['block-index'],
        startSpan: attr['span-index'],
        endSpan: attr['span-index']
      }
      AppActions.setSelection(r.startBlock, r.endBlock, r.startSpan, r.endSpan, selection.baseOffset, selection.extentOffset, isCollapsed);
    }
  },

  getAttributes: function(node){
    var attributes = {};
    for (var i = 0; i < node.attributes.length; i++){
      var attr = node.attributes[i];
      attributes[ attr.name.replace(/^data-/,"") ] = attr.value;
    }
      return attributes;
  },

  type: function(e){
    e.stopPropagation();
    e.preventDefault();

    // SIMPLE INSERT
    if (simple && e.keyCode !== 8){
      AppActions.simpleInsert(startBlock, endBlock, startSpan, endSpan, startIndex, endIndex, e.key);
    // SIMPLE DELETE
    } else if (simple && e.keyCode === 8){
      AppActions.simpleRemove(startBlock, endBlock, startSpan, endSpan, startIndex, endIndex, e.key);
    }
  },

  render: function(){
    var self = this;
    var docState = this.props.docState;
    var docId = this.props.docState.get('docId');
    var blockStates = this.props.docState.get('blocks');
    var contentBlocks = this.props.doc.get('blocks')
    .toArray()
    // mutable array of immutables
    .map(function(block,i){
      return (
        <BlockView key={i} blockIndex={i} block={block}
        blockState={blockStates.get(i)} docState={docState}
        docId={docId}></BlockView>
      )
    });

    return (
      <div onMouseDown={this.clearSelection} onMouseUp={this.setSelection} tabIndex={-1} onKeyPress={this.type}>
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
