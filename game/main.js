var TouchContols = (function () {
    function TouchContols(selector) {
        this.codes =
            { 'left': 'left', 'right': 'right', 'forward': 'forward', 'backward': 'backward' };
        this.states = { 'left': false, 'right': false, 'forward': false, 'backward': false };
        this.elements = new Array();
        // set up left,right, up & down childs
        var parent = document.querySelector(selector);
        this.createEl("left");
        this.createEl("right");
        this.createEl("forward");
        this.createEl("backward");
        this.elements.forEach(function (el) {
            parent.appendChild(el);
        });
    }
    TouchContols.prototype.onKey = function (val, evt) {
        var el = evt.srcElement;
        var dataset = el.dataset;
        6;
        var state = this.codes[dataset.direction];
        if (typeof state === 'undefined')
            return;
        this.states[state] = val;
        evt.preventDefault && evt.preventDefault();
        evt.stopPropagation && evt.stopPropagation();
    };
    TouchContols.prototype.addListener = function (el) {
        el.addEventListener('touchstart', this.onKey.bind(this, true), false);
        el.addEventListener('touchend', this.onKey.bind(this, false), false);
    };
    TouchContols.prototype.createEl = function (direction) {
        var el = document.createElement("div");
        el.classList.add("noc-tc");
        el.classList.add(direction);
        el.dataset["direction"] = direction;
        this.addListener(el);
        this.elements.push(el);
        return el;
    };
    return TouchContols;
}());
var MazeGame = (function () {
    // dennis.janszon@hotmail.com, 0706389858
    function MazeGame(mapGen, settings, analyzerNode) {
        //this.ctrl = new TouchContols("#placeholder");
        var _this = this;
        this.mapGen = mapGen;
        this.analyzerNode = analyzerNode;
        this.ctrl = new Noc.GameEngine.Controls(document);
        this.stage = new Noc.GameEngine.Stage(settings);
        this.bgScene = this.stage.createScene("backgroundScene");
        this.gameScene = this.stage.createScene("game");
        this.gameStaticEntities = this.stage.createScene("gameStatic");
        /*
        Create entities
        */
        var camera = new Noc.GameEngine.Camera2D(32.46, 36.27, 4.71238898038469);
        // todo:create a generic loader for all assets
        // check content type 
        var assets = new Noc.GameEngine.Images(["assets/temp-text.jpg",
            "assets/tex03.jpg", "assets/bg-start.jpg"]);
        '';
        assets.downloadAll(function () {
            var startGame = function () {
                mazeMap.isHidden = false;
                miniMap.isHidden = true;
                compassNeedle.isHidden = false;
                compassBackground.isHidden = false;
                floor.isHidden = false;
                _this.bgScene.render(0);
                _this.bgScene.show();
                _this.gameStaticEntities.show();
                _this.gameStaticEntities.render(0);
            };
            var stopGame = function () {
                mazeMap.isHidden = true;
                miniMap.isHidden = true;
                floor.isHidden = true;
                compassNeedle.isHidden = true;
                compassBackground.isHidden = true;
            };
            var startScreen = new StartScreen(assets.getImage("assets/bg-start.jpg"));
            startScreen.onStart = function (evt) {
                _this.gameScene.getEntity("startScreen").isHidden = true;
                _this.gameScene.getEntity("countDown").isHidden = false;
            };
            var countDown = new CountDown();
            countDown.onEnded = function (ts) {
                startGame();
            };
            var firstMap = _this.generateMaze();
            var mazeMap = new MazeMap(camera, _this.ctrl, firstMap, assets.getImage("assets/temp-text.jpg"), analyzerNode);
            var miniMap = new MiniMap(firstMap, 34, 10);
            miniMap.onToggle = function (evt) {
                _this.gameStaticEntities.clear();
                _this.gameStaticEntities.render(0);
            };
            var floor = new Floor();
            var compassBackground = new CompassBackground();
            var compassNeedle = new CompassNeedle(camera);
            var sky = new Sky();
            var finish = new Finish();
            _this.gameScene.addEntities([mazeMap, miniMap, compassBackground, compassNeedle]);
            _this.bgScene.addEntities([floor]);
            //  this.gameStaticEntities.addEntities([miniMap])
            _this.gameScene.addEntity(startScreen);
            _this.gameScene.addEntity(countDown);
            var time = document.querySelector(".time");
            var distance = document.querySelector(".distance");
            // todo: move to game logic / rules engine
            var exitPoint = new Noc.GameEngine.Point2D(1.5, 1.5);
            var fps = document.querySelector(".fps");
            _this.gameScene.onFrame = function (ts) {
                var m = Math.floor(ts / 1000 / 60 << 0);
                var s = Math.floor(ts / 1000 % 60);
                //     fps.textContent = Math.floor(this.gameScene.fps).toString()
                time.textContent = m + ":" + s;
                distance.textContent = Math.ceil((camera.distanceToPoint(exitPoint) * 100) * 1.063) + " m";
            };
            stopGame();
            _this.bgScene.render(0);
            _this.gameScene.start();
            _this.gameStaticEntities.render(0);
        });
    }
    MazeGame.prototype.generateMaze = function (size, branches) {
        var mazeArray = this.mapGen.create(32, 32, 2);
        var flattenedMaze = Noc.GameEngine.Utils.Repeat(1, 34 * 34);
        var offset = 34;
        var step = 35;
        for (var i = 0; i < mazeArray.length; i++) {
            var walls = mazeArray[i];
            for (var n = 0; n < walls.length; n++) {
                flattenedMaze[step + n + (offset * i)] = walls[n];
            }
        }
        return this.openMaze(flattenedMaze, 34);
    };
    MazeGame.prototype.openMaze = function (arr, size) {
        var exit = arr.indexOf(0) - size;
        var entrance = arr.lastIndexOf(0) + size;
        arr[exit] = 0;
        arr[entrance] = 0;
        return arr;
    };
    return MazeGame;
}());
//# sourceMappingURL=main.js.map