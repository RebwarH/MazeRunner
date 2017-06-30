
class StartScreen extends Noc.GameEngine.NocEntityBase
    implements Noc.GameEngine.INocEntity {

    id: string;
    key: string;
    dx: number;
    dy: number;


    onStart: (evt: any) => void;

    collision: Noc.GameEngine.CollitionDetector;

    constructor(private texture:HTMLImageElement) {
        
        super();

      
        this.key = "startScreen";
        this.collision = new Noc.GameEngine.CollitionDetector();

        this.addEventListener("touchend", (evt: TouchEvent) => {

            if(this.isHidden) return;

            let ct = evt.changedTouches[0];

            let ctRect = new Noc.GameEngine.Circle(
                new Noc.GameEngine.Point2D(ct.clientX, ct.clientY),
                50
            )

            let hit = this.collision.circularDetection(
                new Noc.GameEngine.Circle(new Noc.GameEngine.Point2D(this.dx,
                    this.dy)
                    , 50),
                ctRect
            )

     
            if(hit)
                this.onStart(evt);


        });

        this.addEventListener("touchstart", (evt: TouchEvent) => {

        });


    }

    update(ctx: CanvasRenderingContext2D) {


        // draw the bg Image  -> will do a video - > canvas 

        ctx.save()

        ctx.drawImage(this.texture,0,0,this.dx * 2 , this.dy * 2);

        ctx.restore();

        this.dx = ctx.canvas.width / 2;
        this.dy = ctx.canvas.height / 2;

        ctx.save()
        ctx.translate(this.dx, this.dy)


        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(-200 / 2, -50 / 2, 200, 50);
        ctx.fill();


        ctx.restore();

    }



}