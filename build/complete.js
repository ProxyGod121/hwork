(function() {
    // Create and append the button and H1 element
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    document.body.appendChild(container);

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Homework Completed';
    completeButton.style.padding = '10px 20px';
    completeButton.style.fontSize = '18px';
    completeButton.style.cursor = 'pointer';
    completeButton.style.backgroundColor = '#4CAF50';
    completeButton.style.color = 'white';
    completeButton.style.border = 'none';
    completeButton.style.borderRadius = '5px';
    container.appendChild(completeButton);

    const homeworkCompleteH1 = document.createElement('h1');
    homeworkCompleteH1.textContent = 'Homework Complete!';
    homeworkCompleteH1.style.position = 'fixed';
    homeworkCompleteH1.style.top = '50%';
    homeworkCompleteH1.style.left = '50%';
    homeworkCompleteH1.style.transform = 'translate(-50%, -50%)';
    homeworkCompleteH1.style.fontSize = '3em';
    homeworkCompleteH1.style.color = '#FFD700';
    homeworkCompleteH1.style.textShadow = '2px 2px 5px rgba(0,0,0,0.5)';
    homeworkCompleteH1.style.opacity = '0';
    homeworkCompleteH1.style.transition = 'opacity 0.5s ease-in-out';
    homeworkCompleteH1.style.zIndex = '999';
    document.body.appendChild(homeworkCompleteH1);

    // Confetti animation logic
    const confettiColors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
    const numConfetti = 100;
    const confettiFallDuration = 3000; // milliseconds

    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = `${Math.random() * 8 + 5}px`;
        confetti.style.height = `${Math.random() * 8 + 5}px`;
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.borderRadius = '50%'; // Make some round, some square
        if (Math.random() > 0.5) confetti.style.borderRadius = '0';
        confetti.style.bottom = '0';
        confetti.style.left = `${Math.random() * window.innerWidth}px`;
        confetti.style.zIndex = '1001';
        document.body.appendChild(confetti);

        const initialX = Math.random() * window.innerWidth;
        const initialY = window.innerHeight;
        const targetX = window.innerWidth / 2 + (Math.random() - 0.5) * 200; // Fall towards middle
        const targetY = window.innerHeight + 50; // Fall slightly below viewport

        const velocityX = (initialX < window.innerWidth / 2 ? -1 : 1) * (Math.random() * 5 + 5);
        const velocityY = -(Math.random() * 15 + 10); // Initial upward velocity
        const gravity = 0.3; // Simulate gravity

        let currentX = initialX;
        let currentY = initialY;
        let currentVelocityX = velocityX;
        let currentVelocityY = velocityY;

        function animateConfetti() {
            currentVelocityY += gravity;
            currentX += currentVelocityX;
            currentY += currentVelocityY;

            confetti.style.transform = `translate(${currentX - initialX}px, ${currentY - initialY}px) rotate(${Math.random() * 360}deg)`;

            if (currentY < targetY) {
                requestAnimationFrame(animateConfetti);
            } else {
                confetti.remove();
            }
        }
        animateConfetti();
    }

    function launchConfetti() {
        for (let i = 0; i < numConfetti; i++) {
            setTimeout(createConfetti, i * 10); // Stagger confetti launch
        }
    }

    // Event listener for the button
    completeButton.addEventListener('click', () => {
        homeworkCompleteH1.style.opacity = '1';
        launchConfetti();
        resetCheckboxes();
        setTimeout(() => {
            homeworkCompleteH1.style.opacity = '0';
        }, confettiFallDuration);
    });
})();

function resetCheckboxes() {
  const checkboxes = document.querySelectorAll('#contain input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
}

