var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var SpanView = React.createClass({
  
  getTxtValue: function() {
    // if cursor
    if (this.props.docState.get('isCollapsed') && this.props.docState.get('startSpan') === this.props.spanIndex.toString()){
      var offset = this.props.docState.get('startOffset');
      var value = this.props.span.get('value');

      var val1 = value.slice(0, offset);
      var val2 = value.slice(offset);

      if (offset === 0 && val2 === ""){
        return [
          <span key={0} className={'cursor'}></span>
        ];
      }
      if (offset === 0 && val2 !== ""){
        return [
          <span key={0} className={'cursor'}></span>, 
          <span key={1}>{val2}</span>
        ];
      }
      if (0 < offset && offset < value.length){
        return [
          <span key={0}>{val1}</span>,
          <span key={1} className={'cursor'}></span>,
          <span key={2}>{val2}</span>
        ];
      }
      if (offset === value.length){
        return [
          <span key={0}>{val1}</span>, 
          <span key={1} className={'cursor'}></span>
        ];
      }
    }
    // if no cursor
    return this.props.span.get('value');
  },

  render: function(){
    var value = this.getTxtValue();
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
    if (this.props.spanState === nextProps.spanState
    && this.props.docState === nextProps.docState
    && this.props.span === nextProps.span) {
      return false;
    }
    return true;
  }
});

module.exports = SpanView;