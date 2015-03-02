module.exports = {
  ActionTypes: {
    undo: 'undo',
    redo: 'redo',
    
    simpleInsert: 'simpleInsert',
    simpleRemove: 'simpleRemove',
    setCursor: 'setCursor'
  },

  reverse: {
    simpleInsert: 'simpleRemove',
    simpleRemove: 'simpleInsert'
  },

  notForCommandManager: {
    setCursor: 'setCursor'
  }

};