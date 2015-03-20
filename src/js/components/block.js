var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');
var SpanView = require('./span');

var BlockView = React.createClass({
  render: function(){
    var blockIndex = this.props.blockIndex;
    var docId = this.props.docId;
    var contentSpans = this.props.block.get('spans')
    .toArray()
    // mutable array of immutables
    .map(function(span,i){
      return (
        <SpanView
          key={i}
          spanIndex={i}
          blockIndex={blockIndex}
          span={span}
          docId={docId}>
        </SpanView>
      )
    });

    var tag = this.props.block.get('type');
    var block;

    var classObj = {};
    classObj[ 'blockId_' + blockIndex] = true;
    classObj[ 'docId_' + docId] = true;
    var classes = classSet(classObj);

    switch(tag) {
      case 'paragraph':
        block = <p classSet={classes}>{contentSpans}</p>
        break;

      case 'header1':
        block = <h1 className={classes}>{contentSpans}</h1>
        break;
      case 'header2':
        block = <h2 className={classes}>{contentSpans}</h2>
        break;
      case 'header3':
        block = <h3 className={classes}>{contentSpans}</h3>
        break;
      case 'header4':
        block = <h4 className={classes}>{contentSpans}</h4>
        break;
      case 'header5':
        block = <h5 className={classes}>{contentSpans}</h5>
        break;
      case 'header6':
        block = <h6 className={classes}>{contentSpans}</h6>
        break;
    }
    return block;
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.block === nextProps.block) {
      return false;
    }
    return true;
  }
});

module.exports = BlockView;