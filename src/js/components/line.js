var React = require('react/dist/react-with-addons.js');
var classSet = React.addons.classSet;

var AppActions = require('../actions/app-actions');

var TextView = require('./text');

var LineView = React.createClass({

  setCursor: function(e){
    e.stopPropagation();
    e.preventDefault();
    console.log('click')

    // ----------------------5px
    // <span><span>3px<span></span>6px

    // build the lineWords array obj
    var lineWords = [];

    // this.getDOMNode.children
    // .forEach(function(text){
    //    from 0 to word.length
    //        lineWords.push(word);

      // text.offsetLeft to text.offsetLeft + text.outterwidth
        // lineWords.push(text); ??? or the text index, that would be better...
        // how to get the cursor index inside of that word ???
    //}

    // targetWord = lineWords[px] || _.last(lineWords);

    // OR dont go by line. 
    // instead pass block click callback to each word
    // use old calculations

    // pros by line: easier to calculate where to put the index and cursor
    // cons by line: have to manually figure out how much of each text to put on each line

    // pros by block: dont have to figure out how much for each line
    // cons by block: have to calculate where to put the index and cursor

    var targetX = e.target.offsetLeft;
    var targetWidth = e.target.offsetWidth;
    var clickX = e.clientX;
    var indexPixel = clickX - targetX;
    var pixelRatio = indexPixel / targetWidth;
    var cursorIndex = Math.ceil(pixelRatio * this.props.text.get('value').length);

    AppActions.setCursor(this.props.blockIndex, this.props.lineIndex, textIndex, cursorIndex, cursorIndex);
  },

  render: function(){
    var blockIndex = this.props.blockIndex;
    var lineIndex = this.props.lineIndex;
    var textStates = this.props.lineState.get('texts');
    var contentTexts = this.props.line.get('texts')
    .toArray()
    // mutable array of immutables
    .map(function(text,i){
      return (
        <TextView key={i} textIndex={i} lineIndex={lineIndex} blockIndex={blockIndex} text={text} textState={textStates.get(i)}></TextView>
      )
    });

    return (
      <span onClick={this.setCursor} className="line-view">
        { contentTexts }
      </span>
    )
  },

  shouldComponentUpdate: function(nextProps,nextState){
    if (this.props.lineState === nextProps.lineState &&
        this.props.line === nextProps.line) {
      return false;
    }
    return true;
  }
});

module.exports = LineView;