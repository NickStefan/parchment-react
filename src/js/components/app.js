var React = require('react/dist/react-with-addons.js');
var AppStore = require('../stores/app-store');

var MenuView = require('./menu');
var DocView = require('./doc');

function getDoc(){
  return AppStore.getDoc();
}

function getDocState(){
  return AppStore.getDocState();
}

var APP = React.createClass({
  getInitialState: function(){
    return {
      doc: getDoc(),
      docState: getDocState()
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
      doc: getDoc(),
      docState: getDocState()
    });
  },
  render: function(){
    return (
      <div>
        <MenuView doc={this.state.doc } docState={this.state.docState} />
        <DocView doc={this.state.doc } state={this.state.docState} />
      </div>
    )
  }
});

module.exports = APP;
