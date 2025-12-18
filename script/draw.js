export function draw(input) {
    const canvas = document.getElementById("canvas");
    const ctx    = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const lines  = input.trim().split("\n").map(l => l.trim()).filter(l => l.length && !l.startsWith("//"));
    let states   = {};
    lines.forEach(line=>{
        const [state_current, read, _, state_next, write, direction] = line.split(" ");
        if (!states[state_current]) states[state_current] = {};
        states[state_current][read] = {state_next, write, direction};
    });

    // Assign positions to states
    const stateNames   = [...new Set([...Object.keys(states), ...Object.values(states).flatMap(trans => Object.values(trans).map(t => t.state_next))])];
    const positions    = {};
    const radius       = 50;
    const centerX      = canvas.width  / 2;
    const centerY      = canvas.height / 2;
    const circleRadius = 300;
    ctx.font = "30px Arial";

    stateNames.forEach((state, i) => {
        const angle = ( i / stateNames.length) *2 *Math.PI;
        const x = centerX + circleRadius * Math.cos(angle);
        const y = centerY + circleRadius * Math.sin(angle);
        positions[state] = {x, y};
    });

    // Draw states
    function drawCircle(x, y, text) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle    = "coral" ; ctx.stroke();
        ctx.fillStyle    = "coral" ; ctx.fill();
        ctx.fillStyle    = "black" ;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y);
    }

    // Draw arrows
    function drawArrow(from, to, label) {
        const dx     = to.x - from.x;
        const dy     = to.y - from.y;
        const angle  = Math.atan2(dy, dx);
        const startX = from.x + radius * Math.cos(angle);
        const startY = from.y + radius * Math.sin(angle);
        const endX   = to.x   - radius * Math.cos(angle);
        const endY   = to.y   - radius * Math.sin(angle);

        // Line
        ctx.strokeStyle = "coral";
        ctx.fillStyle   = "coral";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX  , endY  );
        ctx.stroke();

        // Arrowhead
        const headlen = 20;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(endX, endY);
        ctx.fill();

        // Label
        const labelX  = (startX + endX) / 2;
        const labelY  = (startY + endY) / 2;
        ctx.fillText(label, labelX, labelY - 10);
    }
    function drawEndo(x, y, label) {
        const loopRadius = 50;
        const offsetX    = 0;
        const offsetY    = -radius - loopRadius;

        // Bezier curve for loop
        ctx.beginPath();
        ctx.moveTo(x, y - radius); // top of circle
        ctx.bezierCurveTo(
            x + loopRadius, y + offsetY, // control point 1
            x - loopRadius, y + offsetY, // control point 2
            x, y - radius // end back at top
        );
        ctx.stroke();

        // Arrowhead
        const arrowAngle = Math.PI / -2; // pointing up
        const headlen    = 10;
        const arrowX     = x;
        const arrowY     = y - radius;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
            arrowX - headlen * Math.cos(arrowAngle - Math.PI / 6),
            arrowY - headlen * Math.sin(arrowAngle - Math.PI / 6)
        );
        ctx.lineTo(
            arrowX - headlen * Math.cos(arrowAngle + Math.PI / 6),
            arrowY - headlen * Math.sin(arrowAngle + Math.PI / 6)
        );
        ctx.lineTo(arrowX, arrowY);
        ctx.fill();

        // Label
        ctx.fillStyle = "coral";
        ctx.fillText(label, x, y - radius - loopRadius - 10);
        ctx.fillStyle = "coral";
    }

    // Draw everything
    stateNames.forEach(state =>drawCircle(positions[state].x, positions[state].y, state));

    // Group transitions by from→to state
    const transitionGroups = {};

    for (let [state_prev, transitions] of Object.entries(states)) {
        for (let [readSymbol, {state_next}] of Object.entries(transitions)) {
            const key = `${state_prev}->${state_next}`;
            if (!transitionGroups[key]) {
                transitionGroups[key] = {
                    from  : state_prev,
                    to    : state_next,
                    labels: [],
                };
            }
            transitionGroups[key].labels.push(readSymbol);
        }
    }

    // Draw grouped arrows
    for (let {from, to, labels} of Object.values(transitionGroups)) {
        const label = labels.join(",");
        const fromPos = positions[from];
        const toPos   = positions[to];
        const endo    = (from === to);
        if (endo) drawEndo (fromPos.x, fromPos.y, label);
        else      drawArrow(fromPos  , toPos    , label);
    }
}

