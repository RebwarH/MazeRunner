var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Finish = (function (_super) {
    __extends(Finish, _super);
    function Finish() {
        var _this = this;
        _super.call(this);
        this.key = "finish";
        this.isHidden = true;
        this.addEventListener("showFinish", function (evt) {
            _this.isHidden = false;
        });
    }
    Finish.prototype.update = function (ctx, ts) {
        this.dx = ctx.canvas.width / 2;
        this.dy = ctx.canvas.height / 2;
        ctx.save();
        ctx.translate(this.dx, this.dy);
        ctx.fillStyle = "#ffff00";
        ctx.fillRect(0, 0, 100, 100);
        ctx.restore();
    };
    return Finish;
}(Noc.GameEngine.NocEntityBase));
//# sourceMappingURL=finish.js.map