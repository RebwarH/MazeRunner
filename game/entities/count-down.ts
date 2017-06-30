class CountDown extends Noc.GameEngine.NocEntityBase
    implements Noc.GameEngine.INocEntity {

    id: string;
    key: string;
    text: Array<string> = ["CREATING MAZE!", "GET READY!", "GO!"];

    alpha: number;
    p: number;;

    constructor() {
        super();
        this.key = "countDown";
        this.alpha = 1;
        this.p = 0;
        this.isHidden = true;
    }
    update(ctx: CanvasRenderingContext2D, ts: number) {
        let text = this.text[this.p];

        if (!text) {
            this.onEnded(ts);
            this.isHidden = true;
            return;
        }

        let dx = ctx.canvas.width / 2;
        let dy = ctx.canvas.height / 2
        let h = ctx.canvas.height;

      //  ctx.save();
        ctx.translate(dx, dy);
      
        ctx.font = "bold 70px Arial";
        ctx.fillStyle = "#ffffff"
        ctx.globalAlpha = 1 - this.alpha;
        ctx.fillText(text,-0 -
            (ctx.measureText(text).width) / 2,0)  
            

        this.alpha -= 0.025;
        if (this.alpha < 0) {
            this.alpha = 1;
            this.p = this.p + 1;

        }
  //      ctx.restore();
    }

}