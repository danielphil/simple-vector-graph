$(function() {
    function drawVector(context, from, to, style) {
        context.beginPath();
        context.moveTo(from.X(), from.Y());
        context.lineTo(to.X(), to.Y());
        context.strokeStyle = style;
        context.stroke();
    }

    function drawLabel(context, location, name, style) {
        context.fillStyle = style;
        context.font = "12pt Helvetica";
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillText(name, location.X(), location.Y());
    }

    function renderCanvas(plotlist, el, viewRotation) {
        el.width = el.width;

        var x_axis = Vector(1, 0, 0);
        var y_axis = Vector(0, 1, 0);
        var z_axis = Vector(0, 0, 1);
        var origin = Vector(0, 0, 0);

        var scale = (Math.min(el.width, el.height) - 20) / 2.0;
        var scale_matrix = Matrix.Scale(scale, scale, scale);
        var translate_matrix = Matrix.Translate(el.width / 2, el.height / 2, 0);
        var model_to_view = translate_matrix.Multiply(scale_matrix).Multiply(viewRotation);

        var origin_t = model_to_view.Multiply(origin);
        var x_axis_t = model_to_view.Multiply(x_axis);
        var y_axis_t = model_to_view.Multiply(y_axis);
        var z_axis_t = model_to_view.Multiply(z_axis);

        var context = el.getContext("2d");
        drawVector(context, origin_t, x_axis_t, "rgba(255, 0, 0, 0.5)");
        drawVector(context, origin_t, y_axis_t, "rgba(0, 255, 0, 0.5)");
        drawVector(context, origin_t, z_axis_t, "rgba(0, 0, 255, 0.5)");
        drawLabel(context, x_axis_t, "X", "rgb(255, 0, 0)");
        drawLabel(context, y_axis_t, "Y", "rgb(0, 255, 0)");
        drawLabel(context, z_axis_t, "Z", "rgb(0, 0, 255)");

        _(_.pairs(plotlist)).each(function (pair) {
            var endpoint = model_to_view.Multiply(pair[1]);
            drawVector(context, origin_t, endpoint, "ff00ff");
            drawLabel(context, endpoint, pair[0], "ff00ff");
        });
    }

    _($('canvas')).each(function (el) {
        var plotlist = eval('(' + $(el).data('plotlist') + ')');
        var matrix = eval($(el).data('transform'));
        var viewRotation = matrix;
        renderCanvas(plotlist, el, viewRotation);

        var dragging = false;
        var x_rotation = 0;
        var previous_loc = [0, 0];
        $(el).mousedown(function (e) {
            dragging = true;
            previous_loc = [e.pageX, e.pageY];
        });
        $(el).mousemove(function (e) {
            if (dragging) {
                var x_rotation = (e.pageX - previous_loc[0]) * (Math.PI / 180);
                var y_rotation = (e.pageY - previous_loc[1]) * (Math.PI / 180);
                viewRotation = viewRotation.Multiply(Matrix.RotateX(x_rotation)).Multiply(Matrix.RotateY(y_rotation));
                renderCanvas(plotlist, el, viewRotation);
            }
            previous_loc = [e.pageX, e.pageY];
        });
        $(el).mouseup(function (e) {
            dragging = false;
            previous_loc = [e.pageX, e.pageY];
        });
        $(el).mouseleave(function (e) {
            dragging = false;
        });
    });
});