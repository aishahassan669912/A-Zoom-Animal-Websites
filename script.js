// API endpoint
const API_URL = 'http://localhost:3000/Users';

// DOM elements for contact form
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');

// DOM elements for admin page
const messagesBody = document.getElementById('messagesBody');
const editForm = document.getElementById('editForm');
const editId = document.getElementById('editId');
const editName = document.getElementById('editName');
const editEmail = document.getElementById('editEmail');
const editSubject = document.getElementById('editSubject');
const editMessage = document.getElementById('editMessage');
const updateBtn = document.getElementById('updateBtn');
const cancelEdit = document.getElementById('cancelEdit');

// Check if contact form exists on the page
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                const result = await response.json();
                formResponse.innerHTML = '<p style="color: green;">Message sent successfully!</p>';
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            formResponse.innerHTML = '<p style="color: red;">Error sending message. Please try again.</p>';
        }
    });
}

// Admin page functionality
if (messagesBody) {
    // Load messages when admin page loads
    document.addEventListener('DOMContentLoaded', fetchMessages);
    
    // Fetch all messages
    async function fetchMessages() {
        try {
            const response = await fetch(API_URL);
            const messages = await response.json();
            displayMessages(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }
    
    // Display messages in table
    function displayMessages(messages) {
        messagesBody.innerHTML = '';
        messages.forEach(message => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${message.id || ''}</td>
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.subject || ''}</td>
                <td>${message.message}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${message.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn" data-id="${message.id}"><i class="fas fa-trash"></i> Delete</button>
                </td>
            `;
            messagesBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                editMessageById(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                deleteMessage(id);
            });
        });
    }
    
    // Edit message
    async function editMessageById(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const message = await response.json();
            
            editId.value = message.id;
            editName.value = message.name;
            editEmail.value = message.email;
            editSubject.value = message.subject || '';
            editMessage.value = message.message;
            
            editForm.style.display = 'block';
        } catch (error) {
            console.error('Error fetching message:', error);
        }
    }
    
    // Update message
    updateBtn.addEventListener('click', async () => {
        const updatedMessage = {
            name: editName.value,
            email: editEmail.value,
            subject: editSubject.value,
            message: editMessage.value
        };
        
        try {
            const response = await fetch(`${API_URL}/${editId.value}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMessage),
            });
            
            if (response.ok) {
                editForm.style.display = 'none';
                fetchMessages();
            } else {
                throw new Error('Failed to update message');
            }
        } catch (error) {
            console.error('Error updating message:', error);
        }
    });
    
    // Cancel edit
    cancelEdit.addEventListener('click', () => {
        editForm.style.display = 'none';
    });
    
    // Delete message
    async function deleteMessage(id) {
        if (confirm('Are you sure you want to delete this message?')) {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    fetchMessages();
                } else {
                    throw new Error('Failed to delete message');
                }
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    }
}