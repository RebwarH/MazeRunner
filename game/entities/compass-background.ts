class CompassBackground extends Noc.GameEngine.NocEntityBase
        implements Noc.GameEngine.INocEntity{
            id:string;
            key:string;
        
            constructor(){
                super();
            }

            update(ctx:CanvasRenderingContext2D){

                let deg = 0;
                let r = 50;
                let s = 360 / 8;

                let dx = ((ctx.canvas.width) -r) -20;
                let dy =  (r) + 20;

                let len = 60;
                ctx.save();
                ctx.translate(dx,dy);
                ctx.globalAlpha = 0.5;
                 ctx.lineWidth = 10;
                ctx.fillStyle = "#000000";
                ctx.strokeStyle = "#ffffff";
            
                ctx.arc(0,0,r,0,2 * Math.PI);
                ctx.stroke();
                ctx.fill();

                ctx.lineWidth = 1;
                ctx.strokeStyle ="#ffffff"
                while(deg < 360){
                    let rad = this.toRadians(deg);
                    
                    ctx.beginPath();
                    ctx.moveTo(0,0);
                    ctx.lineTo(0 + r * Math.cos(this.toRadians(deg)),0 + r * Math.sin(this.toRadians(deg)));
                    ctx.closePath();
                    ctx.stroke();
                    deg += s;
                }   
                ctx.restore();
            }

  }