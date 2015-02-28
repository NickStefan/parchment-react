var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var BlockView = require('./block');

var DocView = React.createClass({
  componentDidMount: function(){
    //window.addEventListener('keydown', this.preventBrowserBackspace );
  },


  preventBrowserBackspace: function(e){
    // this swallows backspace keys on any non-input element.
    // prevent browser's backspace from popping browser history stack
    var regex = /INPUT|SELECT|TEXTAREA/i;
    if( e.which == 8 ){ // 8 == backspace
      if(!regex.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
          e.preventDefault();
          e.stopPropagation();
      }
    }
  },

  type: function(e){
    e.stopPropagation();
    e.preventDefault();
    var block = this.props.docState.get('selection').get('block');
    var text = this.props.docState.get('selection').get('text');
    var startIndex = this.props.docState.get('selection').get('startIndex');
    var endIndex = this.props.docState.get('selection').get('endIndex');

    AppActions.typeStuff(block, text, startIndex, endIndex, e.key);
  },

  render: function(){
    var self = this;
    var blockStates = this.props.docState.get('blocks')
    var contentBlocks = this.props.doc.get('blocks')
    .toArray()
    // mutable array of immutables
    .map(function(block,i){
      return (
        <BlockView key={i} blockIndex={i} block={block} blockState={blockStates.get(i)}></BlockView>
      )
    });

    return (
      <div tabIndex={-1} contentEditable={true} onKeyPress={this.type}>
        { contentBlocks }
      </div>
    )
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.docState === nextProps.docState &&
        this.props.doc === nextProps.doc) {
      return false;
    }
    return true;
  },

  componentWillUnmount: function(){
    window.removeEventListener('keydown',this.preventBrowserBackspace);
  }
});

module.exports = DocView;
