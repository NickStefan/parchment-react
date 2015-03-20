module.exports = {
  getCursorIndex: getCursorIndex,
  getRangeIndexes: getRangeIndexes
};


function getCursorIndex(e){
  // get the span's block and span index
  var span = e.target;
  var attr = getAttributes(span);

  // now get the text index:
  var index;
  var clickX = e.clientX;
  var clickY = e.clientY;

  // if a span wraps number lines, get an nice bounded box for each line, using a range!
  var selection = document.getSelection();
  var range = document.createRange();
  range.setStart(getTextChildNode(span), 0);
  range.setEnd(getTextChildNode(span), getTextChildNode(span).wholeText.length);
  selection.removeAllRanges();
  selection.addRange(range);
  var selectionLines = selection.getRangeAt(0).getClientRects();

  // get the exact row
  var row;
  var cumulativeRowWidth = 0;
  for (var i = 0; i < selectionLines.length && row === undefined; i++){
    var tempRow = selectionLines[i];
    if (selectionLines[i].top > clickY && selectionLines[i].bottom < clickY){
      cumulativeRowWidth = tempRow.width + cumulativeRowWidth;
      row = tempRow;
    }
  }

  var clickedRowPixel = clickX - row.left;
  var cumulativeClickedWidth = clickedRowPixel + cumulativeClickedWidth - row.width;
  var pixelRatio = cumulativeClickedWidth / cumulativeRowWidth;
  var cursorIndex = Math.ceil(pixelRatio * getTextChildNode(span).textContent.length);

  return {
    startBlock: attr['block-index'],
    endBlock: attr['block-index'],
    startSpan: attr['span-index'],
    endSpan: attr['span-index'],
    startIndex: cursorIndex,
    endIndex: cursorIndex
  }
}

function getRangeIndexes(){
  
}

function selectionWrapper(nativeSelection){
  var selection = {};
  selection.nativeSelection = nativeSelection;

  var baseNode = nativeSelection.baseNode;
  var extentNode = nativeSelection.extentNode;

  selection.baseTextNode = getTextChildNode(baseNode);
  selection.extentTextNode = getTextChildNode(extentNode);
  selection.baseParentNode = selection.baseTextNode.parentElement;
  selection.extentParentNode = selection.extentTextNode.parentElement;

  var attr1 = getAttributes(selection.baseParentNode);
  var attr2 = getAttributes(selection.extentParentNode);

  selection.docId1 = attr1['doc-id'];
  selection.docId2 = attr2['doc-id'];
  selection.block1 = attr1['block-index'];
  selection.block2 = attr2['block-index'];
  selection.span1 = attr1['span-index'];
  selection.span2 = attr2['span-index'];
  selection.startIndex = nativeSelection.baseOffset;
  selection.endIndex = nativeSelection.extentOffset;

  return selection;
}

function getAttributes(node){
  var attributes = {};
  for (var i = 0; i < node.attributes.length; i++){
    var attr = node.attributes[i];
    attributes[ attr.name.replace(/^data-/,"") ] = attr.value;
  }
  return attributes;
}

function getTextChildNode(node){
  if (node.nodeType === 3){
      return node;
  } else if (node.childNodes.length){
      for (var i = 0; i < node.childNodes.length; i++){
          return getTextChildNode(node.childNodes[i]);
      }
  }
}

function determineFontHeight (fontStyle){
  var body = document.getElementsByTagName("body")[0];
  var dummy = document.createElement("div");
  var dummyText = document.createTextNode("M");
  dummy.appendChild(dummyText);
  dummy.setAttribute("style", fontStyle);
  body.appendChild(dummy);
  var result = dummy.offsetHeight;
  body.removeChild(dummy);
  return result;
}