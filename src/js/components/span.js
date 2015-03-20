var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var SpanView = React.createClass({
  render: function(){
    var value = this.props.span.get('value');
    var blockIndex = this.props.blockIndex;
    var spanIndex = this.props.spanIndex;
    var docId = this.props.docId;

    return (
      <span data-span-index={spanIndex} data-block-index={blockIndex} 
      data-doc-id={docId}>
        { value }
      </span>
    )
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.spanState === nextProps.spanState &&
        this.props.span === nextProps.span) {
      return false;
    }
    return true;
  }
});

module.exports = SpanView;