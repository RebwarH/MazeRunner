/*

    Sky entity

*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Sky = (function (_super) {
    __extends(Sky, _super);
    function Sky() {
        _super.call(this);
        this.key = "sky";
        this.grad = this.createFloorGradient();
    }
    Sky.prototype.createFloorGradient = function () {
        var ctx = (document.createElement("canvas")).getContext("2d");
        ctx.canvas.width = 720;
        ctx.canvas.height = 405;
        var g = ctx.createRadialGradient(720, 405, 120, 720 / 2, 405 / 2, 50);
        g.addColorStop(0.1, "#0000ff");
        g.addColorStop(1.0, "#ffffff");
        return g;
    };
    Sky.prototype.update = function (ctx) {
        //         ctx.save()
        //         ctx.fillStyle = this.createFloorGradient();
        //         ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height / 2);
        //         ctx.restore();
    };
    return Sky;
}(Noc.GameEngine.NocEntityBase));
//# sourceMappingURL=sky.js.map