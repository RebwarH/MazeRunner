
class TouchContols{
        public elements: Array<HTMLDivElement>;
        codes: any;
        states: any;
        constructor(selector:string){

            this.codes = 
             { 'left': 'left', 'right': 'right', 'forward': 'forward', 'backward': 'backward'};

            this.states = { 'left': false, 'right': false, 'forward': false, 'backward': false };
            
            this.elements = new Array<HTMLDivElement>();
            // set up left,right, up & down childs

            let parent = document.querySelector(selector);

            this.createEl("left");
            this.createEl("right");
            this.createEl("forward");
            this.createEl("backward");
            
            this.elements.forEach ( (el:HTMLDivElement) => {
                parent.appendChild(el);
            });

        }
        onKey(val:any,evt:TouchEvent){
            let el = evt.srcElement as any;
            let dataset = el.dataset as any;6
            var state = this.codes[dataset.direction];
           
            if (typeof state === 'undefined') return;
            this.states[state] = val;
        
            evt.preventDefault && evt.preventDefault();
            evt.stopPropagation && evt.stopPropagation()
        
        }

        private addListener(el:HTMLElement){
            el.addEventListener('touchstart', this.onKey.bind(this, true), false);
            el.addEventListener('touchend', this.onKey.bind(this, false), false);
        }

        private createEl(direction:string):HTMLDivElement{
             let el =  document.createElement("div");
                el.classList.add("noc-tc")
                el.classList.add(direction);
                
                el.dataset["direction"] = direction;

                this.addListener(el);

                this.elements.push(el);

                return el;
        }
}


class MazeGame {
    public gameScene: Noc.GameEngine.Scene;
    public gameStaticEntities: Noc.GameEngine.Scene;
    public lobbyScene: Noc.GameEngine.Scene;
    public bgScene: Noc.GameEngine.Scene;
    public ctrl: Noc.GameEngine.Controls | TouchContols
    public stage: Noc.GameEngine.Stage;


      generateMaze(size?:number,branches?:number):Array<number> {
            let mazeArray =  this.mapGen.create(32,32,2)

            let flattenedMaze = Noc.GameEngine.Utils.Repeat<number>(1, 34 * 34);

                var offset = 34;
                var step = 35;
                for (let i = 0; i < mazeArray.length; i++) {
                    var walls = mazeArray[i];
                    for (var n = 0; n < walls.length; n++) {
                        flattenedMaze[step + n + (offset * i)] = walls[n];
                    }
                }
                
                return this.openMaze(flattenedMaze, 34);

        }

         openMaze(arr:Array<number>, size:number):Array<number> {
                    let exit = arr.indexOf(0) - size;
                    let entrance = arr.lastIndexOf(0) + size;
                    arr[exit] = 0;
                    arr[entrance] = 0;
                    return arr;
        }



         // dennis.janszon@hotmail.com, 0706389858



    constructor(public mapGen: any, settings: Noc.GameEngine.StageSettings,public analyzerNode:AnalyserNode) {


        //this.ctrl = new TouchContols("#placeholder");

        this.ctrl = new Noc.GameEngine.Controls(document);

        this.stage = new Noc.GameEngine.Stage(settings);

        this.bgScene = this.stage.createScene("backgroundScene");

        this.gameScene = this.stage.createScene("game");
        this.gameStaticEntities = this.stage.createScene("gameStatic");

        /*
        Create entities
        */

        let camera = new Noc.GameEngine.Camera2D(32.46, 36.27, 4.71238898038469);

        // todo:create a generic loader for all assets
        // check content type 
        let assets = new Noc.GameEngine.Images(["assets/temp-text.jpg",
            "assets/tex03.jpg", "assets/bg-start.jpg"]);
''
        assets.downloadAll(() => {

            let startGame = () => {
                mazeMap.isHidden = false; miniMap.isHidden = true;
                compassNeedle.isHidden = false; compassBackground.isHidden = false;
                floor.isHidden = false;
                this.bgScene.render(0);
                this.bgScene.show();
                this.gameStaticEntities.show();
                this.gameStaticEntities.render(0);
            }

            let stopGame = () => {
                mazeMap.isHidden = true; miniMap.isHidden = true; floor.isHidden = true;
                compassNeedle.isHidden = true; compassBackground.isHidden = true;
            }

            let startScreen = new StartScreen(assets.getImage("assets/bg-start.jpg"));
            startScreen.onStart = (evt: any) => {
                this.gameScene.getEntity("startScreen").isHidden = true;
                this.gameScene.getEntity("countDown").isHidden = false;

            };

            let countDown = new CountDown();

            countDown.onEnded = (ts) => {
                startGame();
            };

            let firstMap = this.generateMaze(); 

            let mazeMap = new MazeMap(camera, this.ctrl, firstMap, assets.getImage("assets/temp-text.jpg"),
            analyzerNode
            );
            let miniMap = new MiniMap(firstMap, 34, 10);

            miniMap.onToggle = (evt) => {
                this.gameStaticEntities.clear();
                this.gameStaticEntities.render(0);
            }

            let floor = new Floor();
            let compassBackground = new CompassBackground();
            let compassNeedle = new CompassNeedle(camera);
            let sky = new Sky();
            let finish = new Finish();

            this.gameScene.addEntities([mazeMap,miniMap,compassBackground, compassNeedle]);

            this.bgScene.addEntities([floor]);

          //  this.gameStaticEntities.addEntities([miniMap])

            this.gameScene.addEntity(startScreen);
            this.gameScene.addEntity(countDown);

            let time = document.querySelector(".time");
            let distance = document.querySelector(".distance");

            // todo: move to game logic / rules engine
            let exitPoint = new Noc.GameEngine.Point2D(1.5, 1.5);

            let fps = document.querySelector(".fps");
            this.gameScene.onFrame = (ts: number) => {

                let m = Math.floor(ts / 1000 / 60 << 0);
                let s = Math.floor(ts / 1000 % 60);

                //     fps.textContent = Math.floor(this.gameScene.fps).toString()

             time.textContent = m + ":" + s;
            distance.textContent = Math.ceil((camera.distanceToPoint(exitPoint) * 100) * 1.063) + " m"
            };

            stopGame();

            this.bgScene.render(0);
            this.gameScene.start();
            this.gameStaticEntities.render(0);

        });
    }
}

