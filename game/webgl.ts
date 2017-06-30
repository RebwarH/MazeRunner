class WebGLTest{


    stage: Noc.GameEngine.Stage;
    scene: Noc.GameEngine.Scene;

    constructor(public placeholder:HTMLElement){

        let settings =   new Noc.GameEngine.StageSettings();

        settings.height = 405
        settings.width = 720;
        settings.placeholder = placeholder;

        this.stage = new Noc.GameEngine.Stage(
          settings
        );  

        this.scene = this.stage.createScene("myScene",settings.width,settings.height,
        "webgl");

    }

}