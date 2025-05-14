document.addEventListener('DOMContentLoaded', () => {
    const punchingBag = document.getElementById('punchingBag');
    const scoreValueDisplay = document.getElementById('scoreValue');
    const lastHitValueDisplay = document.getElementById('lastHitValue');
    const resetButton = document.getElementById('resetButton');

    // Sound elements (make sure you have these sound files or remove these lines)
    const hitSoundSoft = document.getElementById('hitSoundSoft');
    const hitSoundMedium = document.getElementById('hitSoundMedium');
    const hitSoundHard = document.getElementById('hitSoundHard');

    let score = 0;
    let mouseDownTime;
    let isAnimating = false; // To prevent re-triggering animation while one is playing

    function updateScore(points) {
        score += points;
        scoreValueDisplay.textContent = score;
        lastHitValueDisplay.textContent = points;
    }

    function playHitSound(strength) {
        // Rewind sound to play again if clicked rapidly
        if (strength === 'strong' && hitSoundHard) {
            hitSoundHard.currentTime = 0;
            hitSoundHard.play().catch(e => console.log("Audio play failed:", e));
        } else if (strength === 'medium' && hitSoundMedium) {
            hitSoundMedium.currentTime = 0;
            hitSoundMedium.play().catch(e => console.log("Audio play failed:", e));
        } else if (hitSoundSoft) { // Default to soft
            hitSoundSoft.currentTime = 0;
            hitSoundSoft.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    punchingBag.addEventListener('mousedown', (event) => {
        // Only register left clicks for "punching"
        if (event.button !== 0) return;
        mouseDownTime = Date.now();
    });

    punchingBag.addEventListener('mouseup', (event) => {
        if (event.button !== 0 || !mouseDownTime || isAnimating) return;

        const mouseUpTime = Date.now();
        const clickDuration = mouseUpTime - mouseDownTime; // Milliseconds
        mouseDownTime = null; // Reset for next click

        let points = 0;
        let animationClass = '';
        let soundStrength = 'soft';

        // Determine points and animation based on click duration
        // Shorter duration = faster/stronger hit
        if (clickDuration < 75) { // Very fast
            points = Math.floor(Math.random() * 6) + 15; // 15-20 points
            animationClass = 'hit-strong';
            soundStrength = 'strong';
        } else if (clickDuration < 150) { // Fast
            points = Math.floor(Math.random() * 5) + 8;  // 8-12 points
            animationClass = 'hit-medium';
            soundStrength = 'medium';
        } else if (clickDuration < 300) { // Medium
            points = Math.floor(Math.random() * 3) + 3;  // 3-5 points
            animationClass = 'hit-mild';
        } else { // Slow
            points = 1;
            animationClass = 'hit-mild'; // Can be same as medium or a very subtle one
        }

        updateScore(points);
        playHitSound(soundStrength);

        // Apply animation
        if (animationClass) {
            isAnimating = true;
            punchingBag.classList.add(animationClass);

            // Remove animation class after it finishes
            // Use 'animationend' event for more robust timing
            punchingBag.addEventListener('animationend', function handler() {
                punchingBag.classList.remove(animationClass);
                isAnimating = false;
                punchingBag.removeEventListener('animationend', handler); // Clean up listener
            });
        }
    });

    // Prevent dragging the bag image
    punchingBag.addEventListener('dragstart', (event) => {
        event.preventDefault();
    });

    resetButton.addEventListener('click', () => {
        score = 0;
        scoreValueDisplay.textContent = score;
        lastHitValueDisplay.textContent = 0;
        console.log("Score reset");
    });
});