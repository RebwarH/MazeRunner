
class MapGen {

    mapGen = {
        legend: {
            wall: 1,
            empty: 0,
            exposedAndUndetermined: -1,
            unexposedAndUndetermined: -2
        },
        range: (begin?, end?) => {
            var result = [];

            for (var i = begin; i < end; ++i) {
                result.push(i);
            }
            return result;
        },
        repeat: (value, times) => {
            return Array.apply(null, new Array(times)).map(function () {
                return value;
            });
        }
    };
    constructor() {

    }


    harden(field, y, x) {
        field[y][x] = this.mapGen.legend.wall;
    };

    static create(width, height, branchrate) {

        let m = new MapGen();
        var map = {
            field: [],
            frontier: []
        };

        map = m.init(map, width, height);

        while (map.frontier.length > 0) {
            var pos = Math.random();

            pos = Math.pow(pos, Math.pow(Math.E, -branchrate));

            var choice = map.frontier[Math.floor(pos * map.frontier.length)];

            if (m.check(map.field, choice[0], choice[1], width, height, true)) {
                map = m.carve(map.field, map.frontier, choice[0], choice[1], width, height);
            } else {
                m.harden(map.field, choice[0], choice[1]);
            }
            map.frontier = map.frontier.filter(function (element) {
                return (element !== choice);
            });
        }

        for (var y in m.mapGen.range(0, height)) {
            for (var x in m.mapGen.range(width)) {
                if (map.field[y][x] === m.mapGen.legend.unexposedAndUndetermined) {
                    map.field[y][x] = m.mapGen.legend.wall;
                }
            }
        }

        return map.field;
    };


    init(map, width, height) {
        for (var h in this.mapGen.range(0, height)) {
            var row = [];

            for (var i in this.mapGen.range(0, width)) {
                row.push(this.mapGen.legend.unexposedAndUndetermined);
            }
            map.field.push(row);
        }

        var initX = Math.ceil(Math.random() * width) - 1;
        var initY = Math.ceil(Math.random() * height) - 1;
        return this.carve(map.field, map.frontier, initY, initX, width, height);
    };

    carve(field, frontier, y, x, width, height) {
        var extra = [];

        field[y][x] = this.mapGen.legend.empty;

        if (x > 0) {
            if (field[y][x - 1] === this.mapGen.legend.unexposedAndUndetermined) {
                field[y][x - 1] = this.mapGen.legend.exposedAndUndetermined;
                extra.push([y, x - 1]);
            }
        }
        if (x < width - 1) {
            if (field[y][x + 1] === this.mapGen.legend.unexposedAndUndetermined) {
                field[y][x + 1] = this.mapGen.legend.exposedAndUndetermined;
                extra.push([y, x + 1]);
            }
        }
        if (y > 0) {
            if (field[y - 1][x] === this.mapGen.legend.unexposedAndUndetermined) {
                field[y - 1][x] = this.mapGen.legend.exposedAndUndetermined;
                extra.push([y - 1, x]);
            }
        }
        if (y < height - 1) {
            if (field[y + 1][x] === this.mapGen.legend.unexposedAndUndetermined) {
                field[y + 1][x] = this.mapGen.legend.exposedAndUndetermined;
                extra.push([y + 1, x]);
            }
        }
        var shuffledExtra = this.knuthShuffle(extra);

        frontier = frontier.concat(shuffledExtra);

        return {
            field: field,
            frontier: frontier
        };
    };

    knuthShuffle<T>(array: Array<any>): Array<T> {
        let currentIndex = array.length;
        let randomIndex = 0;

        while (0 != currentIndex) {
            randomIndex = Math.floor(
                Math.random() * currentIndex
            );
            currentIndex -= 1;
            let temporatyValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporatyValue;
        }
        return array;
    }

    hardern(field, y, x) {
        field[y][x] = this.mapGen.legend.wall;
    };

    check(field, y, x, width, height, nodiagonals) {
        var edgestate = 0;

        if (x > 0) {
            if (field[y][x - 1] === this.mapGen.legend.empty) {
                edgestate += 1;
            }
        }
        if (x < width - 1) {
            if (field[y][x + 1] === this.mapGen.legend.empty) {
                edgestate += 2;
            }
        }
        if (y > 0) {
            if (field[y - 1][x] === this.mapGen.legend.empty) {
                edgestate += 4;
            }
        }
        if (y < height - 1) {
            if (field[y + 1][x] === this.mapGen.legend.empty) {
                edgestate += 8;
            }
        }

        if (nodiagonals) {
            if (edgestate === 1) {
                if (x < width - 1) {
                    if (y > 0) {
                        if (field[y - 1][x + 1] === this.mapGen.legend.empty) return false;
                    }
                    if (y < height - 1) {
                        if (field[y + 1][x + 1] === this.mapGen.legend.empty) return false;
                    }
                }
                return true;
            } else if (edgestate === 2) {
                if (x > 0) {
                    if (y > 0) {
                        if (field[y - 1][x - 1] === this.mapGen.legend.empty) return false;
                    }
                    if (y < height - 1) {
                        if (field[y + 1][x - 1] === this.mapGen.legend.empty) return false;
                    }
                }
                return true;
            } else if (edgestate === 4) {
                if (y < height - 1) {
                    if (x > 0) {
                        if (field[y + 1][x - 1] === this.mapGen.legend.empty) return false;
                    }
                    if (x < width - 1) {
                        if (field[y + 1][x + 1] === this.mapGen.legend.empty) return false;
                    }
                }
                return true;
            } else if (edgestate === 8) {
                if (y > 0) {
                    if (x > 0) {
                        if (field[y - 1][x - 1] === this.mapGen.legend.empty) return false;
                    }
                    if (x < width - 1) {
                        if (field[y - 1][x + 1] === this.mapGen.legend.empty) return false;
                    }
                }
                return true;
            }
            return false;
        } else {
            // do op - diagonal walls
        }
    };

}