var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ProjectedFloor = (function (_super) {
    __extends(ProjectedFloor, _super);
    function ProjectedFloor(texture) {
        _super.call(this);
        this.texture = texture;
        this.angle = 0;
        // create a geometry
        this.geometry = new Noc.GameEngine.Geometry("foo");
        // [{"u":512,"v":0},{"u":512,"v":0},{"u":0,"v":512}]"
        // set up verticles
        var a = new Noc.GameEngine.Point3D(-1, -1, 16); // a     uv: 0,0
        var b = new Noc.GameEngine.Point3D(1, -1, 16); // b      uv: 512,0
        var c = new Noc.GameEngine.Point3D(-1, 1, 0); //c       uv: 0,512
        var d = new Noc.GameEngine.Point3D(1, 1, 0); // d        uv: 512,512 
        this.geometry.verticles.push(a, b, c, d);
        var f1 = new Noc.GameEngine.Face(0, 1, 3);
        // [{"u":512,"v":0},{"u":0,"v":0},{"u":0,"v":512}]"
        f1.addVertexUvs(new Array(new Noc.GameEngine.UV(512, 0), new Noc.GameEngine.UV(0, 0), new Noc.GameEngine.UV(0, 512)));
        var f2 = new Noc.GameEngine.Face(0, 2, 3);
        // [{"u":512,"v":0},{"u":512,"v":0},{"u":0,"v":512}]
        f2.addVertexUvs(new Array(new Noc.GameEngine.UV(512, 0), new Noc.GameEngine.UV(512, 0), new Noc.GameEngine.UV(0, 512)));
        this.geometry.faces.push(f1, f2);
        //  this.geometry.faces.push(f1);
        this.state = {
            w: 720,
            h: 405,
            fov: 16000,
            d: 50,
            x: 0,
            y: 0,
            z: 0,
            angle: 0
        };
    }
    ProjectedFloor.prototype.update = function (ctx) {
        var _this = this;
        ctx.save();
        this.geometry.faces.forEach(function (f, fi) {
            var p = new Array();
            var tri = _this.geometry.getTriangle(f);
            for (var i = 0; i < tri.length; i++) {
                var vertex = tri[i];
                var r = vertex.rotateX(_this.state.x).rotateY(_this.state.y).rotateZ(_this.state.z);
                p.push(r.project(_this.state.w, _this.state.h, _this.state.fov, _this.state.d));
            }
            var uvs = f.faceVertexUvs[0];
            _this.textureMap(ctx, _this.texture, p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y, uvs[0].u, uvs[0].v, uvs[1].u, uvs[1].u, uvs[2].u, uvs[2].v);
            _this.state.angle += 0.24;
        });
        // this.angle += 0.3;
        //  for (var i = 0; i < this.verticles.length; i++) {
        //             var v = this.verticles[i];
        //             var r = v.rotateX(45).rotateY(0).rotateZ(0);
        //             var pr = r.project(ctx.canvas.width/2, ctx.canvas.height/2,5000,15);
        //             projected.push(pr);
        // };
        ctx.restore();
    };
    return ProjectedFloor;
}(Noc.GameEngine.NocEntityBase));
//# sourceMappingURL=projected-floor.js.map