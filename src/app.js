var Board = function () {
    this._turn = 1;
    this._matrix = [];
    this._gameWonListeners = [];
    this._xTurnListeners = [];
    this._0TurnListeners = [];
    for (var i = 0; i < this._sides; i++) {
        this._matrix.push(new Array(3));
    }
};
Board.prototype = cc.extend(Object);
Board.prototype.mark = function (r, c) {   
      if (this._matrix[r][c] !== undefined) return;
      
      if (this._turn % 2 == 0) {
          this._matrix[r][c] = true;
          this._raiseXTurnEvent(r, c);
      } else {
          this._matrix[r][c] = false;
          this._raise0TurnEvent(r, c);
      } 
      
      if (this._isAWinTurn(r, c)){
          this._raiseGameWonEvent();
      }
      
      this._turn++;
};

Board.prototype._isAWinTurn = function (r, c) {
    return false;    
};

Board.prototype.getWinnerLine = function () {
   return {};
};

Board.prototype._raiseGameWonEvent = function (r, c) {
    var winLine = this.getWinnerLine();
    this._gameWonListeners.forEach(function (evt) {
        evt({ first: winLine.first, last: winLine.last}); 
    });
};

Board.prototype._raiseXTurnEvent = function (r, c) {
    this._xTurnListeners.forEach(function (evt) {
         evt({row: r, col: c});
    });
};

Board.prototype._raise0TurnEvent = function (r, c) {
    this._0TurnListeners.forEach(function (evt) {
        evt({row: r, col: c}); 
    });
};

Board.prototype._sides = 3;

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        
        var size = cc.winSize;
        
        var helloLabel = new cc.LabelTTF("Tic Tac Toe V0.1", "Arial", 38);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        this.addChild(helloLabel, 5);

        this.sprite = new cc.Sprite(res.tablero_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        
        this.addChild(this.sprite, 0);
        
        
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

