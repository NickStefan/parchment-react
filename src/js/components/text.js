var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var TextView = React.createClass({
  componentDidMount: function(){
    this.ensureTextNode();
  },
  componentDidUpdate: function(){
    this.ensureTextNode();
  },
  ensureTextNode: function(){
    var el = this.getDOMNode();
    if (!el.childNodes.length){
      // 0 length character that never dirties anything
      // hack to make empty text node selectable for contenteditable
      // http://stackoverflow.com/questions/4063144/setting-the-caret-position-to-an-empty-node-inside-a-contenteditable-element
      el.appendChild(document.createTextNode("\uFEFF"));
    }
  },
  render: function(){
    var value = this.props.text.get('value') || "";
    var blockIndex = this.props.blockIndex;
    var textIndex = this.props.textIndex;
    var docId = this.props.docId;

    return (
      <span data-text-index={textIndex} data-block-index={blockIndex} 
      data-doc-id={docId}>
        { value }
      </span>
    )
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.textState === nextProps.textState &&
        this.props.text === nextProps.text) {
      return false;
    }
    return true;
  }
});

module.exports = TextView;