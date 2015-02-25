var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var LineView = require('./line');

var BlockView = React.createClass({

  render: function(){
    var contentLines = this.props.block.get('lines')
    .toArray()
    // mutable array of immutables
    .map(function(line,i){
      return (
        <LineView key={i} line={line}></LineView>
      )
    });

    var tag = this.props.block.get('type');
    var block;

    switch(tag) {
      case 'paragraph':
        block = <p>{contentLines}</p>
        break;

      case 'header1':
        block = <h1>{contentLines}</h1>
        break;
      case 'header2':
        block = <h2>{contentLines}</h2>
        break;
      case 'header3':
        block = <h3>{contentLines}</h3>
        break;
      case 'header4':
        block = <h4>{contentLines}</h4>
        break;
      case 'header5':
        block = <h5>{contentLines}</h5>
        break;
      case 'header6':
        block = <h6>{contentLines}</h6>
        break;
    }

    return block;
  }
});

module.exports = BlockView;