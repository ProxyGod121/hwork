document.addEventListener('DOMContentLoaded', () => {
    // Initial check for completed homework on page load
    updateCompletedMessage();
});

function addCheckbox() {
    const newCheckboxText = document.getElementById('newCheckboxText');
    const text = newCheckboxText.value.trim();

    if (text === "") {
        alert("Please enter a task for your homework.");
        return;
    }

    const containDiv = document.getElementById('contain');

    // Generate a unique ID for the new checkbox and its container
    const uniqueId = 'check-' + Date.now(); 
    const checkboxId = 'item-' + Date.now();

    const newCheckDiv = document.createElement('div');
    newCheckDiv.className = 'check';
    newCheckDiv.id = uniqueId;

    newCheckDiv.innerHTML = `
        <input type="checkbox" id="${checkboxId}" name="homework" value="${text}">
        <span class="checkmark" onclick="document.getElementById('${checkboxId}').click()"></span>
        <span class="check-label-text">${text}</span>
        <button class="remove-button" onclick="removeCheckbox('${uniqueId}')">Remove</button>
    `;

    containDiv.appendChild(newCheckDiv);
    newCheckboxText.value = ''; // Clear the input field

    // Add event listener to the newly created checkbox
    document.getElementById(checkboxId).addEventListener('change', updateCompletedMessage);
    updateCompletedMessage();
}

function removeCheckbox(checkboxContainerId) {
    const checkboxContainer = document.getElementById(checkboxContainerId);
    if (checkboxContainer) {
        checkboxContainer.remove();
    }
    updateCompletedMessage();
}

function resetCheckboxes() {
    const checkboxes = document.querySelectorAll('#contain input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateCompletedMessage();
}

function updateCompletedMessage() {
    const checkboxes = document.querySelectorAll('#contain input[type="checkbox"]');
    const completedMessage = document.getElementById('completedMessage');
    let allCompleted = true;

    if (checkboxes.length === 0) {
        completedMessage.style.display = 'block'; // Show if no homework
        triggerConfetti();
        return;
    }

    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            allCompleted = false;
        }
    });

    if (allCompleted) {
        completedMessage.style.display = 'block';
        triggerConfetti();
    } else {
        completedMessage.style.display = 'none';
    }
}

function triggerConfetti() {
    // Check if confetti library is loaded
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// Attach event listeners to initial checkboxes
document.querySelectorAll('#contain input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateCompletedMessage);
});