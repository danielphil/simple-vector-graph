var Vector = function(x, y, z) {
    if (!(this instanceof Vector)) {
        return new Vector(x, y, z);
    }
    this.X = function () { return x; };
    this.Y = function () { return y; };
    this.Z = function () { return z; };
};

Vector.prototype.toString = function () {
    return "X: " + this.X() + " Y: " + this.Y() + " Z: " + this.Z();
};

