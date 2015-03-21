var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');
var BlockView = require('./block');

var _ = {
  last : require('lodash/array/last')
}

var u_ = {
  getTextChildNode: function(node){
    if (node.nodeType === 3){
        return node;
    } else if (node.childNodes.length){
        for (var i = 0; i < node.childNodes.length; i++){
            return u_.getTextChildNode(node.childNodes[i]);
        }
    }
  },
  getClassIds: function(node){
    var classes = {};
    var classNames = node.className.split(" ");
    for (var i = 0; i < classNames.length; i++){
      var cls = classNames[i];
      if (/^blockId_/.test(cls) || /^spanId_/.test(cls)){
        var key = cls.replace(/\d+|_/g,"");
        var val = cls.replace(/\D+/,"");
        classes[key] = val;
      }      
    }
    return classes;
  }
};

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
          this.typing(e);
      }
    }
  },

  componentDidUpdate: function(){
    this.setCursor();
  },
  setCursor: function() {
    // if cursor
    if (this.props.doc.get('isCollapsed')){
      var spanId = this.props.doc.get('startSpan');
      var blockId = this.props.doc.get('startBlock');
      var classes = 'blockId_' + blockId + ' ' + 'spanId_' + spanId;
      var span = document.getElementsByClassName(classes)[0];

      // get the selection's exact end point, where cursor should go
      var selection = document.getSelection();
      var range = document.createRange();
      range.setStart(u_.getTextChildNode(span), 0);
      range.setEnd(u_.getTextChildNode(span), this.props.doc.get('endOffset'));
      selection.removeAllRanges();
      selection.addRange(range);
      var selectionLines = selection.getRangeAt(0).getClientRects();
      
      // create or get the cursor node
      var cursor = document.getElementsByClassName('cursor')[0];
      if (!cursor){
        cursor = document.createElement('SPAN');
        document.getElementsByTagName('BODY')[0].appendChild(cursor);
        cursor.className = 'cursor';
        
        // get the cursor to smoothly blink
        setTimeout(function(){
          if (cursor.style.visibility === 'visible'){
            cursor.style.visibility = 'hidden';
          } else {
            cursor.style.visibility = 'visible';
          }
        },0);
        setInterval(function(){
          if (cursor.style.visibility === 'visible'){
            cursor.style.visibility = 'hidden';
          } else {
            cursor.style.visibility = 'visible';
          }
        },500);
      }

      cursor.style.top = _.last(selectionLines).top.toString() + 'px'; 
      cursor.style.left = _.last(selectionLines).right.toString() + 'px';
      cursor.style.height = _.last(selectionLines).height.toString() + 'px';

      selection.removeAllRanges();
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
    // A single caret
    if (selection.rangeCount && selection.isCollapsed){
      var isCollapsed = true;
      var span = e.target;
      var c = u_.getClassIds(span);
      var r = {
        startBlock: c.blockId,
        endBlock: c.blockId,
        startSpan: c.spanId,
        endSpan: c.spanId
      }
      AppActions.setSelection(r.startBlock, r.endBlock, r.startSpan, r.endSpan, selection.baseOffset, selection.extentOffset, isCollapsed);
    
    // a range
    } else if (selection.rangeCount) {
      var isCollapsed = false;
      var r = selection.getRangeAt(0);
      var startBlock = u_.getClassIds(r.startContainer.parentNode).blockId;
      var endBlock = u_.getClassIds(r.endContainer.parentNode).blockId;
      var startSpan = u_.getClassIds(r.startContainer.parentNode).spanId;
      var endSpan = u_.getClassIds(r.endContainer.parentNode).spanId;
      var startOffset = r.startOffset;
      var endOffset = r.endOffset;

      AppActions.setSelection(startBlock, endBlock, startSpan, endSpan, startOffset, endOffset, isCollapsed);
    }
  },

  typing: function(e){
    e.stopPropagation();
    e.preventDefault();
    AppActions.typing(e.key);
  },

  render: function(){
    var self = this;
    var docId = this.props.doc.get('docId');
    var contentBlocks = this.props.doc.get('blocks')
    .toArray()
    // mutable array of immutables
    .map(function(block,i){
      return (
        <BlockView
          key={i}
          blockIndex={i}
          block={block}
          docId={docId}>
        </BlockView>
      )
    });

    return (
      <div
        onMouseDown={this.clearSelection}
        onMouseUp={this.setSelection}
        tabIndex={-1} onKeyPress={this.typing}>
          { contentBlocks }
      </div>
    )
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.doc === nextProps.doc) {
      return false;
    }
    return true;
  }

});

module.exports = DocView;
