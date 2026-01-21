// Mouse-Driven Horizontal Scroll
document.addEventListener('DOMContentLoaded', function () {
    const section = document.getElementById('mouseScrollSection');
    const track = document.getElementById('mouseScrollTrack');

    if (!section || !track) return;

    // Variables for smooth scrolling
    let targetPercentage = 0;
    let currentPercentage = 0;
    const smoothFactor = 0.08; // Adjust for smoother/faster lag

    function handleMouseMove(e) {
        // Calculate mouse position relative to window width
        // 0 (left) to 1 (right)
        const mouseX = e.clientX;
        const windowWidth = window.innerWidth;

        // Calculate the percentage of the scroll track that should be visible
        // If mouse is at 0 (left), we want to show the start (0%)
        // If mouse is at 1 (right), we want to show the end (100% of overflow)

        const mousePercentage = mouseX / windowWidth;
        targetPercentage = mousePercentage;
    }

    function updateScroll() {
        // Smoothly interpolate current towards target
        const diff = targetPercentage - currentPercentage;
        currentPercentage += diff * smoothFactor;

        // Calculate max scrollable distance
        // Track width - Window width
        const trackWidth = track.scrollWidth;
        const windowWidth = window.innerWidth;
        const maxScroll = trackWidth - windowWidth;

        if (maxScroll > 0) {
            // Calculate pixel value
            // If percentage is 0, we translate 0
            // If percentage is 1, we translate -maxScroll
            const translateX = -(currentPercentage * maxScroll);

            // Apply transform
            track.style.transform = `translate(${translateX}px, -50%)`;
        }

        requestAnimationFrame(updateScroll);
    }

    // Check if device is desktop (has hover)
    if (window.matchMedia('(hover: hover)').matches) {
        window.addEventListener('mousemove', handleMouseMove);
        requestAnimationFrame(updateScroll);
    } else {
        // Fallback for touch devices is handled by CSS (overflow-x: auto)
    }
});
