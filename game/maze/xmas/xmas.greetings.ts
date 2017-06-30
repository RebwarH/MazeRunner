class Startfield extends Noc.GameEngine.NocEntityBase implements Noc.GameEngine.INocEntity {
    starField: Array<any>;
    constructor(public width: number, public height: number, public maxStarSpeed: number, public numOfStars: number) {

        super();
        this.key = "stars";

        this.starField = new Array<any>();

        this.generate();

       

    }

    private animate() {

        var i,
            star,
            randomLoc,
            increment;

        for (i = 0; i < this.numOfStars; i++) {
            star = this.starField[i];

            increment = Math.min(star.speed, Math.abs(star.speed / star.slope));
            star.x += (star.x > 0) ? increment : -increment;
            star.y = star.slope * star.x;

            star.opacity += star.speed / 100;

           
            if ((Math.abs(star.x) > this.width / 2) ||
                (Math.abs(star.y) > this.height / 2)) {
                //randomLoc = BigBang.getRandomPosition(
                //    -this.width / 2, -this.height / 2, 
                //       this.width, this.height
                //);
                randomLoc = this.getRandomPosition(
                    -this.width / 10, -this.height / 10,
                    this.width / 5, this.height / 5
                );
                star.resetPosition(randomLoc.x, randomLoc.y, this.maxStarSpeed);
            }
        }

    }

    update(ctx: CanvasRenderingContext2D, ts: number) {
        this.animate();
        // ctx.fillStyle = "rgba(0, 0, 0, .5)";
        //     ctx.fillRect(0, 0, this.width, this.height);
         
            for (let i = 0; i < this.numOfStars; i++) {
                let star = this.starField[i];
                ctx.fillStyle = "rgba(255, 255, 255, " + star.opacity + ")";
                ctx.fillRect(
                    star.x + this.width / 2, 
                    star.y + this.height / 2, 
                    2, 2);
            }

    }

    generate() {
        for (let i = 0; i < this.numOfStars; i++) {
            this.starField.push(
                this.getRandomStar(-this.width / 2, -this.height / 2, this.width, this.height, this.maxStarSpeed)
            );
        }
    }

    getRandomPosition(minX, minY, maxX, maxY) {
        return {
            x: Math.floor((Math.random() * maxX) + minX),
            y: Math.floor((Math.random() * maxY) + minY)
        };
    }

    getRandomStar(minX, minY, maxX, maxY, maxSpeed) {
        let coords = this.getRandomPosition(minX, minY, maxX, maxY);
        return new Star(coords.x, coords.y, maxSpeed);
    }
}


class XMasDemo {

    stage: Noc.GameEngine.Stage;
    scene: Noc.GameEngine.Scene;

    constructor(settings: Noc.GameEngine.StageSettings) {

        this.stage = new Noc.GameEngine.Stage(settings);

        this.scene = this.stage.createScene("part1")

        this.scene.addEntity(new Startfield(settings.width,settings.height,3,333));

        this.scene.start();

    }




}

class Star {
    slope: number;
    opacity: number;
    speed: number;
    constructor(public x: number, public y: number, public v: number) {
        this.slope = y / x;
        this.opacity = 0;
        this.speed = Math.max(Math.random() * v, 1);
    }
    distanceTo(originX, originY) {
        return Math.sqrt(Math.pow(originX - this.x, 2) + Math.pow(originY - this.y, 2));
    };

    resetPosition(x:number,y:number,v){
            this.x = x;
            this.y = y;
            this.v = v;
    }

}




