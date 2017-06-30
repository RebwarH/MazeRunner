/*

    Sky entity

*/



class Sky extends Noc.GameEngine.NocEntityBase
    implements Noc.GameEngine.INocEntity {

    id: string;
    key: string;
    grad:CanvasGradient;

    constructor() {
        super();
        this.key = "sky";
        this.grad = this.createFloorGradient();

    }

        createFloorGradient(){
        let ctx = (document.createElement("canvas")).getContext("2d");
        ctx.canvas.width = 720;
        ctx.canvas.height = 405;
        let g = ctx.createRadialGradient(720,405,120,720/2,405/2,50)
        g.addColorStop(0.1,"#0000ff");
        g.addColorStop(1.0,"#ffffff");
        return g;
    }

    update(ctx: CanvasRenderingContext2D) {
    //         ctx.save()
    //         ctx.fillStyle = this.createFloorGradient();
    //         ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height / 2);
    //         ctx.restore();
     }

}