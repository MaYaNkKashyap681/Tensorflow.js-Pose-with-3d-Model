class Center {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    setter(x, y) {
        this.x = x;
        this.y = y;
        this.printer();
    }

    printer() {
        // console.log("Point Printed", this.x, this.y);
    }

    getter() {
        return [this.x, this.y]
    }
}

var ctr = new Center();
console.log(ctr)

export {ctr};