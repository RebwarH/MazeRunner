/*
Compass entity
*/

class CompassNeedle extends Noc.GameEngine.NocEntityBase implements Noc.GameEngine.INocEntity{
    id:string;
    key:string;
    radius: number;
    constructor(public camera:Noc.GameEngine.Camera2D){   
        super();
        this.key = "compass";
        this.radius = 50;
    }


    get degree():number{
        return this.toDegrees(this.camera.direction);
    }

    update(ctx:CanvasRenderingContext2D){

        let dx = (ctx.canvas.width -this.radius) - 20;
        let dy =  (this.radius )  +20;

        let rad = this.toRadians(this.toDegrees(this.camera.direction)-90);

       
        ctx.translate(dx,dy);
        ctx.rotate(rad);

        ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.strokeStyle = "#ff0000";
            ctx.moveTo(0,0);
            ctx.lineTo(0,this.radius);
            ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
                ctx.fillStyle = "#ff0000"
                ctx.arc(0,0,5,0,2 * Math.PI)
                ctx.fill();
        ctx.closePath();

       

    }


}

