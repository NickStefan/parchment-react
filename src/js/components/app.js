var React = require('react/dist/react-with-addons.js');
var AppStore = require('../stores/app-store');

var MenuView = require('./menu');
var DocView = require('./doc');

function getDoc(){
  return AppStore.getDoc();
}

var APP = React.createClass({
  getInitialState: function(){
    return {
      doc: getDoc()
    };
  },
  componentWillMount: function(){
    AppStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function(){
    AppStore.removeEventListener(this._onChange);
  },
  _onChange: function(){
    this.setState({
      doc: getDoc()
    });
  },
  render: function(){
    return (
      <div>
        <MenuView doc={this.state.doc } />
        <DocView doc={this.state.doc } />
      </div>
    )
  }
});

module.exports = APP;
