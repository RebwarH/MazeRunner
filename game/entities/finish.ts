class Finish extends Noc.GameEngine.NocEntityBase
    implements Noc.GameEngine.INocEntity{

        id:string;
        key:string;
        dx:number;
        dy:number;
        constructor(){
            super();
            this.key = "finish";
            this.isHidden = true;

            this.addEventListener("showFinish", (evt:any) =>
            {
                    this.isHidden = false;
                
            });

        }

        update(ctx:CanvasRenderingContext2D,ts:number){

            this.dx = ctx.canvas.width / 2;
            this.dy = ctx.canvas.height  /2;

            ctx.save();

            ctx.translate(this.dx,this.dy);

            ctx.fillStyle = "#ffff00";

            ctx.fillRect(0,0,100,100);

            ctx.restore();
            
        }
}