//import 'reflect-metadata';

//   export function Networkable(state: boolean) {
//         return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
//             Reflect.defineMetadata("Networkable", state, target, propertyKey);
//         }
//     } 

    
namespace Noc.GameEngine {

  
   
    export class Utils{
        static fastFloor(num:number){
            return (0.5 + num) | 0;
        }
        static fastRound(num:number){
                return ~~(num + (num > 0 ? .5 : -.5));
        }
        static Repeat<T>(value: T, times: number): Array<T> {
        return Array.apply(null, new Array(times)).map(function () {
            return value;
        });
    }
    }

    export class ViewPort {
        constructor(public id: string, public width: number, public height: number) {
        }
    }



    export class Map {
        constructor(){
     }
        get(x: number, y: number): any {
            return;
        }
    }

    export class Circle {
            constructor(public point:Point3D | Point2D,public r:number)
            {

            }
            get x():number{
                return this.point.x;
            }
            get y(){
                return this.point.y;
            }
    }
    export class Rectangle{
            constructor(public point:Point3D | Point2D,public w:number,public h:number){

            }
            get x(){
                return this.point.x;
            }
            get y(){
                return this.point.y;
            }
    }

    export class Triangle {
        constructor(public a: Point3D, public b: Point3D, public c: Point3D) {
        }
    }
    export class Controls{
        codes: any;
        states: any;
        constructor(public element:HTMLElement | Document){
             this.codes = 
             { 37: 'left', 39: 'right', 38: 'forward', 40: 'backward'};
            this.states = { 'left': false, 'right': false, 'forward': false, 'backward': false };
            element.addEventListener('keydown', this.onKey.bind(this, true), false);
            element.addEventListener('keyup', this.onKey.bind(this, false), false);
        }
        trigger(val:any){
            var state = this.codes[val];
            if (typeof state === 'undefined') return;
            this.states[state] = val;
        }
        onKey(val:any,evt:KeyboardEvent){
        var state = this.codes[evt.keyCode];
        if (typeof state === 'undefined') return;
        this.states[state] = val;
        evt.preventDefault && evt.preventDefault();
        evt.stopPropagation && evt.stopPropagation();
        }
    }

    export class Camera2D {
        

        paces: number;
        constructor(public x: number, public y: number, public direction?: number) {
            this.paces = 0;
        }
        point(): Point2D {
            return new Noc.GameEngine.Point2D(this.x, this.y);
        }

        distanceToPoint(point:Noc.GameEngine.Point2D):number{
        
            let k = Math.sqrt(this.x + point.x * this.y + point.y);
            return k;
        }

        rotate(angle: number) {
            const circle = Math.PI * 2;
            this.direction = (this.direction + angle + circle) % circle;
        }
        move(distance: any, map: Map) {
            let dx = Math.cos(this.direction) * distance;
            let dy = Math.sin(this.direction) * distance;

            if (map.get(this.x + dx, this.y) <= 0) this.x += dx;
            if (map.get(this.x, this.y + dy) <= 0) this.y += dy;
            this.paces += distance;
        }
        update(controls: any, map: Map, ts: number) {
            if (controls.left) this.rotate(-Math.PI * ts);
            if (controls.right) this.rotate(Math.PI * ts);
            if (controls.forward) this.move(3 * ts, map);
            if (controls.backward) this.move(-3 * ts, map);

        }
    }


    export class CollitionDetector{

        constructor(){

        }

         circularDetection(a:Circle,b:Circle){
                let dx = a.x - b.x;
                let dy = a.y - b.y;
                let k = a.r + b.r;
                return (dx * dx + dy * dy <= k * k)
        }

        rectangularDetection(a:Rectangle,b:Rectangle){
            if (a.x < b.x + b.w &&
                a.x + a.w > b.x &&
                a.y < b.y + b.h &&
                a.h + a.y > b.y) {
                    return true;
                }
                return false;
        }
    }
    /*
        Noc Vectors
    
    */
    export class UV{
        u:number;
        v:number;
        constructor(u:number,v:number){
            this.u = u;
            this.v = v;
        }
    }

    // export class ProjectedPoints extends Array<Point3D>{
    //     constructor(size?:number){
    //         super(size | 0);
    //     }
    //     project(w:number,h:number,fov:number,number,d:number):Array<Point3D>{
    //       for(let i = 0;i <= this.length;i++){
    //           this[i].project(w,h,fov,d);
    //       }
    //       return this;
    //     }
    // }

