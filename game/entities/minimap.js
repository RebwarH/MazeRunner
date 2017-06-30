var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MiniMap = (function (_super) {
    __extends(MiniMap, _super);
    function MiniMap(maze, size, cellWidth) {
        var _this = this;
        _super.call(this);
        this.size = size;
        this.cellWidth = cellWidth;
        this.mazeGrid = maze; //Array.from(maze);
        this.key = "miniMap";
        this.solver = new MazeSolver(this.mazeGrid, this.size);
        this.solver.onCorrectPath = function (p) {
            _this.mazeGrid[p] = -1;
        };
        this.k = (this.size * this.cellWidth) / 2;
        var collitionDetector = new Noc.GameEngine.CollitionDetector();
        this.addEventListener("touchend", function (evt) {
            var ct = evt.changedTouches[0];
            var ctRect = new Noc.GameEngine.Circle(new Noc.GameEngine.Point2D(ct.clientX, ct.clientY), 10);
            var hit = collitionDetector.circularDetection(ctRect, new Noc.GameEngine.Circle(new Noc.GameEngine.Point2D(55, 55), 50));
            if (hit) {
                _this.isHidden = !_this.isHidden;
            }
            _this.onToggle(_this.isHidden);
        });
    }
    MiniMap.prototype.get = function (x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1)
            return -1;
        var result = this.mazeGrid[y * this.size + x];
        return result;
    };
    MiniMap.prototype.update = function (ctx) {
        var dx = ctx.canvas.width / 2;
        var dy = ctx.canvas.height / 2;
        ctx.save();
        ctx.translate(dx, dy);
        for (var rows = 0; rows < this.size; rows++) {
            for (var column = 0; column < this.size; column++) {
                var state = this.get(rows, column);
                if (state === -1) {
                    var color = "#00ff00";
                }
                else
                    color = state == 1 ? "rgba(255,0,0,0.7)" : "rgba(255,255,255,0.2)";
                ctx.fillStyle = color;
                ctx.fillRect((rows * this.cellWidth) - this.k, (column * this.cellWidth) - this.k, this.cellWidth, this.cellWidth);
            }
        }
        ctx.restore();
    };
    return MiniMap;
}(Noc.GameEngine.NocEntityBase));
//# sourceMappingURL=minimap.js.map