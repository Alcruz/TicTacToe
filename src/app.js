var Board = function () {
    this._turn = 1;
    this._matrix = [];
    this._gameWonListeners = [];
    this._xTurnListeners = [];
    this._0TurnListeners = [];
    for (var i = 0; i < this._sides; i++) {
        this._matrix.push(new Array(this._sides));
    }
};
Board.prototype = cc.extend(Object);
Board.prototype.mark = function (r, c) {   
      if (this._matrix[r][c] !== undefined) return;
      if ( r >= this._sides && r < 0) return;
      if ( c >= this._sides && c < 0) return;
      
      if (this._turn % 2 != 0) {
          this._matrix[r][c] = true;
          this._raiseEvent(this.X_TURN, r, c);
      } else {
          this._matrix[r][c] = false;
          this._raiseEvent(this.ZERO_TURN, r, c);
      } 
      
      if (this._isAWinTurn(r, c)){
          this._raiseEvent();
      }
      
      this._turn++;
};

Board.prototype.BOARD_WON = "BOARD_WON_EVENT";
Board.prototype.X_TURN = "X_TURN";
Board.prototype.ZERO_TURN = "ZERO_TURN";

Board.prototype._isAWinTurn = function (r, c) {
    return false;    
};

Board.prototype.getWinnerLine = function () {
   return {};
};

Board.prototype._raiseEvent = function (eventType, r, c) {
    var evt = new cc.EventCustom(eventType);
    evt.setUserData({r: r, c: c});
    cc.eventManager.dispatchEvent(evt);
};

Board.prototype._sides = 3;

function mapTouchToIndexes (x, y) {
    var w = 95, 
        h = 100;
    var origin = { x: 346, y: 417 };
    
    return {
        row: Math.floor((origin.y - y)/h),
        col: Math.floor((x - origin.x)/w)
    }
}

function mapIndexesToCoord(indexes) {
    return {
        x: 95*indexes.c + 346 + 95/2,
        y:  417 - 100*indexes.r - 100/2
    }
}

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        
        this.board = new Board();
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {	
                var p = touch._point;
                var indexes;
                if (p.x - 346 <= 3*95 && p.x - 346 > 0 &&
                    417 - p.y <= 3*100 && 417 - p.y > 0) {
                    indexes = mapTouchToIndexes(touch._point.x, touch._point.y);
                    self.board.mark(indexes.row, indexes.col);
                }
            },
        }, this);
        
        var xTurnListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: Board.prototype.X_TURN,
            callback: function (event) {
                var indexes = event.getUserData();
                
                var xSprite = new cc.Sprite(res.X_png);
                xSprite.attr(mapIndexesToCoord(indexes));
                self.addChild(xSprite);
            }
        });
        cc.eventManager.addListener(xTurnListener, 1);
        
        var zTurnListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: Board.prototype.ZERO_TURN,
            callback: function (event) {
                var indexes = event.getUserData();
                
                var ySprite = new cc.Sprite(res.O_png);
                ySprite.attr(mapIndexesToCoord(indexes));
                self.addChild(ySprite);
            }
        });
        cc.eventManager.addListener(zTurnListener, 1);
        
        
        var size = cc.winSize;
        
        var helloLabel = new cc.LabelTTF("Tic Tac Toe V0.1", "Arial", 38);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        this.addChild(helloLabel, 5);

        this.boardSprite = new cc.Sprite(res.tablero_png);
        this.boardSprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        
        this.addChild(this.boardSprite, 0);
        
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


