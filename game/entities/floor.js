var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Floor = (function (_super) {
    __extends(Floor, _super);
    function Floor() {
        _super.call(this);
        this.key = "floor";
        this.gradient = this.createFloorGradient();
    }
    Floor.prototype.createFloorGradient = function () {
        var ctx = (document.createElement("canvas")).getContext("2d");
        ctx.canvas.width = 720;
        ctx.canvas.height = 405;
        // 0,0,0,170
        var g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        g.addColorStop(0.1, "#3B5E2B");
        g.addColorStop(1.0, "#333333");
        return g;
    };
    Floor.prototype.update = function (ctx) {
        var dY = ctx.canvas.height / 2;
        ctx.fillStyle = this.gradient;
        ctx.fillRect(0, dY, ctx.canvas.width, dY);
        console.log("paint floor");
    };
    return Floor;
}(Noc.GameEngine.NocEntityBase));
//# sourceMappingURL=floor.js.map