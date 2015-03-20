var React = require('react/dist/react-with-addons.js');
var _ = {
  last: require('lodash/array/last')
};
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var SpanView = React.createClass({
  componentDidUpdate: function(){
    this.setCursor();
  },

  setCursor: function() {
    // if cursor
    if (this.props.docState.get('isCollapsed') && this.props.docState.get('startSpan') === this.props.spanIndex.toString()){
      var span = this.getDOMNode();
      // get the selection's exact end point, where cursor should go
      var selection = document.getSelection();
      var range = document.createRange();
      range.setStart(this.getTextChildNode(span), 0);
      range.setEnd(this.getTextChildNode(span), this.props.docState.get('endOffset'));
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
      cursor.style.left = _.last(selectionLines).width.toString() + 'px';
      cursor.style.height = _.last(selectionLines).height.toString() + 'px';

      selection.removeAllRanges();
    }
  },

  getTextChildNode: function(node){
    if (node.nodeType === 3){
        return node;
    } else if (node.childNodes.length){
        for (var i = 0; i < node.childNodes.length; i++){
            return this.getTextChildNode(node.childNodes[i]);
        }
    }
  },

  render: function(){
    var value = this.props.span.get('value');
    var blockIndex = this.props.blockIndex;
    var spanIndex = this.props.spanIndex;
    var docId = this.props.docId;

    return (
      <span data-span-index={spanIndex} data-block-index={blockIndex} 
      data-doc-id={docId}>
        { value }
      </span>
    )
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.spanState === nextProps.spanState
    && this.props.docState === nextProps.docState
    && this.props.span === nextProps.span) {
      return false;
    }
    return true;
  }
});

module.exports = SpanView;