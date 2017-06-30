var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var MazeSolver = (function () {
    function MazeSolver(maze, size) {
        this.maze = maze;
        this.endX = size / 2 + 16;
        this.endY = size / 2 + 16;
        this.size = size;
        this.height = size;
        this.width = size;
        this.wasHere = Noc.GameEngine.Utils.Repeat(false, this.size);
        this.correctPath = Noc.GameEngine.Utils.Repeat(false, this.size);
    }
    MazeSolver.prototype.get = function (x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1)
            return 0;
        var result = this.maze[y * this.size + x];
        return result;
    };
    MazeSolver.prototype.getWasHere = function (x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1)
            return false;
        var result = this.wasHere[y * this.size + x];
        return result;
    };
    ;
    MazeSolver.prototype.setWasHere = function (x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1)
            return;
        this.wasHere[y * this.size + x] = !this.wasHere[y * this.size + x];
    };
    MazeSolver.prototype.setCorrectPath = function (x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1)
            return;
        this.correctPath[y * this.size + x] = true;
        this.onCorrectPath(y * this.size + x);
    };
    MazeSolver.prototype.solveMaze = function () {
        var start = this.maze.indexOf(0);
        return this.recursiveSolve(start, 0);
    };
    MazeSolver.prototype.recursiveSolve = function (x, y) {
        if (x == this.endX && y == this.endY)
            return true;
        if (this.get(x, y) === 1 || this.getWasHere(x, y))
            return false;
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
    };
    return MazeSolver;
}());
var Step = (function () {
    function Step(height, distance, offset) {
        if (height === void 0) { height = 0; }
        if (distance === void 0) { distance = 0; }
        if (offset === void 0) { offset = 0; }
        this.distance = distance;
        this.height = height;
        this.offset = offset;
    }
    return Step;
}());
/*
    Renders the maze using a RayCaster


*/
var MazeMap = (function (_super) {
    __extends(MazeMap, _super);
    function MazeMap(camera, controls, mazeGrid, texture, analyzer) {
        _super.call(this);
        this.camera = camera;
        this.controls = controls;
        this.mazeGrid = mazeGrid;
        this.texture = texture;
        this.analyzer = analyzer;
        this.key = "mazeMap";
        this.size = 34;
        this.light = 0.8;
        this.exitPoint = new Noc.GameEngine.Point2D(1.5, 1.5);
    }
    MazeMap.prototype.getByteFrequencyFromNode = function () {
        var freqData = new Uint8Array(this.analyzer.frequencyBinCount);
        this.analyzer.getByteFrequencyData(freqData);
        return Noc.GameEngine.Utils.fastFloor(freqData.reduce(function (a, b) {
            return a + b;
        }));
    };
    MazeMap.prototype.update = function (ctx, ts) {
        var freq = this.getByteFrequencyFromNode();
        //      console.log(freq);
        // if player reaches the exit, map is completed
        var hasReachedExit = Math.ceil((this.camera.distanceToPoint(this.exitPoint) * 100) * 1.063) <= 200;
        if (hasReachedExit) {
            this.dispatch("showFinish", ts);
            this.isHidden = true;
            return;
        }
        this.camera.update(this.controls.states, this, 0.02);
        for (var column = 0; column < (ctx.canvas.width / 2); column++) {
            var x = column / (ctx.canvas.width / 2) - 0.314;
            var angle = Math.atan2(x, 0.8);
            var ray = this.cast(this.camera.point(), this.camera.direction + angle, 10);
            this.drawWalls(ctx, column, angle, ray);
        }
    };
    MazeMap.prototype.drawWalls = function (ctx, column, angle, ray) {
        var project = function (height, angle, distance) {
            var z = distance * Math.cos(angle);
            var h = ctx.canvas.width * height / z;
            var b = ctx.canvas.height / 2 * (1 + 1 / z);
            return {
                top: b - h, height: h
            };
        };
        var left = Math.floor(column * 2.25);
        var width = Math.ceil(2.25);
        var hit = -1;
        while (++hit < ray.length && ray[hit].height <= 0)
            ;
        for (var s = ray.length - 1; s >= 0; s--) {
            var step = ray[s];
            if (s === hit) {
                var textureX = Math.floor(this.texture.width * step.offset);
                var wall = project(step.height, angle, step.distance);
                ctx.globalAlpha = 1;
                var x = Math.floor(left);
                var y = Math.floor(wall.top);
                var height = Math.floor(wall.height);
                ctx.drawImage(this.texture, textureX, 0, 1, 236, x, y, width, height);
                ctx.fillStyle = "#000000";
                ctx.globalAlpha = Math.max((step.distance + step.shading) / 5 - this.light, 0);
                ctx.fillRect(left, wall.top, width, wall.height);
            }
        }
    };
    MazeMap.prototype.get = function (x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1)
            return 0;
        var result = this.mazeGrid[y * this.size + x];
        return result;
    };
    MazeMap.prototype.cast = function (point, angle, range) {
        var _this = this;
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var noWall = { len: Infinity };
        var inspect = function (step, shiftX, shiftY, distance, offset) {
            var dx = cos < 0 ? shiftX : 0;
            var dy = sin < 0 ? shiftY : 0;
            step.height = _this.get(step.x - dx, step.y - dy);
            step.distance = distance + Math.sqrt(step.len);
            if (shiftX)
                step.shading = cos < 0 ? 2 : 0;
            else
                step.shading = sin < 0 ? 2 : 1;
            step.offset = offset - Math.floor(offset);
            return step;
        };
        var ray = function (origin) {
            var stepX = step(sin, cos, origin.x, origin.y, false);
            var stepY = step(cos, sin, origin.y, origin.x, true);
            var nextStep = stepX.len < stepY.len
                ? inspect(stepX, 1, 0, origin.distance, stepX.y)
                : inspect(stepY, 0, 1, origin.distance, stepY.x);
            if (nextStep.distance > range)
                return [origin];
            return [origin].concat(ray(nextStep));
        };
        var step = function (rise, run, x, y, inverted) {
            if (run === 0)
                return noWall;
            var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
            var dy = dx * (rise / run);
            return {
                x: inverted ? y + dy : x + dx,
                y: inverted ? x + dx : y + dy,
                len: dx * dx + dy * dy
            };
        };
        return ray({ x: point.x, y: point.y, height: 0, distance: 0 });
    };
    return MazeMap;
}(Noc.GameEngine.NocEntityBase));
//# sourceMappingURL=mazeMap.js.map