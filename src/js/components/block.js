var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');
var TextView = require('./text');

var BlockView = React.createClass({
  render: function(){
    var blockIndex = this.props.blockIndex;
    var docId = this.props.docId;
    var textStates = this.props.blockState.get('texts');
    var contentTexts = this.props.block.get('texts')
    .toArray()
    // mutable array of immutables
    .map(function(text,i){
      return (
        <TextView key={i} textIndex={i} blockIndex={blockIndex} text={text}
        textState={textStates.get(i)} docId={docId}></TextView>
      )
    });

    var tag = this.props.block.get('type');
    var block;

    switch(tag) {
      case 'paragraph':
        block = <p data-block-index={blockIndex} data-doc-id={docId}>{contentTexts}</p>
        break;

      case 'header1':
        block = <h1 data-block-index={blockIndex} data-doc-id={docId}>{contentTexts}</h1>
        break;
      case 'header2':
        block = <h2 data-block-index={blockIndex} data-doc-id={docId}>{contentTexts}</h2>
        break;
      case 'header3':
        block = <h3 data-block-index={blockIndex} data-doc-id={docId}>{contentTexts}</h3>
        break;
      case 'header4':
        block = <h4 data-block-index={blockIndex} data-doc-id={docId}>{contentTexts}</h4>
        break;
      case 'header5':
        block = <h5 data-block-index={blockIndex} data-doc-id={docId}>{contentTexts}</h5>
        break;
      case 'header6':
        block = <h6 data-block-index={blockIndex} data-doc-id={docId}>{contentTexts}</h6>
        break;
    }

    return block;
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.blockState === nextProps.blockState &&
        this.props.block === nextProps.block) {
      return false;
    }
    return true;
  }
});

module.exports = BlockView;