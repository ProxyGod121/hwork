// Function to initialize Firebase -- removed, not needed without auth

// Save the current state of checkboxes to LocalStorage
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

// Load checkboxes from LocalStorage
function loadCheckboxes() {
  const savedCheckboxes = localStorage.getItem('homeworkCheckboxes');
  if (savedCheckboxes) {
    renderCheckboxes(JSON.parse(savedCheckboxes));
  } else {
    // If no saved data, ensure initial checkboxes also have listeners
    document.querySelectorAll('#contain .check input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', saveCheckboxes);
    });
  }
}

// Re-renders the checkboxes on the page
function renderCheckboxes(checkboxesData) {
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
    document.getElementById(data.id).addEventListener('change', saveCheckboxes);
  });
}

// Function to add a checkbox
function addCheckbox() {
  const newCheckboxText = document.getElementById('newCheckboxText').value.trim();
  if (newCheckboxText) {
    const id = newCheckboxText.toLowerCase().replace(/\s/g, '');
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
    document.getElementById('newCheckboxText').value = '';
    document.getElementById(id).addEventListener('change', saveCheckboxes);
    saveCheckboxes();
  }
}

// Function to remove a checkbox
function removeCheckbox(checkboxId) {
  const checkboxToRemove = document.getElementById(checkboxId);
  if (checkboxToRemove) {
    checkboxToRemove.remove();
    saveCheckboxes();
  }
}

// Function to reset checkboxes
function resetCheckboxes() {
  localStorage.removeItem('homeworkCheckboxes');
  location.reload();
}

// Initialize and set up event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadCheckboxes();
  // Ensure save is called on changes for initial checkboxes
  document.querySelectorAll('#contain .check input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', saveCheckboxes);
  });
});
