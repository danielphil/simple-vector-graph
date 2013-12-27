var Matrix = function () {
    if (!(this instanceof Matrix)) {
        return new Matrix();
    }
    // Matrices are column major, like OpenGL
    /* m11 m12 m13 m14
       m21 m22 m23 m24
       m31 m32 m33 m34
       m41 m42 m43 m44

       And stored as [ m11, m21, m31, m41, m12, m22, etc.]

       Matrices should be post-multiplied
    */

    var _elements = [];

    function index(row, column) {
        return 4 * column + row;
    }

    function matrixMultiply(matrix) {
        var result = new Matrix();
        var b = matrix.Elements();

        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < 4; i++) {
                var sum = 0;
                for (var k = 0; k < 4; k++) {
                    sum += _elements[index(i, k)] * b[index(k, j)];
                }
                result.SetElement(i, j, sum);
            }
        }
        return result;
    };

    function vectorMultiply(vector) {
        var v = [ vector.X(), vector.Y(), vector.Z(), 1];
        var r = [0, 0, 0, 0];
        for (var i = 0; i < 4; i++) {
            var sum = 0;
            for (var k = 0; k < 4; k++) {
                sum += _elements[index(i, k)] * v[k];
            }
            r[i] = sum;
        }
        return new Vector(r[0], r[1], r[2]);
    };

    this.Element = function (row, column) {
        return _elements[index(row, column)];
    }
    this.SetElement = function(row, column, value) {
        _elements[index(row, column)] = value;
    }
    this.Elements = function () {
        return _elements;
    }
    
    this.Multiply = function (vectorOrMatrix) {
        if (vectorOrMatrix instanceof Matrix) {
            return matrixMultiply(vectorOrMatrix);
        } else if (vectorOrMatrix instanceof Vector) {
            return vectorMultiply(vectorOrMatrix);
        }
    };

    _(16).times(function () {
        _elements.push(0);
    });
    _elements[index(0, 0)] = 1;
    _elements[index(1, 1)] = 1;
    _elements[index(2, 2)] = 1;
    _elements[index(3, 3)] = 1;
}

Matrix.prototype.toString = function () {
    var result = "";
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            result += this.Element(row, col);
            if (col != 3) {
                result += ", ";
            }
        }
        result += "\n";
    }
    return result;
};

Matrix.Build = function () {
    if (arguments.length != 16) {
        throw "Need 16 matrix elements!";
    }

    var matrix = new Matrix();
    for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 4; col++) {
            matrix.SetElement(row, col, arguments[row * 4 + col]);
        }
    }
    return matrix;
};

Matrix.Scale = function (x_scale, y_scale, z_scale) {
    var m = new Matrix();
    m.SetElement(0, 0, x_scale);
    m.SetElement(1, 1, y_scale);
    m.SetElement(2, 2, z_scale);
    return m;
};

Matrix.Translate = function (x, y, z) {
    var m = new Matrix();
    m.SetElement(0, 3, x);
    m.SetElement(1, 3, y);
    m.SetElement(2, 3, z);
    return m;
};

Matrix.RotateX = function (angleRadians) {
    var m = new Matrix();
    var cosTheta = Math.cos(angleRadians);
    var sinTheta = Math.sin(angleRadians);
    m.SetElement(1, 1, cosTheta);
    m.SetElement(1, 2, -sinTheta);
    m.SetElement(2, 1, sinTheta);
    m.SetElement(2, 2, cosTheta);
    return m;
}

Matrix.RotateY = function (angleRadians) {
    var m = new Matrix();
    var cosTheta = Math.cos(angleRadians);
    var sinTheta = Math.sin(angleRadians);
    m.SetElement(0, 0, cosTheta);
    m.SetElement(0, 2, sinTheta);
    m.SetElement(2, 0, -sinTheta);
    m.SetElement(2, 2, cosTheta);
    return m;
}

