//import 'reflect-metadata';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//   export function Networkable(state: boolean) {
//         return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
//             Reflect.defineMetadata("Networkable", state, target, propertyKey);
//         }
//     } 
var Noc;
(function (Noc) {
    var GameEngine;
    (function (GameEngine) {
        var Utils = (function () {
            function Utils() {
            }
            Utils.fastFloor = function (num) {
                return (0.5 + num) | 0;
            };
            Utils.fastRound = function (num) {
                return ~~(num + (num > 0 ? .5 : -.5));
            };
            Utils.Repeat = function (value, times) {
                return Array.apply(null, new Array(times)).map(function () {
                    return value;
                });
            };
            return Utils;
        }());
        GameEngine.Utils = Utils;
        var ViewPort = (function () {
            function ViewPort(id, width, height) {
                this.id = id;
                this.width = width;
                this.height = height;
            }
            return ViewPort;
        }());
        GameEngine.ViewPort = ViewPort;
        var Map = (function () {
            function Map() {
            }
            Map.prototype.get = function (x, y) {
                return;
            };
            return Map;
        }());
        GameEngine.Map = Map;
        var Circle = (function () {
            function Circle(point, r) {
                this.point = point;
                this.r = r;
            }
            Object.defineProperty(Circle.prototype, "x", {
                get: function () {
                    return this.point.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Circle.prototype, "y", {
                get: function () {
                    return this.point.y;
                },
                enumerable: true,
                configurable: true
            });
            return Circle;
        }());
        GameEngine.Circle = Circle;
        var Rectangle = (function () {
            function Rectangle(point, w, h) {
                this.point = point;
                this.w = w;
                this.h = h;
            }
            Object.defineProperty(Rectangle.prototype, "x", {
                get: function () {
                    return this.point.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "y", {
                get: function () {
                    return this.point.y;
                },
                enumerable: true,
                configurable: true
            });
            return Rectangle;
        }());
        GameEngine.Rectangle = Rectangle;
        var Triangle = (function () {
            function Triangle(a, b, c) {
                this.a = a;
                this.b = b;
                this.c = c;
            }
            return Triangle;
        }());
        GameEngine.Triangle = Triangle;
        var Controls = (function () {
            function Controls(element) {
                this.element = element;
                this.codes =
                    { 37: 'left', 39: 'right', 38: 'forward', 40: 'backward' };
                this.states = { 'left': false, 'right': false, 'forward': false, 'backward': false };
                element.addEventListener('keydown', this.onKey.bind(this, true), false);
                element.addEventListener('keyup', this.onKey.bind(this, false), false);
            }
            Controls.prototype.trigger = function (val) {
                var state = this.codes[val];
                if (typeof state === 'undefined')
                    return;
                this.states[state] = val;
            };
            Controls.prototype.onKey = function (val, evt) {
                var state = this.codes[evt.keyCode];
                if (typeof state === 'undefined')
                    return;
                this.states[state] = val;
                evt.preventDefault && evt.preventDefault();
                evt.stopPropagation && evt.stopPropagation();
            };
            return Controls;
        }());
        GameEngine.Controls = Controls;
        var Camera2D = (function () {
            function Camera2D(x, y, direction) {
                this.x = x;
                this.y = y;
                this.direction = direction;
                this.paces = 0;
            }
            Camera2D.prototype.point = function () {
                return new Noc.GameEngine.Point2D(this.x, this.y);
            };
            Camera2D.prototype.distanceToPoint = function (point) {
                var k = Math.sqrt(this.x + point.x * this.y + point.y);
                return k;
            };
            Camera2D.prototype.rotate = function (angle) {
                var circle = Math.PI * 2;
                this.direction = (this.direction + angle + circle) % circle;
            };
            Camera2D.prototype.move = function (distance, map) {
                var dx = Math.cos(this.direction) * distance;
                var dy = Math.sin(this.direction) * distance;
                if (map.get(this.x + dx, this.y) <= 0)
                    this.x += dx;
                if (map.get(this.x, this.y + dy) <= 0)
                    this.y += dy;
                this.paces += distance;
            };
            Camera2D.prototype.update = function (controls, map, ts) {
                if (controls.left)
                    this.rotate(-Math.PI * ts);
                if (controls.right)
                    this.rotate(Math.PI * ts);
                if (controls.forward)
                    this.move(3 * ts, map);
                if (controls.backward)
                    this.move(-3 * ts, map);
            };
            return Camera2D;
        }());
        GameEngine.Camera2D = Camera2D;
        var CollitionDetector = (function () {
            function CollitionDetector() {
            }
            CollitionDetector.prototype.circularDetection = function (a, b) {
                var dx = a.x - b.x;
                var dy = a.y - b.y;
                var k = a.r + b.r;
                return (dx * dx + dy * dy <= k * k);
            };
            CollitionDetector.prototype.rectangularDetection = function (a, b) {
                if (a.x < b.x + b.w &&
                    a.x + a.w > b.x &&
                    a.y < b.y + b.h &&
                    a.h + a.y > b.y) {
                    return true;
                }
                return false;
            };
            return CollitionDetector;
        }());
        GameEngine.CollitionDetector = CollitionDetector;
        /*
            Noc Vectors
        
        */
        var UV = (function () {
            function UV(u, v) {
                this.u = u;
                this.v = v;
            }
            return UV;
        }());
        GameEngine.UV = UV;
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
        var Geometry = (function () {
            function Geometry(name) {
                this.name = name;
                this.faces = new Array();
                this.verticles = new Array();
            }
            Geometry.prototype.rotate = function (x, y, number, z) {
                var _this = this;
                var verticles = new Array();
                this.faces.forEach(function (f, index) {
                    var tri = _this.getTriangle(f);
                    tri.forEach(function (p) {
                        verticles.push(p.rotateX(x).rotateY(y).rotateZ(x));
                    });
                });
                return verticles;
            };
            Geometry.prototype.getTriangle = function (face) {
                return new Array(this.verticles[face.a], this.verticles[face.b], this.verticles[face.c]);
            };
            return Geometry;
        }());
        GameEngine.Geometry = Geometry;
        var Face = (function () {
            function Face(a, b, c) {
                this.faceVertexUvs = Array();
                this.a = a;
                this.b = b;
                this.c = c;
            }
            Face.prototype.addVertexUvs = function (uvs) {
                this.faceVertexUvs.push(uvs);
            };
            return Face;
        }());
        GameEngine.Face = Face;
        var Point2D = (function () {
            function Point2D(x, y) {
                this.x = x || 0;
                this.y = y || 0;
            }
            return Point2D;
        }());
        GameEngine.Point2D = Point2D;
        var Point3D = (function (_super) {
            __extends(Point3D, _super);
            function Point3D(x, y, z) {
                _super.call(this);
                this.z = z;
                this.x = x;
                this.y = y;
                this.z = z || 0;
            }
            Point3D.prototype.project = function (w, h, fov, d) {
                var factor = fov / (d + this.z);
                var x = this.x * factor + w / 2;
                var y = this.y * factor + h / 2;
                return new Point3D(x, y, this.z);
            };
            Point3D.prototype.rotateX = function (angle) {
                var rad = angle * Math.PI / 180;
                var cosa = Math.cos(rad);
                var sina = Math.sin(rad);
                var y = this.y * cosa - this.z * sina;
                var z = this.y * sina * this.z * cosa;
                return new Point3D(this.x, y, this.z);
            };
            Point3D.prototype.rotateY = function (angle) {
                var rad = angle * Math.PI / 180;
                var cosa = Math.cos(rad);
                var sina = Math.sin(rad);
                var z = this.z * cosa - this.z * sina;
                var x = this.z * sina + this.x * cosa;
                return new Point3D(x, this.y, z);
            };
            Point3D.prototype.rotateZ = function (angle) {
                var rad = angle * Math.PI / 180;
                var cosa = Math.cos(rad);
                var sina = Math.sin(rad);
                var x = this.x * cosa - this.y * sina;
                var y = this.z * sina + this.y * cosa;
                return new Point3D(x, y, this.z);
            };
            Point3D.prototype.clone = function () {
                return new Point3D(this.x, this.y, this.z);
            };
            Point3D.prototype.scale = function (scale) {
                this.x *= scale;
                this.y *= scale;
                this.z *= scale;
            };
            Point3D.prototype.length = function () {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            };
            Point3D.prototype.normalize = function () {
                var l = this.length();
                if (length != 0) {
                    this.z /= l;
                    this.y /= l;
                    this.z /= l;
                }
                else {
                    return false;
                }
            };
            Point3D.prototype.dot = function (vectorB) {
                return this.x * vectorB.x + this.y * vectorB.y + this.z * vectorB.z;
            };
            Point3D.prototype.angle = function (bvector) {
                var anorm = this.clone();
                anorm.normalize();
                var bnorm = new Point3D(bvector.x, bvector.y, bvector.z);
                bnorm.normalize();
                var dot = anorm.dot(bnorm);
                return Math.acos(dot);
            };
            return Point3D;
        }(Point2D));
        GameEngine.Point3D = Point3D;
        /*
          Noc Assets ( Image,Sound and Assets preloading)
        */
        var Images = (function () {
            function Images(imagesUrls) {
                var _this = this;
                this.imagesUrls = imagesUrls;
                this.downloadQueue = new Array();
                this.successCount = 0;
                this.errorCount = 0;
                this.cache = new Object();
                this.imagesUrls.forEach(function (url) {
                    _this.downloadQueue.push(url);
                });
            }
            Images.prototype.isDone = function () {
                return (this.downloadQueue.length == this.successCount + this.errorCount);
            };
            Images.prototype.downloadAll = function (downloadCallback) {
                var _this = this;
                if (this.downloadQueue.length === 0) {
                    downloadCallback();
                }
                for (var i = 0; i < this.downloadQueue.length; i++) {
                    var path = this.downloadQueue[i];
                    var img = new Image();
                    img.addEventListener("load", function () {
                        _this.successCount += 1;
                        if (_this.isDone()) {
                            downloadCallback();
                        }
                    }, false);
                    img.addEventListener("error", function () {
                        _this.errorCount += 1;
                        if (_this.isDone()) {
                            downloadCallback();
                        }
                    }, false);
                    img.src = path;
                    this.cache[path] = img;
                }
            };
            Images.prototype.getImage = function (path) {
                if (!this.cache.hasOwnProperty(path))
                    throw "image not found '" + path + "'";
                return this.cache[path];
            };
            return Images;
        }());
        GameEngine.Images = Images;
        /*
            Noc Storyboard
        */
        var Lifetime = (function () {
            function Lifetime(startMs, stopMs) {
                this.startMs = startMs;
                this.stopMs = stopMs;
            }
            Lifetime.prototype.push = function (ms) {
                this.startMs += ms;
                this.stopMs += ms;
            };
            Lifetime.prototype.pull = function (ms) {
                this.startMs -= ms;
                this.stopMs -= ms;
            };
            Lifetime.prototype.stretch = function () {
            };
            return Lifetime;
        }());
        GameEngine.Lifetime = Lifetime;
        /*
            Noc Entity
        */
        var Listner = (function () {
            function Listner(name, fn) {
                this.name = name;
                this.fn = fn;
            }
            return Listner;
        }());
        GameEngine.Listner = Listner;
        var NocEntityBase = (function () {
            function NocEntityBase() {
                this.eventListener = new Array();
                this.Childs = new Array();
            }
            NocEntityBase.prototype.update = function (context, ts) {
                throw "update not implemented?";
            };
            NocEntityBase.prototype.addEventListener = function (name, fn) {
                this.eventListener.push(new Listner(name, fn));
            };
            NocEntityBase.prototype.toDegrees = function (rad) {
                return rad * 180 / Math.PI;
            };
            NocEntityBase.prototype.toRadians = function (deg) {
                return deg * Math.PI / 180;
            };
            NocEntityBase.prototype.addChilld = function (entity) {
                this.Childs.push(entity);
            };
            NocEntityBase.prototype.removeBindig = function (entity) {
                throw "not yet implemented";
            };
            NocEntityBase.prototype.toggle = function () {
                this.isHidden = !this.isHidden;
            };
            NocEntityBase.prototype.getEntityFromChilds = function (key) {
                var result = this.Childs.filter(function (pre) {
                    return pre.key === key;
                });
                if (result.length === 0)
                    throw "Entity not found";
                return result[0];
            };
            NocEntityBase.prototype.drawTriangle = function (context, verticles) {
                var x0 = verticles[0].x, y0 = verticles[0].y;
                var x1 = verticles[1].x, y1 = verticles[1].y;
                var x2 = verticles[2].x, y2 = verticles[2].y;
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
            };
            NocEntityBase.prototype.textureMap = function (ctx, texture, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
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
                var deltaC = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
                var deltaD = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
                var deltaE = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
                var deltaF = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;
                ctx.transform(deltaA / delta, deltaD / delta, deltaB / delta, deltaE / delta, deltaC / delta, deltaF / delta);
                ctx.drawImage(texture, 0, 0);
                ctx.restore();
            };
            return NocEntityBase;
        }());
        GameEngine.NocEntityBase = NocEntityBase;
        /*
            Noc Render engine
        */
        var StageSettings = (function () {
            function StageSettings() {
            }
            return StageSettings;
        }());
        GameEngine.StageSettings = StageSettings;
        var Stage = (function () {
            function Stage(settings) {
                this.settings = settings;
                this.scenes = new Array();
            }
            Stage.prototype.findScene = function (name) {
                throw "Not yet implemented";
            };
            Stage.prototype.createScene = function (name, w, h, contextType) {
                var canvas = document.createElement("canvas");
                canvas.width = w || this.settings.width;
                canvas.height = h || this.settings.height;
                var rafl = requestAnimationFrame;
                var scene = new Scene(name, rafl, canvas, this.settings.placeholder, contextType || "2d");
                this.scenes.push(scene);
                this.settings.placeholder.appendChild(canvas);
                return scene;
            };
            return Stage;
        }());
        GameEngine.Stage = Stage;
        var Scene = (function () {
            function Scene(name, requestAnimationFrame, surface, container, contextType) {
                var _this = this;
                this.name = name;
                this.surface = surface;
                this.container = container;
                this.entities = new Array();
                this.isEnabled = false;
                this.context = surface.getContext(contextType);
                this.viewPort = new ViewPort("myViewPort", surface.width, surface.height);
                window.addEventListener("resize", function (evt) {
                    _this.resize();
                });
                this.resize();
                container.addEventListener("touchstart", function (evt) {
                    _this.fireListeners("touchstart", evt);
                });
                container.addEventListener("touchend", function (evt) {
                    _this.fireListeners("touchend", evt);
                });
            }
            Scene.prototype.hide = function () {
                this.surface.classList.add("hide");
            };
            Scene.prototype.show = function () {
                this.surface.classList.remove("hide");
            };
            Scene.prototype.getActiveEntities = function () {
                return this.entities.filter(function (ent) {
                    return !ent.isHidden;
                });
            };
            Scene.prototype.fireListeners = function (name, evt) {
                var filtered = this.entities.map(function (ent) {
                    var listeners = ent.eventListener.filter(function (t) {
                        return t.name == name;
                    });
                    return listeners;
                });
                var targets = filtered.filter(function (a) {
                    return a.length > 0;
                });
                targets.forEach(function (listeners) {
                    listeners.forEach(function (l) {
                        l.fn(evt);
                    });
                });
            };
            Scene.prototype.resize = function () {
                this.context.canvas.width = this.container.clientWidth;
                this.context.canvas.height = this.container.clientHeight;
            };
            Scene.prototype.clear = function () {
                this.context.canvas.width = this.context.canvas.width;
            };
            Scene.prototype.addEntities = function (entities) {
                var _this = this;
                entities.forEach(function (ent) {
                    _this.addEntity(ent);
                });
            };
            Scene.prototype.getEntity = function (key) {
                var result = this.entities.filter(function (pre) {
                    return pre.key === key;
                });
                if (result.length === 0)
                    throw "Entity not found - " + key;
                return result[0];
            };
            Scene.prototype.addEntity = function (entity) {
                var fn = function (name, args) {
                    this.fireListeners(name, args);
                }.bind(this);
                entity.dispatch = fn;
                this.entities.push(entity);
            };
            Scene.prototype.removeEntity = function (entity) {
                var match = this.entities.indexOf(entity);
                if (match >= 0)
                    this.entities.splice(match, 1);
            };
            Scene.prototype.getVisibleEntities = function (ms) {
                return this.entities.filter(function (entity) {
                    return entity.lifeTime && !entity.isHidden;
                });
            };
            Scene.prototype.renderEntities = function (elapsed) {
                var _this = this;
                this.clear();
                var now = Date.now();
                this.fps = 1000 / (elapsed - this.prevTime);
                if (this.isEnabled) {
                    this.render(elapsed);
                    // this.entities.forEach((entity:  NocEntityBase) => {
                    //     if(!entity.isHidden)
                    //         entity.update(this.context, elapsed);
                    // });
                    this.prevTime = elapsed;
                }
                requestAnimationFrame(function (elapsed) {
                    _this.renderEntities(elapsed);
                    if (_this.onFrame)
                        _this.onFrame(elapsed);
                });
            };
            Scene.prototype.renderAll = function () {
            };
            Scene.prototype.render = function (elapsed) {
                var _this = this;
                this.entities.forEach(function (entity) {
                    if (!entity.isHidden) {
                        entity.update(_this.context, elapsed);
                    }
                });
            };
            Scene.prototype.start = function () {
                this.prevTime = 0;
                this.isEnabled = true;
                this.renderEntities(0);
            };
            Scene.prototype.stop = function () {
                this.isEnabled = false;
            };
            return Scene;
        }());
        GameEngine.Scene = Scene;
    })(GameEngine = Noc.GameEngine || (Noc.GameEngine = {}));
})(Noc || (Noc = {}));
//# sourceMappingURL=Noc.engine.vnext.js.map