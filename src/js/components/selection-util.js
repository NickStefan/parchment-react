module.exports = {
  selectionWrapper: selectionWrapper,
  getAttributes: getAttributes,
  getTextChildNode: getTextChildNode,
  ensureTextNode: ensureTextNode
};

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
  selection.text1 = attr1['text-index'];
  selection.text2 = attr2['text-index'];
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
  } else {
    // 0 length character that never dirties anything
    // hack to make empty text node selectable for contenteditable
    //http://stackoverflow.com/questions/4063144/setting-the-caret-position-to-an-empty-node-inside-a-contenteditable-element
    node.appendChild(document.createTextNode("\uFEFF"));
    return node.childNodes[0];
  }
}

function ensureTextNode(nativeSelection){
  var baseNode = nativeSelection.baseNode;
  var extentNode = nativeSelection.extentNode;
  var startIndex = nativeSelection.baseOffset;
  var endIndex = nativeSelection.extentOffset;
  var changed = false;

  // if not a text node
  if (baseNode.nodeType !== 3){
    changed = true;
    baseNode = getTextChildNode(baseNode);
    startIndex = 0;
  }
  if (extentNode.nodeType !== 3){
    changed = true;
    extentNode = getTextChildNode(baseNode);
    endIndex = extentNode.length;
  }
  // update on screen selection if anything has changed
  if (changed){
    var range = document.createRange();
    range.setStart(baseNode, startIndex);
    range.setEnd(extentNode, endIndex);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange( range );
  }
}