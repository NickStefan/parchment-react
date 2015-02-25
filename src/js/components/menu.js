var React = require('react/dist/react-with-addons.js');

var AppActions = require('../actions/app-actions');

var MENU = React.createClass({

  undo: function(e){
    e.stopPropagation();
    e.preventDefault();
    AppActions.undo();
  },
  redo: function(e){
    e.stopPropagation();
    e.preventDefault();
    AppActions.redo();
  },

  render: function(){
    return (
      <div>
        <button onClick={this.undo}> undo </button>
        <button onClick={this.redo}> redo </button>
      </div>
    )
  }
});

module.exports = MENU;
