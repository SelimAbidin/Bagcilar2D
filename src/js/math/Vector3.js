

class Vector3 {
    
    constructor (x, y, w) {

        this.x = x === undefined ? 0 : x;
        this.y = y === undefined ? 0 : y;
        this.w = w === undefined ? 0 : w;
        
    }
    
}

export {Vector3};