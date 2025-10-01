// Function to initialize Firebase
function initFirebase() {
  // Replace with your project's Firebase configuration
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID"
    // ... other properties
  };
  firebase.initializeApp(firebaseConfig);
}

// Save the current state of checkboxes to Firestore
function saveCheckboxes() {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("No user signed in. Data not saved.");
    return;
  }
  
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
  
  // Save to a document in Firestore named after the user's ID
  const db = firebase.firestore();
  db.collection("users").doc(user.uid).set({ checkboxes })
    .then(() => console.log("Checkboxes successfully saved!"))
    .catch((error) => console.error("Error writing document: ", error));
}

// Load checkboxes from Firestore
function loadCheckboxes() {
  const user = firebase.auth().currentUser;
  if (!user) {
    // If no user is signed in, load from LocalStorage as a fallback
    loadFromLocalStorage();
    return;
  }
  
  const db = firebase.firestore();
  db.collection("users").doc(user.uid).get()
    .then((doc) => {
      if (doc.exists) {
        const checkboxesData = doc.data().checkboxes;
        renderCheckboxes(checkboxesData);
      } else {
        console.log("No saved data found for user.");
        // Fallback to initial state or LocalStorage
      }
    })
    .catch((error) => console.error("Error getting document:", error));
}

function loadFromLocalStorage() {
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
  const user = firebase.auth().currentUser;
  if (user) {
    const db = firebase.firestore();
    db.collection("users").doc(user.uid).delete()
      .then(() => console.log("User data successfully deleted!"))
      .catch((error) => console.error("Error removing document: ", error));
  }
  location.reload();
}

// Set up Google Sign-in/Sign-out functionality
function setupAuth() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      document.getElementById('auth-button').textContent = "Sign Out";
      document.getElementById('auth-status').textContent = `Signed in as: ${user.displayName}`;
      loadCheckboxes(); // Load user-specific data on sign-in
    } else {
      document.getElementById('auth-button').textContent = "Sign in with Google";
      document.getElementById('auth-status').textContent = "Not signed in";
      loadCheckboxes(); // Load from LocalStorage as fallback
    }
  });

  document.getElementById('auth-button').addEventListener('click', () => {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    } else {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    }
  });
}

// Initialize Firebase and set up event listeners
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  setupAuth();
  // Ensure save is called on changes even before a sign-in event
  document.querySelectorAll('#contain .check input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', saveCheckboxes);
  });
});
