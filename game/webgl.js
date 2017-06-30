var WebGLTest = (function () {
    function WebGLTest(placeholder) {
        this.placeholder = placeholder;
        var settings = new Noc.GameEngine.StageSettings();
        settings.height = 405;
        settings.width = 720;
        settings.placeholder = placeholder;
        this.stage = new Noc.GameEngine.Stage(settings);
        this.scene = this.stage.createScene("myScene", settings.width, settings.height, "webgl");
    }
    return WebGLTest;
}());
//# sourceMappingURL=webgl.js.map