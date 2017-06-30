
class Floor extends Noc.GameEngine.NocEntityBase implements Noc.GameEngine.INocEntity{

    id:string;
    key:string;

    createFloorGradient(){
        let ctx = (document.createElement("canvas")).getContext("2d");
        ctx.canvas.width = 720;
        ctx.canvas.height = 405;
        // 0,0,0,170
        let g = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
        g.addColorStop(0.1,"#3B5E2B");
        g.addColorStop(1.0,"#333333");
        return g;
    }

    textue:HTMLImageElement;
    gradient : CanvasGradient;
    constructor(){
        super();
        this.key = "floor";
        this.gradient = this.createFloorGradient();
    }
    update(ctx:CanvasRenderingContext2D){
            let dY = ctx.canvas.height / 2;
            ctx.fillStyle = this.gradient;
            ctx.fillRect(0,dY,ctx.canvas.width,dY);
            console.log("paint floor");
    }

}