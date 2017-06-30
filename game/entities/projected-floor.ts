class ProjectedFloor extends Noc.GameEngine.NocEntityBase implements Noc.GameEngine.INocEntity {

    id: string;
    key: string;

    angle: number;
    geometry: Noc.GameEngine.Geometry;

    state: any;

    constructor(public texture: HTMLImageElement) {
        super();
        this.angle = 0;

        // create a geometry

        this.geometry = new Noc.GameEngine.Geometry("foo");

        // [{"u":512,"v":0},{"u":512,"v":0},{"u":0,"v":512}]"

        // set up verticles
        let a = new Noc.GameEngine.Point3D(-1, -1, 16); // a     uv: 0,0
        let b = new Noc.GameEngine.Point3D(1, -1, 16); // b      uv: 512,0
        let c = new Noc.GameEngine.Point3D(-1, 1, 0); //c       uv: 0,512
        let d = new Noc.GameEngine.Point3D(1, 1, 0); // d        uv: 512,512 

        this.geometry.verticles.push(a, b, c, d);
        let f1 = new Noc.GameEngine.Face(0, 1, 3);
        // [{"u":512,"v":0},{"u":0,"v":0},{"u":0,"v":512}]"
        f1.addVertexUvs(
            new Array<Noc.GameEngine.UV>(
                new Noc.GameEngine.UV(512, 0),
                new Noc.GameEngine.UV(0, 0),
                new Noc.GameEngine.UV(0, 512)
            ));
        let f2 = new Noc.GameEngine.Face(0, 2, 3)
        // [{"u":512,"v":0},{"u":512,"v":0},{"u":0,"v":512}]
        f2.addVertexUvs(
            new Array<Noc.GameEngine.UV>(
                new Noc.GameEngine.UV(512, 0),
                new Noc.GameEngine.UV(512, 0),
                new Noc.GameEngine.UV(0, 512)
            ));

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
        }



    }



    update(ctx: CanvasRenderingContext2D) {
        
        ctx.save();

        this.geometry.faces.forEach((f: Noc.GameEngine.Face, fi: number) => {
            let p = new Array<Noc.GameEngine.Point3D>();
            
            let tri = this.geometry.getTriangle(f);


            for (let i = 0; i < tri.length; i++) {
                let vertex = tri[i];
                let r = vertex.rotateX(this.state.x).rotateY(this.state.y).rotateZ(this.state.z);
                p.push(r.project(this.state.w, this.state.h, this.state.fov, this.state.d));
            }
            let uvs = f.faceVertexUvs[0];

            this.textureMap(
                ctx, this.texture,
                p[0].x, p[0].y,
                p[1].x, p[1].y,
                p[2].x, p[2].y,
                uvs[0].u, uvs[0].v,
                uvs[1].u, uvs[1].u,
                uvs[2].u, uvs[2].v
            )
            this.state.angle += 0.24;

        });
       // this.angle += 0.3;
        //  for (var i = 0; i < this.verticles.length; i++) {
        //             var v = this.verticles[i];
        //             var r = v.rotateX(45).rotateY(0).rotateZ(0);
        //             var pr = r.project(ctx.canvas.width/2, ctx.canvas.height/2,5000,15);
        //             projected.push(pr);
        // };


        ctx.restore();


    }




}

