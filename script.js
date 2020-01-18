var circleGroups = document.getElementsByClassName('js-circle-group'),
    circleCount = 5,
    animating = true,
    frameDuration = 1000/60,
    speed = 1,
    scales = [],
    originalDelays = [],
    delays = [],
    frames = 0;

for (var i = 0; i < circleGroups.length; i++) {
    var radius = circleGroups[i].clientWidth,
        colour = circleGroups[i].getAttribute('data-color');

    for (var j = 0; j < circleCount; j++) {
        var circle = document.createElement('div');
        circle.style.width = radius + "px";
        circle.style.height = radius + "px";

        if (colour)
            circle.style.backgroundColor = colour;

        circle.classList.add('c-circle-group__circle', 'js-circle');
        circleGroups[i].appendChild(circle);

        delays.push(j);
        originalDelays.push(j);
        scales.push(0);
    }
}

var circles = document.getElementsByClassName('js-circle');
if (circles.length > -1) {

    function draw() {
        requestAnimationFrame(render);
    }

    function render() {
        if (animating) {
            frames++;

            for (var i = 0; i < circles.length; i++) {

                if (frames <= 50) {
                    speed = 1 - (.875 * (frames/50));
                    delays[i] = originalDelays[i] * speed;
                }

                var delay = originalDelays[i],
                    scale = scales[i];

                if (frames > (delay*9)) {
                    if (scale < 1) {
                        scale += ((2 * speed) / 60);
                    } else {
                        scale = 0;
                    }
                    scales[i] = scale;

                    circles[i].style.transform = "scale(" + scale + ")";
                    circles[i].style.opacity = (1 - scale);
                }

            }

            draw();
        }
    }

    draw();

}
