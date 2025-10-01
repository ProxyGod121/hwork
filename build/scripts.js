// Function to save the current state of checkboxes to localStorage
function saveCheckboxes() {
    const checkboxes = [];
    document.querySelectorAll('#contain .check').forEach(item => {
        const input = item.querySelector('input[type="checkbox"]');
        const labelText = item.querySelector('.check-label-text').textContent;
        checkboxes.push({
            id: input.id,
            value: input.value,
            text: labelText,
            checked: input.checked
        });
    });
    localStorage.setItem('homeworkCheckboxes', JSON.stringify(checkboxes));
}

// Function to load checkboxes from localStorage
function loadCheckboxes() {
    const savedCheckboxes = localStorage.getItem('homeworkCheckboxes');
    if (savedCheckboxes) {
        const checkboxesData = JSON.parse(savedCheckboxes);
        const containDiv = document.getElementById('contain');
        containDiv.innerHTML = ''; // Clear initial checkboxes

        checkboxesData.forEach(data => {
            const newCheckboxDiv = document.createElement('div');
            newCheckboxDiv.classList.add('check');
            newCheckboxDiv.id = `check-${data.id}`;
            newCheckboxDiv.innerHTML = `
                <input type="checkbox" id="${data.id}" name="fruit" value="${data.value}" ${data.checked ? 'checked' : ''}>
                <span class="checkmark" onclick="document.getElementById('${data.id}').click()"></span>
                <span class="check-label-text">${data.text}</span>
                <button class="remove-button" onclick="removeCheckbox('check-${data.id}')">Remove</button>
            `;
            containDiv.appendChild(newCheckboxDiv);

            // Add event listener for saving state on change
            document.getElementById(data.id).addEventListener('change', saveCheckboxes);
        });
    } else {
        // If no saved data, ensure initial checkboxes also have listeners
        document.querySelectorAll('#contain .check input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', saveCheckboxes);
        });
    }
}

// Call loadCheckboxes when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadCheckboxes);

function addCheckbox() {
    const newCheckboxText = document.getElementById('newCheckboxText').value.trim();
    if (newCheckboxText) {
        const id = newCheckboxText.toLowerCase().replace(/\s/g, ''); // Simple ID generation
        const containDiv = document.getElementById('contain');

        const newCheckboxDiv = document.createElement('div');
        newCheckboxDiv.classList.add('check');
        newCheckboxDiv.id = `check-${id}`;
        newCheckboxDiv.innerHTML = `
            <input type="checkbox" id="${id}" name="fruit" value="${id}">
            <span class="checkmark" onclick="document.getElementById('${id}').click()"></span>
            <span class="check-label-text">${newCheckboxText}</span>
            <button class="remove-button" onclick="removeCheckbox('check-${id}')">Remove</button>
        `;
        containDiv.appendChild(newCheckboxDiv);

        document.getElementById('newCheckboxText').value = ''; // Clear input field

        // Add event listener for saving state on change
        document.getElementById(id).addEventListener('change', saveCheckboxes);
        saveCheckboxes(); // Save the new state
    }
}

function removeCheckbox(checkboxId) {
    const checkboxToRemove = document.getElementById(checkboxId);
    if (checkboxToRemove) {
        checkboxToRemove.remove();
        saveCheckboxes(); // Save the new state
    }
}

function resetCheckboxes() {
    localStorage.removeItem('homeworkCheckboxes'); // Clear saved data
    location.reload(); // Reload the page to revert to initial state
}

// Initial setup for existing checkboxes (if no saved data)
document.querySelectorAll('#contain .check input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', saveCheckboxes);
});