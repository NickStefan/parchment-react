var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var TextView = React.createClass({

  render: function(){
    var value = this.props.text.get('value');

    return (
      <span className="word-view">
        { value }
      </span>
    )
  }
});

module.exports = TextView;