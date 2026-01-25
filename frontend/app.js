const API_URL = 'http://localhost:3000/api';

const nameInput = document.getElementById('nameInput');
const submitBtn = document.getElementById('submitBtn');
const namesList = document.getElementById('namesList');
const countSpan = document.getElementById('count');
const messageDiv = document.getElementById('message');

// Load names on page load
document.addEventListener('DOMContentLoaded', () => {
    loadNames();
});

// Submit on Enter key
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitName();
    }
});

// Submit on button click
submitBtn.addEventListener('click', submitName);

// Submit name function
async function submitName() {
    const name = nameInput.value.trim();
    
    if (!name) {
        showMessage('Please enter a name', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
        const response = await fetch(`${API_URL}/names`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name })
        });

        const data = await response.json();

        if (data.success) {
            nameInput.value = '';
            showMessage('Name saved successfully!', 'success');
            loadNames();
        } else {
            showMessage('Error: ' + data.error, 'error');
        }
    } catch (error) {
        showMessage('Failed to connect to server', 'error');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enter';
    }
}

// Load all names
async function loadNames() {
    try {
        const response = await fetch(`${API_URL}/names`);
        const data = await response.json();

        if (data.success) {
            displayNames(data.data);
        }
    } catch (error) {
        console.error('Error loading names:', error);
        namesList.innerHTML = '<p class="empty-state">Failed to load names</p>';
    }
}

// Display names in the list
function displayNames(names) {
    countSpan.textContent = names.length;

    if (names.length === 0) {
        namesList.innerHTML = '<p class="empty-state">No names stored yet</p>';
        return;
    }

    namesList.innerHTML = names.map(item => `
        <div class="name-item">
            <div>
                <div class="name-text">${escapeHtml(item.name)}</div>
                <div class="name-time">${formatDate(item.created_at)}</div>
            </div>
            <button class="delete-btn" onclick="deleteName(${item.id})">Delete</button>
        </div>
    `).join('');
}

// Delete name
async function deleteName(id) {
    if (!confirm('Are you sure you want to delete this name?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/names/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Name deleted successfully', 'success');
            loadNames();
        }
    } catch (error) {
        showMessage('Failed to delete name', 'error');
        console.error('Error:', error);
    }
}

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type} show`;
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}