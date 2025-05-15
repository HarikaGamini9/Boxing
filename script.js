document.addEventListener('DOMContentLoaded', () => {
    const punchingBag = document.getElementById('punchingBag');
    const boxingRig = document.querySelector('.boxing-rig');
    const scoreValueDisplay = document.getElementById('scoreValue');
    const lastHitValueDisplay = document.getElementById('lastHitValue');
    const resetButton = document.getElementById('resetButton');

    const hitSoundSoft = document.getElementById('hitSoundSoft');
    const hitSoundMedium = document.getElementById('hitSoundMedium');
    const hitSoundHard = document.getElementById('hitSoundHard');

    let score = 0;
    let mouseDownTime;
    let isAnimating = false;

    function updateScore(points) {
        score += points;
        scoreValueDisplay.textContent = score;
        lastHitValueDisplay.textContent = points;
    }

    function playHitSound(strength) {
        if (strength === 'strong') {
            hitSoundHard.currentTime = 0;
            hitSoundHard.play().catch(e => console.log("Audio play failed:", e));
        } else if (strength === 'medium') {
            hitSoundMedium.currentTime = 0;
            hitSoundMedium.play().catch(e => console.log("Audio play failed:", e));
        } else {
            hitSoundSoft.currentTime = 0;
            hitSoundSoft.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    punchingBag.addEventListener('mousedown', (event) => {
        if (event.button !== 0) return;
        mouseDownTime = Date.now();
    });

    punchingBag.addEventListener('mouseup', (event) => {
        if (event.button !== 0 || !mouseDownTime || isAnimating) return;

        const mouseUpTime = Date.now();
        const clickDuration = mouseUpTime - mouseDownTime;
        mouseDownTime = null;

        let points = 0;
        let animationClass = '';
        let soundStrength = 'soft';

        // STRONG hit (fall)
        if (clickDuration < 75) {
            points = Math.floor(Math.random() * 6) + 15;
            soundStrength = 'strong';

            isAnimating = true;
            updateScore(points);
            playHitSound(soundStrength);

            boxingRig.classList.add('rig-hit-fall');
            boxingRig.classList.add('ring-shake');

            // Remove shake after it's done
            setTimeout(() => {
                boxingRig.classList.remove('ring-shake');
            }, 400);

            // Rise up after 2 seconds
            setTimeout(() => {
                boxingRig.classList.remove('rig-hit-fall');
                boxingRig.classList.add('rig-rise-up');

                boxingRig.addEventListener('animationend', function handler() {
                    boxingRig.classList.remove('rig-rise-up');
                    isAnimating = false;
                    boxingRig.removeEventListener('animationend', handler);
                });
            }, 3000);

            return;
        }

        // MEDIUM hit
        if (clickDuration < 150) {
            points = Math.floor(Math.random() * 5) + 8;
            animationClass = 'rig-hit-medium';
            soundStrength = 'medium';
        }
        // MILD hit
        else if (clickDuration < 300) {
            points = Math.floor(Math.random() * 3) + 3;
            animationClass = 'rig-hit-mild';
        }
        // SLOW hit
        else {
            points = 1;
            animationClass = 'rig-hit-mild';
        }

        updateScore(points);
        playHitSound(soundStrength);

        // Apply animation for mild/medium
        if (animationClass) {
            isAnimating = true;
            boxingRig.classList.add(animationClass);

            boxingRig.addEventListener('animationend', function handler() {
                boxingRig.classList.remove(animationClass);
                isAnimating = false;
                boxingRig.removeEventListener('animationend', handler);
            });
        }
    });

    punchingBag.addEventListener('dragstart', (event) => {
        event.preventDefault();
    });

    resetButton.addEventListener('click', () => {
        score = 0;
        scoreValueDisplay.textContent = score;
        lastHitValueDisplay.textContent = 0;
    });
});
