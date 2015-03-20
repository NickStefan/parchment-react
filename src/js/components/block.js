var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');
var SpanView = require('./span');

var BlockView = React.createClass({
  render: function(){
    var blockIndex = this.props.blockIndex;
    var docId = this.props.docId;
    var docState = this.props.docState;
    var spanStates = this.props.blockState.get('spans');
    var contentSpans = this.props.block.get('spans')
    .toArray()
    // mutable array of immutables
    .map(function(span,i){
      return (
        <SpanView key={i} spanIndex={i} blockIndex={blockIndex} span={span}
        spanState={spanStates.get(i)} docState={docState} docId={docId}></SpanView>
      )
    });

    var tag = this.props.block.get('type');
    var block;

    switch(tag) {
      case 'paragraph':
        block = <p data-block-index={blockIndex} data-doc-id={docId}>{contentSpans}</p>
        break;

      case 'header1':
        block = <h1 data-block-index={blockIndex} data-doc-id={docId}>{contentSpans}</h1>
        break;
      case 'header2':
        block = <h2 data-block-index={blockIndex} data-doc-id={docId}>{contentSpans}</h2>
        break;
      case 'header3':
        block = <h3 data-block-index={blockIndex} data-doc-id={docId}>{contentSpans}</h3>
        break;
      case 'header4':
        block = <h4 data-block-index={blockIndex} data-doc-id={docId}>{contentSpans}</h4>
        break;
      case 'header5':
        block = <h5 data-block-index={blockIndex} data-doc-id={docId}>{contentSpans}</h5>
        break;
      case 'header6':
        block = <h6 data-block-index={blockIndex} data-doc-id={docId}>{contentSpans}</h6>
        break;
    }
    return block;
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.blockState === nextProps.blockState
    && this.props.docState === nextProps.docState
    && this.props.block === nextProps.block) {
      return false;
    }
    return true;
  }
});

module.exports = BlockView;