    export class Geometry {
        verticles: Array<Point3D>;
        faces: Array<Face>;

        constructor(public name: string) {

            this.faces = new Array<Face>();
            this.verticles = new Array<Point3D>();

        }

        rotate(x:number,y:number,number,z:number):Array<Point3D>{
            let verticles = new Array<Point3D>();
            
            this.faces.forEach( (f:Face,index:number) =>{
                let tri = this.getTriangle(f);
                tri.forEach( (p:Point3D) => {
                        verticles.push(
                            p.rotateX(x).rotateY(y).rotateZ(x))
                });
            });
            return verticles;
        }

        getTriangle(face:Noc.GameEngine.Face):Array<Noc.GameEngine.Point3D>{
            return new Array<Point3D>(
                this.verticles[face.a],
                this.verticles[face.b],
                this.verticles[face.c]);
        }
       

    }

    export class Face {
        a:number;
        b:number;
        c:number;
        faceVertexUvs: Array<Array<Noc.GameEngine.UV>>;
        constructor(a:number,b:number,c:number){
            this.faceVertexUvs = Array<Array<Noc.GameEngine.UV>>();
            this.a = a;
            this.b = b;
            this.c = c;
        }
        addVertexUvs(uvs:Array<Noc.GameEngine.UV>){
                this.faceVertexUvs.push(uvs);
        }
       
    }


    export class Point2D{
            x: number;
            y: number;
            constructor(x?:number,y?:number){
                this.x = x || 0;
                this.y = y || 0;
            }
    }

    export class Point3D extends Point2D {

        constructor(x?: number, y?: number, public z?: number) {
                super();
                this.x = x;
                this.y = y;
                this.z = z || 0;
        }

        project(w, h, fov, d): Point3D {
            const factor = fov / (d + this.z);
            const x = this.x * factor + w / 2;
            const y = this.y * factor + h / 2
            return new Point3D(x, y, this.z);
        }

