var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Startfield = (function (_super) {
    __extends(Startfield, _super);
    function Startfield(width, height, maxStarSpeed, numOfStars) {
        _super.call(this);
        this.width = width;
        this.height = height;
        this.maxStarSpeed = maxStarSpeed;
        this.numOfStars = numOfStars;
        this.key = "stars";
        this.starField = new Array();
        this.generate();
    }
    Startfield.prototype.animate = function () {
        var i, star, randomLoc, increment;
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
                randomLoc = this.getRandomPosition(-this.width / 10, -this.height / 10, this.width / 5, this.height / 5);
                star.resetPosition(randomLoc.x, randomLoc.y, this.maxStarSpeed);
            }
        }
    };
    Startfield.prototype.update = function (ctx, ts) {
        this.animate();
        // ctx.fillStyle = "rgba(0, 0, 0, .5)";
        //     ctx.fillRect(0, 0, this.width, this.height);
        for (var i = 0; i < this.numOfStars; i++) {
            var star = this.starField[i];
            ctx.fillStyle = "rgba(255, 255, 255, " + star.opacity + ")";
            ctx.fillRect(star.x + this.width / 2, star.y + this.height / 2, 2, 2);
        }
    };
    Startfield.prototype.generate = function () {
        for (var i = 0; i < this.numOfStars; i++) {
            this.starField.push(this.getRandomStar(-this.width / 2, -this.height / 2, this.width, this.height, this.maxStarSpeed));
        }
    };
    Startfield.prototype.getRandomPosition = function (minX, minY, maxX, maxY) {
        return {
            x: Math.floor((Math.random() * maxX) + minX),
            y: Math.floor((Math.random() * maxY) + minY)
        };
    };
    Startfield.prototype.getRandomStar = function (minX, minY, maxX, maxY, maxSpeed) {
        var coords = this.getRandomPosition(minX, minY, maxX, maxY);
        return new Star(coords.x, coords.y, maxSpeed);
    };
    return Startfield;
}(Noc.GameEngine.NocEntityBase));
var XMasDemo = (function () {
    function XMasDemo(settings) {
        this.stage = new Noc.GameEngine.Stage(settings);
        this.scene = this.stage.createScene("part1");
        this.scene.addEntity(new Startfield(settings.width, settings.height, 3, 333));
        this.scene.start();
    }
    return XMasDemo;
}());
var Star = (function () {
    function Star(x, y, v) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.slope = y / x;
        this.opacity = 0;
        this.speed = Math.max(Math.random() * v, 1);
    }
    Star.prototype.distanceTo = function (originX, originY) {
        return Math.sqrt(Math.pow(originX - this.x, 2) + Math.pow(originY - this.y, 2));
    };
    ;
    Star.prototype.resetPosition = function (x, y, v) {
        this.x = x;
        this.y = y;
        this.v = v;
    };
    return Star;
}());
//# sourceMappingURL=xmas.greetings.js.map