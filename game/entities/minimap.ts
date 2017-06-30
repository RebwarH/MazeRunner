class MiniMap extends Noc.GameEngine.NocEntityBase
    implements Noc.GameEngine.INocEntity {
    id: string;
    key: string;
    collitionDetector: Noc.GameEngine.CollitionDetector
    k: number; 
    solver: MazeSolver;
    context: CanvasRenderingContext2D;
    mazeGrid: Array<number>;
    onToggle: (evt:any) => void;
   
    constructor(maze: Array<number>, public size: number,public cellWidth: number) {
      
        super();

        this.mazeGrid =  maze;  //Array.from(maze);

        this.key ="miniMap";

        this.solver = new MazeSolver(this.mazeGrid,this.size);

        this.solver.onCorrectPath = (p:number) =>
        {
            this.mazeGrid[p] = -1;
        }
    
        this.k = (this.size * this.cellWidth) / 2 ;
        
        let collitionDetector = new Noc.GameEngine.CollitionDetector();
                
        this.addEventListener("touchend", (evt:TouchEvent) =>{
                let ct  = evt.changedTouches[0];
                let ctRect = new Noc.GameEngine.Circle(
                    new Noc.GameEngine.Point2D(ct.clientX,ct.clientY),
                    10
                );
                let hit = collitionDetector.circularDetection(
                      ctRect,  
                      new Noc.GameEngine.Circle(new Noc.GameEngine.Point2D(55,55),
                        50
                        ));
                        if(hit){
                            this.isHidden = !this.isHidden;
                        }
                        this.onToggle(this.isHidden);
        });

      
    }

    get(x: number, y: number): number {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return -1;
        let result =  this.mazeGrid[y * this.size + x];
        return result;
    }

    update(ctx: CanvasRenderingContext2D) {

       let dx = ctx.canvas.width / 2;
       let dy = ctx.canvas.height / 2; 

       ctx.save();
       ctx.translate(dx,dy);
     
        for (let rows = 0; rows < this.size; rows++) {
            for (let column = 0; column < this.size; column++) {

               

                let state = this.get(rows, column);
                if(state === -1){
                     var color = "#00ff00";
                }

                else
                 color = state == 1 ? "rgba(255,0,0,0.7)" : "rgba(255,255,255,0.2)";

                ctx.fillStyle = color;

                ctx.fillRect(
                    (rows * this.cellWidth)-this.k,(column * this.cellWidth) - this.k,
                        this.cellWidth,this.cellWidth);

         
  
           
            }
        }
        
        ctx.restore();

    }

}