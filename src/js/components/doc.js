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

  cursor: function(e){
    e.stopPropagation();
    e.preventDefault();

    var range = window.getSelection();
    if (range.rangeCount){
      var r = selectionUtil.getRangeIndexes(range);
      AppActions.setSelection(r.startBlock, r.endBlock, r.startSpan, r.endSpan, r.startIndex, r.endIndex);
    
    } else {
      var r = selectionUtil.getCursorIndexes(e, this.props.docState.get('docId'));
      AppActions.setSelection(r.startBlock, r.endBlock, r.startSpan, r.endSpan, r.startIndex, r.endIndex);
    }
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
      <div>
        <div onMouseUp={this.cursor} tabIndex={-1} onKeyPress={this.type}>
          { contentBlocks }
        </div>
        <span className={"testSize" + docId}></span>
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
