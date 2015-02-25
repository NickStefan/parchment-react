module.exports = {
  ActionTypes: {
    undo: 'undo',
    redo: 'redo',
    
    typeStuff: 'typeStuff',
    deleteStuff: 'deleteStuff',
    setCursor: 'setCursor'
  },

  reverse: {
    typeStuff: 'deleteStuff',
    deleteStuff: 'typeStuff'
  },

  notForCommandManager: {
    setCursor: 'setCursor'
  }

};