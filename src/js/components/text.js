var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var TextView = React.createClass({
	setCursor: function(e){
    e.stopPropagation();
    e.preventDefault();
    var selection = window.getSelection();
    AppActions.setCursor(this.props.blockIndex, this.props.textIndex, selection);
	},

  render: function(){
    var value = this.props.text.get('value');
    // var selectionStart = this.props.textState.get('selectionStart');
    // var selectionEnd = this.props.textState.get('selectionEnd');
    // var cursor;

    // if (selectionStart !== null
    // && selectionStart === selectionEnd){
    // 	cursor = <span>|</span>
    // }
    //console.log(this.props.textState.toJS())

    return (
      <span onClick={this.setCursor} className="word-view">
        { value }
      </span>
    )
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.textState === nextProps.textState &&
        this.props.text === nextProps.text) {
      return false;
    }
    return true;
  }
});

module.exports = TextView;