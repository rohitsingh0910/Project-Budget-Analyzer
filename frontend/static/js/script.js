document.addEventListener("DOMContentLoaded", function () {
    const heading = document.querySelector(".welcome-heading");
    const subheading = document.querySelector(".subheading");
    const tagline = document.querySelector(".tagline");
    const startBtn = document.querySelector(".start-btn");

    const text = heading.textContent;
    heading.textContent = "";
    [...text].forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.animation = `fadeUp 0.6s forwards`;
        span.style.animationDelay = `${i * 0.15}s`;
        heading.appendChild(span);
    });

    const totalTime = text.length * 0.15 + 0.6;

    setTimeout(() => { subheading.style.opacity = "1"; }, totalTime * 1000);
    setTimeout(() => { tagline.style.opacity = "1"; }, (totalTime + 0.8) * 1000);
    setTimeout(() => {
        startBtn.style.opacity = "1";
        startBtn.style.transform = "scale(1)";
    }, (totalTime + 1.6) * 1000);
});
