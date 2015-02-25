var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var BlockView = require('./block');

var DocView = React.createClass({

  render: function(){
    var contentBlocks = this.props.doc.get('blocks')
    .toArray()
    // mutable array of immutables
    .map(function(block,i){
      return (
        <BlockView key={i} block={block}></BlockView>
      )
    });

    return (
      <div>
        { contentBlocks }
      </div>
    )
  }
});

module.exports = DocView;
