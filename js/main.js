const canvas = document.getElementById("canvas");
const speedSlider = document.getElementById("speedSlider");
const sizeSlider = document.getElementById("sizeSlider");
const controls = document.querySelector(".controls");

const thetaSpacing = 0.07, phiSpacing = 0.02;
const R1 = 0.5, R2 = 1, K2 = 5;

let screenWidth, screenHeight, K1;
let A = 0, B = 0;
let speed = parseFloat(speedSlider.value);
let size = parseFloat(sizeSlider.value);

/* Event listeners */
speedSlider.addEventListener("input", () => {
    speed = parseFloat(speedSlider.value);
});

sizeSlider.addEventListener("input", () => {
    size = parseFloat(sizeSlider.value);
    console.log(size);
    resizeCanvas();
});

/* Resize canvas */
function resizeCanvas() {
    const fontSize = 10;
    screenWidth = Math.floor(window.innerWidth / fontSize);
    screenHeight = Math.floor(window.innerHeight / fontSize);
    K1 = screenWidth * size / K2;
}

/* Resize canvas on window resize */
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* Render frame */
function renderFrame(A, B) {
    const output = Array(screenHeight).fill("").map(() => Array(screenWidth).fill(" "));
    const zbuffer = Array(screenHeight).fill(0).map(() => Array(screenWidth).fill(0));

    const cosA = Math.cos(A), sinA = Math.sin(A);
    const cosB = Math.cos(B), sinB = Math.sin(B);

    for (let theta = 0; theta < 2 * Math.PI; theta += thetaSpacing) {
        const cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);

        for (let phi = 0; phi < 2 * Math.PI; phi += phiSpacing) {
        const cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);

        const circleX = R2 + R1 * cosTheta;
        const circleY = R1 * sinTheta;

        const x = circleX * (cosB * cosPhi + sinA * sinB * sinPhi) - circleY * cosA * sinB;
        const y = circleX * (sinB * cosPhi - sinA * cosB * sinPhi) + circleY * cosA * cosB;
        const z = K2 + cosA * circleX * sinPhi + circleY * sinA;
        const ooz = 1 / z;

        const xp = Math.floor(screenWidth / 2 + K1 * ooz * x);
        const yp = Math.floor(screenHeight / 2 - K1 * ooz * y);

        const L = cosPhi * cosTheta * sinB - cosA * cosTheta * sinPhi - sinA * sinTheta + cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);

        if (L > 0) {
            if (ooz > zbuffer[yp]?.[xp]) {
            zbuffer[yp][xp] = ooz;
            const luminanceIndex = Math.floor(L * 8);
            const luminanceChars = ".,-~:;=!*#$@";
            output[yp][xp] = luminanceChars[luminanceIndex];
            }
        }
        }
    }

    canvas.textContent = output.map(row => row.join("")).join("\n");
}

/* Animation loop */
function animate() {
    renderFrame(A, B);
    A += speed;
    B += speed * 2;
    requestAnimationFrame(animate);
}
animate();

/* Toggle menu */
function toggleMenu() {
    if (controls.style.bottom === "0px") {
        controls.style.bottom = "-100px";
    } else {
        controls.style.bottom = "0";
    }
}