class Point {
    x: number;
    y: number;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

class MazeSolver {
    endX: number;
    endY: number;
    height: number;
    width: number;
    size: number;

    onCorrectPath: (p: number) => void;

    constructor(public maze: Array<number>, size: number) {
        this.endX = size / 2 + 16;
        this.endY = size / 2 + 16;
        this.size = size;
        this.height = size;
        this.width = size
        this.wasHere = Noc.GameEngine.Utils.Repeat(false, this.size)
        this.correctPath = Noc.GameEngine.Utils.Repeat(false, this.size);
    }

    wasHere: Array<boolean>
    correctPath: Array<boolean>

    get(x: number, y: number): number {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return 0;
        let result = this.maze[y * this.size + x];

        return result
    }
    getWasHere(x: number, y: number): boolean {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return false;
        let result = this.wasHere[y * this.size + x];

        return result;
    };

    setWasHere(x: number, y: number): void {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return;
        this.wasHere[y * this.size + x] = !this.wasHere[y * this.size + x];
    }

    setCorrectPath(x: number, y: number): void {

        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return;
        this.correctPath[y * this.size + x] = true;
        this.onCorrectPath(y * this.size + x);

    }

    solveMaze() {
        let start = this.maze.indexOf(0);
        return this.recursiveSolve(start, 0);
    }

    recursiveSolve(x: number, y: number) {
        if (x == this.endX && y == this.endY) return true;
           if (this.get(x, y) === 1 || this.getWasHere(x, y)) return false;

        this.setWasHere(x, y);

        if (x != 0)
            if (this.recursiveSolve(x - 1, y)) {
                this.setCorrectPath(x, y);
                return true;
            }
        if (x != this.width - 1)
            if (this.recursiveSolve(x + 1, y)) {
                this.setCorrectPath(x, y);
                return true;
            }
        if (y != 0)
            if (this.recursiveSolve(x, y - 1)) {
                this.setCorrectPath(x, y);
                return true;
            }
        if (y != this.height - 1)
            if (this.recursiveSolve(x, y + 1)) {
                this.setCorrectPath(x, y);
                return true;
            }
        return false;
    }
}



class Step{
    height:number;
    distance:number;
    offset:number;
    constructor(height:number = 0,distance:number=0,offset:number= 0){
        this.distance = distance;
        this.height = height;
        this.offset = offset;
    }
}

/*
    Renders the maze using a RayCaster


*/
class MazeMap extends Noc.GameEngine.NocEntityBase implements Noc.GameEngine.INocEntity {

    id: string
    key: string
    size: number
    light: number
    exitPoint:Noc.GameEngine.Point2D 
    constructor(public camera: Noc.GameEngine.Camera2D, public controls: any,
        public mazeGrid: Array<number>, public texture: HTMLImageElement,public analyzer:AnalyserNode) {
        super();
        this.key = "mazeMap";
        this.size = 34;
        this.light = 0.8;
        this.exitPoint = new Noc.GameEngine.Point2D(1.5,1.5);
    }

    private getByteFrequencyFromNode():number{
            let freqData = new  Uint8Array(this.analyzer.frequencyBinCount);
            this.analyzer.getByteFrequencyData(freqData);
            return Noc.GameEngine.Utils.fastFloor(freqData.reduce( (a:number,b:number) => {
                    return a + b;
            }));
           
    }
    update(ctx: CanvasRenderingContext2D, ts: number) {

        let freq = this.getByteFrequencyFromNode();

  //      console.log(freq);

        // if player reaches the exit, map is completed
        let hasReachedExit = Math.ceil((this.camera.distanceToPoint(this.exitPoint) * 100) * 1.063) <= 200;

        if(hasReachedExit){
            this.dispatch("showFinish",ts)
            this.isHidden = true;
            return;
        } 

        this.camera.update(this.controls.states, this, 0.02);

        for (var column = 0; column < (ctx.canvas.width / 2); column++) {
            var x = column / (ctx.canvas.width / 2) - 0.314;
            var angle = Math.atan2(x, 0.8);
            var ray = this.cast(this.camera.point(),
                this.camera.direction + angle, 10);
            this.drawWalls(ctx, column, angle, ray);
        }
    }

    private drawWalls(ctx: CanvasRenderingContext2D, column: number, angle: number, ray: Array<any>) {

        let project = (height: number, angle: number, distance: number) => {
            let z = distance * Math.cos(angle);
            let h = ctx.canvas.width * height / z;
            let b = ctx.canvas.height / 2 * (1 + 1 / z);

            return {
                top: b - h, height: h
            }
        };


        let left = Math.floor(column * 2.25);
        let width = Math.ceil(2.25);
        let hit = -1;

        while (++hit < ray.length && ray[hit].height <= 0);

        for (let s = ray.length - 1; s >= 0; s--) {
            let step = ray[s];

            if (s === hit) {

                let textureX = Math.floor(this.texture.width * step.offset);
                let wall = project(step.height, angle, step.distance);
                
                ctx.globalAlpha = 1;

                let x = Math.floor(left);
                let y = Math.floor(wall.top);
                let height = Math.floor(wall.height);

                ctx.drawImage(this.texture, textureX, 0, 1, 236, x, y, width, height);
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = Math.max((step.distance + step.shading) / 5 - this.light, 0);
                ctx.fillRect(left, wall.top, width, wall.height);

            }
        }
    }

    get(x: number, y: number): number {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return 0;
        let result = this.mazeGrid[y * this.size + x];

        return result;
    }

    cast(point: Noc.GameEngine.Point2D | Noc.GameEngine.Point3D, angle: number, range: number) {

        let sin = Math.sin(angle);
        let cos = Math.cos(angle);

        var noWall = { len: Infinity }

        let inspect = (step:any, shiftX:number, shiftY:number, distance:number, offset:number): any => {
            let dx = cos < 0 ? shiftX : 0;
            let dy = sin < 0 ? shiftY : 0;
            step.height = this.get(step.x - dx, step.y - dy);
            step.distance = distance + Math.sqrt(step.len);
            if (shiftX) step.shading = cos < 0 ? 2 : 0;
            else step.shading = sin < 0 ? 2 : 1;
            step.offset = offset - Math.floor(offset);
            return step;
        }

        let ray = (origin: any): any => {
            let stepX = step(sin, cos, origin.x, origin.y, false);
            let stepY = step(cos, sin, origin.y, origin.x, true);

            let nextStep = stepX.len < stepY.len
                ? inspect(stepX, 1, 0, origin.distance, stepX.y)
                : inspect(stepY, 0, 1, origin.distance, stepY.x);

            if (nextStep.distance > range) return [origin];
            return [origin].concat(ray(nextStep))
        };

        let step = (rise: number, run: number, x: number,
            y: number, inverted?: boolean): any => {

            if (run === 0) return noWall;
            let dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
            let dy = dx * (rise / run);

            return {
                x: inverted ? y + dy : x + dx,
                y: inverted ? x + dx : y + dy,
                len: dx * dx + dy * dy
            };
        }

        return ray({ x: point.x, y: point.y, height: 0, distance: 0 })
    }

}
