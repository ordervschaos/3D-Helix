import React, { useEffect, useRef } from 'react';
import Two from 'two.js';

const Spiral = () => {
    // Create a ref to store the canvas DOM element
    const containerRef = useRef(null);

    // Create the spiral using Two.js
    useEffect(() => {

        // Create a new Two.js instance
        const two = new Two({
            // Set the type of renderer to SVG
            type: Two.Types.svg,

            fullscreen: true,// Set the width of the renderer to the width of the window
            autostart: true
        }).appendTo(containerRef.current);



        const amt = 300;

        two.renderer.domElement.style.background = 'rgb(0, 191, 168)';

        const points = [];
        for (let i = 0; i < amt; i++) {
            const pct = i / (amt - 1);
            const theta = pct * Math.PI * 32;
            const r = pct * Math.min(two.height, two.width);
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            points.push(new Two.Anchor(x, y));
        }
        const path = two.makeCurve(points, true);

        path.noFill().linewidth = 25;
        path.cap = path.join = 'round';
        path.stroke = 'white';

        const cursor = two.makeCircle(0, 0, 25);
        cursor.fill = cursor.stroke = 'rgb(255, 100, 100)';
        cursor.linewidth = 10;
        cursor.cap = cursor.join = 'round';

        let pct = 0;
        const projection = new Two.Vector();

        let rotating = false;

        const update = () => {
            if (rotating) {
                two.scene.rotation += Math.PI / 64;
            }
        };

        const resize = () => {
            two.scene.translation.set(two.width / 2, two.height / 2);
        };

        const drag = (e) => {
            pct = e.clientX / two.width;
            path.getPointAt(pct, cursor.translation);
            cursor.translation.addSelf(path.translation);
        };

        const touchDrag = (e) => {
            e.preventDefault();
            const touch = e.originalEvent.changedTouches[0];
            drag({
                clientX: touch.pageX,
                clientY: touch.pageY
            });
            return false;
        };

        const toggle = () => {
            rotating = !rotating;
        };

        two.bind('update', update).bind('resize', resize);

        resize();
        drag({ clientX: 0 });

        window.addEventListener('click', toggle, false);
        window.addEventListener('mousemove', drag, false);
        window.addEventListener('touchmove', touchDrag, false);

        return () => {
            two.unbind('update', update).unbind('resize', resize);
            two.clear();
        };
    }, []);

    return <div ref={containerRef}></div>;
};

export default Spiral;