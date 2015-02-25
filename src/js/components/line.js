var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var TextView = require('./text');

var LineView = React.createClass({

  render: function(){
    var blockIndex = this.props.blockIndex;
    var lineIndex = this.props.lineIndex;
    var textStates = this.props.lineState.get('texts');
    var contentTexts = this.props.line.get('texts')
    .toArray()
    // mutable array of immutables
    .map(function(text,i){
      return (
        <TextView key={i} textIndex={i} lineIndex={lineIndex} blockIndex={blockIndex} text={text} textState={textStates.get(i)}></TextView>
      )
    });

    return (
      <span className="line-view">
        { contentTexts }
      </span>
    )
  }
});

module.exports = LineView;