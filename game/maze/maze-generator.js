var MazeGenerator = (function () {
    function MazeGenerator(x, y) {
        this.x = x;
        this.totalCells = x * y;
        this.cells = new Array();
        this.univ = new Array();
        for (var i = 0; i < y; i++) {
            this.cells[i] = new Array();
            this.univ[i] = new Array();
            for (var j = 0; j < x; j++) {
                this.cells[i][j] = [0, 0, 0, 0];
                this.univ[i][j] = true;
            }
        }
        // todo: define a typ ? custom ?
        var currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
        this.path = [currentCell];
        this.univ[currentCell[0]][currentCell[1]] = false;
        var visited = 1;
        while (visited < this.totalCells) {
            var pot = [[currentCell[0] - 1,
                    currentCell[1], 0, 2],
                [currentCell[0],
                    currentCell[1] + 1, 1, 3],
                [currentCell[0] + 1,
                    currentCell[1], 2, 0],
                [currentCell[0],
                    currentCell[1] - 1, 3, 1]];
            //  console.log("pot", pot);
            var neighbors = new Array();
            for (var l = 0; l < 4; l++) {
                if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x &&
                    this.univ[pot[l][0]][pot[l][1]]) {
                    neighbors.push(pot[l]);
                }
            }
            if (neighbors.length) {
                var next = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.cells[currentCell[0]][currentCell[1]][next[2]] = 1;
                this.cells[next[0]][next[1]][next[3]] = 1;
                this.univ[next[0]][next[1]] = false;
                visited++;
                currentCell = [next[0], next[1]];
                this.path.push(currentCell);
            }
            else {
                currentCell = this.path.pop();
            }
        }
    }
    return MazeGenerator;
}());
var Cell = (function () {
    function Cell() {
    }
    return Cell;
}());
//# sourceMappingURL=maze-generator.js.map