let currentUser = null;

// Render sign up/login UI
function renderAuth() {
  document.body.innerHTML = `
    <div>
      <input id="username" placeholder="Username">
      <input id="password" type="password" placeholder="Password">
      <button id="signupBtn">Sign Up</button>
      <button id="loginBtn">Login</button>
      <div id="error" style="color:red"></div>
    </div>
    <div id="main-app" style="display:none"></div>
  `;
  document.getElementById('signupBtn').onclick = () => {
    fetch('/signup', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) document.getElementById('error').textContent = data.error;
        else {
          currentUser = document.getElementById('username').value;
          renderApp();
        }
      });
  };
  document.getElementById('loginBtn').onclick = () => {
    fetch('/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) document.getElementById('error').textContent = data.error;
        else {
          currentUser = document.getElementById('username').value;
          renderApp();
        }
      });
  };
}

// Render main app UI
function renderApp() {
  document.getElementById('main-app').style.display = '';
  document.getElementById('main-app').innerHTML = `
    <button onclick="logout()">Logout</button>
    <input id="newCheckboxText" placeholder="Add checkbox">
    <button onclick="addCheckbox()">Add</button>
    <button onclick="resetCheckboxes()">Reset All</button>
    <div id="contain"></div>
  `;
  loadCheckboxes();
}

function logout() {
  currentUser = null;
  renderAuth();
}

function saveCheckboxes() {
  if (!currentUser) return;
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
  fetch('/save', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username: currentUser, checkboxes })
  });
}

function loadCheckboxes() {
  if (!currentUser) return;
  fetch('/load', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username: currentUser })
  })
    .then(r => r.json())
    .then(data => {
      if (data.checkboxes) renderCheckboxes(data.checkboxes);
    });
}

function renderCheckboxes(checkboxesData) {
  const containDiv = document.getElementById('contain');
  containDiv.innerHTML = '';
  checkboxesData.forEach(data => {
    const newCheckboxDiv = document.createElement('div');
    newCheckboxDiv.classList.add('check');
    newCheckboxDiv.id = `check-${data.id}`;
    newCheckboxDiv.innerHTML = `
      <input type="checkbox" id="${data.id}" value="${data.value}" ${data.checked ? 'checked' : ''}>
      <span class="check-label-text">${data.text}</span>
      <button onclick="removeCheckbox('check-${data.id}')">Remove</button>
    `;
    containDiv.appendChild(newCheckboxDiv);
    document.getElementById(data.id).addEventListener('change', saveCheckboxes);
  });
}

window.addCheckbox = function() {
  const newCheckboxText = document.getElementById('newCheckboxText').value.trim();
  if (newCheckboxText) {
    const id = newCheckboxText.toLowerCase().replace(/\s/g, '');
    const containDiv = document.getElementById('contain');
    const newCheckboxDiv = document.createElement('div');
    newCheckboxDiv.classList.add('check');
    newCheckboxDiv.id = `check-${id}`;
    newCheckboxDiv.innerHTML = `
      <input type="checkbox" id="${id}" value="${id}">
      <span class="check-label-text">${newCheckboxText}</span>
      <button onclick="removeCheckbox('check-${id}')">Remove</button>
    `;
    containDiv.appendChild(newCheckboxDiv);
    document.getElementById('newCheckboxText').value = '';
    document.getElementById(id).addEventListener('change', saveCheckboxes);
    saveCheckboxes();
  }
};

window.removeCheckbox = function(checkboxId) {
  const checkboxToRemove = document.getElementById(checkboxId);
  if (checkboxToRemove) {
    checkboxToRemove.remove();
    saveCheckboxes();
  }
};

window.resetCheckboxes = function() {
  if (!currentUser) return;
  fetch('/save', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username: currentUser, checkboxes: [] })
  }).then(() => {
    document.getElementById('contain').innerHTML = '';
  });
};

window.onload = renderAuth;