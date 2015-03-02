var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var TextView = require('./text');

var BlockView = React.createClass({

  setCursor: function(e){
    e.stopPropagation();
    e.preventDefault();
    var selection = window.getSelection();
    var texts = this.props.block.get('texts').size;
    var textIndex = texts > 0 ? texts - 1 : 0;
    AppActions.setCursor(this.props.blockIndex, textIndex, selection);
  },

  render: function(){
    var blockIndex = this.props.blockIndex;
    var textStates = this.props.blockState.get('texts');
    var contentTexts = this.props.block.get('texts')
    .toArray()
    // mutable array of immutables
    .map(function(text,i){
      return (
        <TextView key={i} textIndex={i} blockIndex={blockIndex} text={text} textState={textStates.get(i)}></TextView>
      )
    });

    var tag = this.props.block.get('type');
    var block;

    switch(tag) {
      case 'paragraph':
        block = <p onClick={this.setCursor}>{contentTexts}</p>
        break;

      case 'header1':
        block = <h1 onClick={this.setCursor}>{contentTexts}</h1>
        break;
      case 'header2':
        block = <h2 onClick={this.setCursor}>{contentTexts}</h2>
        break;
      case 'header3':
        block = <h3 onClick={this.setCursor}>{contentTexts}</h3>
        break;
      case 'header4':
        block = <h4 onClick={this.setCursor}>{contentTexts}</h4>
        break;
      case 'header5':
        block = <h5 onClick={this.setCursor}>{contentTexts}</h5>
        break;
      case 'header6':
        block = <h6 onClick={this.setCursor}>{contentTexts}</h6>
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