        rotateX(angle: number) {
            const rad = angle * Math.PI / 180;
            let cosa = Math.cos(rad);
            let sina = Math.sin(rad);
            let y = this.y * cosa - this.z * sina;
            let z = this.y * sina * this.z * cosa;
            return new Point3D(this.x, y, this.z);
        }
        rotateY(angle: number) {
            const rad = angle * Math.PI / 180;
            const cosa = Math.cos(rad);
            const sina = Math.sin(rad);
            let z = this.z * cosa - this.z * sina;
            let x = this.z * sina + this.x * cosa;
            return new Point3D(x, this.y, z);

        }
        rotateZ(angle: number) {
            let rad = angle * Math.PI / 180;
            let cosa = Math.cos(rad);
            let sina = Math.sin(rad);
            let x = this.x * cosa - this.y * sina;
            let y = this.z * sina + this.y * cosa;
            return new Point3D(x, y, this.z);
        }
        clone() {
            return new Point3D(this.x, this.y, this.z);
        }
        scale(scale: number) {
            this.x *= scale;
            this.y *= scale;
            this.z *= scale;
        }
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

        }
        normalize() {
            let l = this.length();
            if (length != 0) {
                this.z /= l;
                this.y /= l;
                this.z /= l;
            } else {
                return false;
            }
        }
        dot(vectorB: Point3D) {
            return this.x * vectorB.x + this.y * vectorB.y + this.z * vectorB.z;
        }
        angle(bvector: Point3D): number {
            let anorm = this.clone();
            anorm.normalize();
            let bnorm = new Point3D(bvector.x, bvector.y, bvector.z);
            bnorm.normalize();
            let dot = anorm.dot(bnorm);
            return Math.acos(dot);
        }
    }


    /*
      Noc Assets ( Image,Sound and Assets preloading)
    */
    export class Images {
        downloadQueue: Array<any>;
        successCount: number;
        errorCount: number;
        cache: Object
        constructor(public imagesUrls: Array<string>) {

            this.downloadQueue = new Array<any>();
            this.successCount = 0;
            this.errorCount = 0;
            this.cache = new Object();

            this.imagesUrls.forEach((url: string) => {
                this.downloadQueue.push(url);
            });


        }
        isDone(): boolean {
            return (this.downloadQueue.length == this.successCount + this.errorCount);
        }
        downloadAll(downloadCallback: Function) {
            if (this.downloadQueue.length === 0) {
                downloadCallback();
            }
            for (let i = 0; i < this.downloadQueue.length; i++) {
                let path = this.downloadQueue[i];
                let img = new Image();
                img.addEventListener("load", () => {
                    this.successCount += 1;
                    if (this.isDone()) {
                        downloadCallback();
                    }
                }, false);

                img.addEventListener("error", () => {
                    this.errorCount += 1;
                    if (this.isDone()) {
                        downloadCallback();
                    }
                }, false);
                img.src = path;
                this.cache[path] = img;
            }
        }
        getImage(path: string): HTMLImageElement {
            if (!this.cache.hasOwnProperty(path)) throw "image not found '" + path + "'";
            return this.cache[path] as HTMLImageElement

        }

    }
    /*
        Noc Storyboard
    */
    export class Lifetime {
        constructor(public startMs: number, public stopMs: number) {
        }
        push(ms: number) {
            this.startMs += ms;
            this.stopMs += ms;
        }
        pull(ms: number) {
            this.startMs -= ms;
            this.stopMs -= ms;
        }
        stretch() {
        }
    }

    /*
        Noc Entity
    */
    export class Listner{
            constructor(public name:string,public fn:Function){
            }
    } 

    export interface INocEntity {
        id: string;
        key: string;
        update: (context: CanvasRenderingContext2D | WebGLRenderingContext, ts?: number) => void;
        lifeTime: Lifetime;
    }

    export class NocEntityBase {
        id:string;
        key:string;
        isHidden: boolean;
        lifeTime: Lifetime;
        onUpdate: (time: number) => void;
        onLifeTimeElapsed: (time: number) => void;
        onEnded: (evt:any) => void;
        dispatch: (name:string,args:any) => void;

        private Childs: Array<NocEntityBase>;
        
        eventListener: Array<Listner>;
        
        constructor() {
            this.eventListener = new Array<Listner>();
            this.Childs = new Array<NocEntityBase>();
        }

        update(context: CanvasRenderingContext2D | WebGLRenderingContext, ts?: number){
                throw "update not implemented?";
        }

        addEventListener(name:string,fn:Function):void{
            this.eventListener.push(new Listner(name,fn));
        }

        toDegrees(rad: number): number {
            return rad * 180 / Math.PI
        }

        toRadians(deg: number): number {
            return deg * Math.PI / 180;
        }
        addChilld(entity: NocEntityBase): void {
            this.Childs.push(entity);
        }
        removeBindig(entity) {
            throw "not yet implemented";
        }
        toggle():void{
                this.isHidden = !this.isHidden;
        }
        getEntityFromChilds(key: string): NocEntityBase {
            let result = this.Childs.filter((pre: NocEntityBase) => {
                return pre.key === key;
            });
            if(result.length === 0) throw "Entity not found"
            return result[0];
        }
       
        drawTriangle(context: CanvasRenderingContext2D, 
                verticles: Array<Noc.GameEngine.Point3D>,) {
            let x0 = verticles[0].x, y0 = verticles[0].y;
            let x1 = verticles[1].x, y1 = verticles[1].y;
            let x2 = verticles[2].x, y2 = verticles[2].y;
            context.save();
            context.beginPath();
                context.strokeStyle = "#ffffff";
                context.lineWidth = 1;
                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.lineTo(x2, y2);
                context.fillStyle = "#ff0000";
                context.fill();
                context.closePath();
                context.stroke();
            context.restore();
        }
        textureMap(ctx:CanvasRenderingContext2D,texture: HTMLImageElement,
                x0:number, y0:number,x1:number, y1:number,x2:number, y2:number,
                 u0:number, v0:number, u1:number, v1:number, u2:number, v2:number):void{
     
            ctx.save();
            ctx.beginPath();

            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.clip();

            var delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
            
            var deltaA = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
            var deltaB = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
            var deltaC = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2

            var deltaD = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
            var deltaE = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
            var deltaF = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;
                
            ctx.transform(deltaA / delta, deltaD / delta,
                                deltaB / delta, deltaE / delta,
                                deltaC / delta, deltaF / delta);
            ctx.drawImage(texture, 0, 0);
            ctx.restore();

    }

        

    }
  
    /*
        Noc Render engine
    */

    export class StageSettings{
        width:number;
        height:number;
        placeholder:HTMLElement
    }

    export class Stage{
        public scenes: Array<Scene>;
        
        constructor(public settings:StageSettings){
            this.scenes = new Array<Scene>();
        }
        findScene(name:string){
            throw "Not yet implemented";
        }
        createScene(name:string,w?:number,h?:number,contextType?:string){
            let canvas = document.createElement("canvas");
            canvas.width = w || this.settings.width;
            canvas.height = h || this.settings.height;

            let rafl = requestAnimationFrame;

            let scene = new Scene(name,rafl,canvas,this.settings.placeholder,contextType || "2d")
            this.scenes.push(scene)
            this.settings.placeholder.appendChild(canvas);
            return scene;
        }
        
    }

    export class Scene {
        public viewPort: ViewPort;
        public isEnabled: boolean;
        public entities: Array<NocEntityBase>;
        private context: CanvasRenderingContext2D | WebGLRenderingContext
        public onFrame: (t: number) => void;
        private prevTime: any;
        fps:number;
        
        constructor(public name:string,requestAnimationFrame: any, public surface: HTMLCanvasElement,
            public container?: Element,contextType?:string) {
            this.entities = new Array<NocEntityBase>();
            this.isEnabled = false;
            this.context = surface.getContext(contextType);
            this.viewPort = new ViewPort("myViewPort", surface.width, surface.height);
        
            window.addEventListener("resize", (evt: UIEvent) => {
                this.resize();
            });
            this.resize();
            container.addEventListener("touchstart", (evt:TouchEvent)=>{
                this.fireListeners("touchstart",evt);
            });
            container.addEventListener("touchend", (evt:TouchEvent) => {
                this.fireListeners("touchend",evt);
            });
        }

        hide(){
            this.surface.classList.add("hide");            
        }
        show(){
            this.surface.classList.remove("hide");
        }
        public getActiveEntities(){
                return  this.entities.filter( (ent:NocEntityBase) => {
                    return !ent.isHidden
                });
        }

        private fireListeners(name:string,evt:any){
            
               
               let filtered = this.entities.map( (ent:NocEntityBase) => {
                    
                        let listeners = ent.eventListener.filter( (t:Listner) => {
                                return t.name ==  name;
                        });
                        return listeners;
                });
                let targets = filtered.filter( (a:Array<Listner>) => {
                        return a.length > 0
                });
              
                targets.forEach( (listeners:Array<Listner>) => {
                    listeners.forEach( (l:Listner) => {
                    l.fn(evt);
                    });
                });
        }
        
        resize():void {
            this.context.canvas.width = this.container.clientWidth;
            this.context.canvas.height = this.container.clientHeight;
        }
        clear():void {
            this.context.canvas.width = this.context.canvas.width;
        }

        addEntities(entities: Array<NocEntityBase>) {
            entities.forEach((ent: NocEntityBase) => {
                this.addEntity(ent);
            });
        }

        getEntity(key: string): NocEntityBase {
            let result = this.entities.filter((pre: NocEntityBase) => {
                return pre.key === key;
            });
            if(result.length === 0) throw "Entity not found - " + key;
            return result[0];
        }

        addEntity(entity: NocEntityBase): void {
            let fn =  function(name:string,args:any){
                this.fireListeners(name,args);
             }.bind(this);
            entity.dispatch = fn 
            this.entities.push(entity);
        }

        removeEntity(entity:NocEntityBase):void {            
            let match  = this.entities.indexOf(entity);
            if(match >= 0) 
                    this.entities.splice(match,1);
        }

        getVisibleEntities(ms): Array<NocEntityBase> {
            return this.entities.filter((entity: NocEntityBase) => {
                return entity.lifeTime && !entity.isHidden;
            });
        }

        private renderEntities(elapsed?: number): void {
            this.clear();
            const now = Date.now();
            this.fps = 1000/(elapsed - this.prevTime);
            if (this.isEnabled) {
                this.render(elapsed);
                // this.entities.forEach((entity:  NocEntityBase) => {
                //     if(!entity.isHidden)
                //         entity.update(this.context, elapsed);
                // });
                this.prevTime = elapsed;
            }
            requestAnimationFrame((elapsed: number) => {
                this.renderEntities(elapsed);
                if (this.onFrame) this.onFrame(elapsed);
            });
        }
        renderAll(){
          
        }
        render(elapsed:number){
            
            this.entities.forEach((entity:  NocEntityBase) => {
               
                    if(!entity.isHidden){
                        
                          entity.update(this.context,elapsed);
                    }
                    
                      
                });
        }
        start() {
            this.prevTime = 0;
            this.isEnabled = true;
            this.renderEntities(0);
        }
        stop() {
            this.isEnabled = false;
        }


    }

}

