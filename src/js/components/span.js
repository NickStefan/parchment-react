var React = require('react/dist/react-with-addons.js');

var classSet = React.addons.classSet;

var SpanView = React.createClass({

  render: function(){
    var value = this.props.span.get('value');
    var blockIndex = this.props.blockIndex;
    var spanIndex = this.props.spanIndex;
    var docId = this.props.docId;

    var classObj = {};
    classObj[ 'blockId_' + blockIndex] = true;
    classObj[ 'docId_' + docId] = true;
    classObj[ 'spanId_' + spanIndex] = true;
    var classes = classSet(classObj);

    return (
      <span className={classes}>
          { value }
      </span>
    )
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.span === nextProps.span) {
      return false;
    }
    return true;
  }
});

module.exports = SpanView;