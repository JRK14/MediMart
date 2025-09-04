document.addEventListener('DOMContentLoaded', function() {
    // Login tabs and forms
    const patientTab = document.getElementById('patient-tab');
    const hospitalTab = document.getElementById('hospital-tab');
    const patientForm = document.getElementById('patient-form');
    const hospitalForm = document.getElementById('hospital-form');
    const patientLeftSection = document.getElementById('patient-left-section');
    const hospitalLeftSection = document.getElementById('hospital-left-section');
    
    // Signup tabs and forms
    const patientSignupTab = document.getElementById('patient-signup-tab');
    const hospitalSignupTab = document.getElementById('hospital-signup-tab');
    const patientSignupFormContainer = document.getElementById('patient-signup-form-container');
    const hospitalSignupFormContainer = document.getElementById('hospital-signup-form-container');
    const patientSignupLeftSection = document.getElementById('patient-signup-left-section');
    const hospitalSignupLeftSection = document.getElementById('hospital-signup-left-section');
    
    // Forms
    const patientSignupForm = document.getElementById('patient-signup-form');
    const hospitalSignupForm = document.getElementById('hospital-signup-form');
    
    const API_BASE_URL = 'http://localhost:3001/api';

    // Function to switch tabs
    function switchTab(activeTab, activeForm, activeLeftSection) {
        // Remove active class from all tabs
        [patientTab, hospitalTab, patientSignupTab, hospitalSignupTab].forEach(tab => {
            if (tab) tab.classList.remove('active');
        });
        
        // Hide all forms and sections
        [patientForm, hospitalForm, patientSignupFormContainer, hospitalSignupFormContainer].forEach(form => {
            if (form) form.classList.add('hidden');
        });
        
        [patientLeftSection, hospitalLeftSection, patientSignupLeftSection, hospitalSignupLeftSection].forEach(section => {
            if (section) section.classList.add('hidden');
        });
        
        // Activate the selected tab, form and section
        activeTab.classList.add('active');
        activeForm.classList.remove('hidden');
        activeLeftSection.classList.remove('hidden');
    }

    // Event listeners for tabs
    patientTab.addEventListener('click', function() {
        switchTab(patientTab, patientForm, patientLeftSection);
    });

    hospitalTab.addEventListener('click', function() {
        switchTab(hospitalTab, hospitalForm, hospitalLeftSection);
    });
    
    patientSignupTab.addEventListener('click', function() {
        switchTab(patientSignupTab, patientSignupFormContainer, patientSignupLeftSection);
    });
    
    hospitalSignupTab.addEventListener('click', function() {
        switchTab(hospitalSignupTab, hospitalSignupFormContainer, hospitalSignupLeftSection);
    });

    // Show loading indicator
    function showLoading(form, isLoading) {
        const button = form.querySelector('button[type="submit"]');
        if (!button) return;
        
        if (isLoading) {
            button.disabled = true;
            button.textContent = 'Please wait...';
        } else {
            button.disabled = false;
            // Reset button text based on its class
            if (button.classList.contains('login-btn')) {
                button.textContent = 'Sign in now';
            } else if (button.classList.contains('signup-btn')) {
                button.textContent = button.textContent.includes('Patient') ? 
                    'Create Patient Account' : 'Create Hospital Account';
            }
        }
    }

    // Show message
    function showMessage(form, message, isError = false) {
        // Remove any existing message
        const existingMessage = form.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isError ? 'error' : 'success'}`;
        messageElement.textContent = message;
        messageElement.style.color = isError ? '#e74c3c' : '#2ecc71';
        messageElement.style.marginBottom = '15px';
        messageElement.style.textAlign = 'center';
        messageElement.style.padding = '8px';
        messageElement.style.borderRadius = '4px';
        messageElement.style.backgroundColor = isError ? '#fadbd8' : '#d5f5e3';

        // Insert message after the button
        const button = form.querySelector('.login-btn');
        button.parentNode.insertBefore(messageElement, button.nextSibling);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    // Handle patient login
    async function handlePatientLogin(email, password, form) {
        showLoading(form, true);
        try {
            const response = await fetch(`${API_BASE_URL}/patient/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Store user data in localStorage
                localStorage.setItem('userType', 'patient');
                localStorage.setItem('userEmail', email);
                
                // Store user ID and name if available
                if (data.user) {
                    if (data.user.id) {
                        localStorage.setItem('patientId', data.user.id);
                    }
                    if (data.user.name) {
                        localStorage.setItem('userName', data.user.name);
                    }
                }
                
                showMessage(form, 'Login successful! Redirecting to dashboard...', false);
                setTimeout(() => {
                    // Redirect to patient dashboard
                    window.location.href = 'patient-dashboard.html';
                }, 2000);
            } else {
                showMessage(form, data.message || 'Login failed', true);
            }
        } catch (error) {
            console.error('Error during patient login:', error);
            showMessage(form, 'Network error. Please try again.', true);
        } finally {
            showLoading(form, false);
        }
    }

    // Handle hospital login
    async function handleHospitalLogin(email, password, form) {
        showLoading(form, true);
        try {
            const response = await fetch(`${API_BASE_URL}/hospital/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Store user data in localStorage
                localStorage.setItem('userType', 'hospital');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('hospitalId', data.user.id); // Store hospital ID
                
                // If the response includes user name, store it
                if (data.user && data.user.name) {
                    localStorage.setItem('userName', data.user.name);
                }
                
                showMessage(form, 'Login successful! Redirecting to dashboard...', false);
                setTimeout(() => {
                    // Redirect to hospital dashboard
                    window.location.href = 'hospital-dashboard.html';
                }, 2000);
            } else {
                showMessage(form, data.message || 'Login failed', true);
            }
        } catch (error) {
            console.error('Error during hospital login:', error);
            showMessage(form, 'Network error. Please try again.', true);
        } finally {
            showLoading(form, false);
        }
    }

    // Form submission handling
    const patientLoginForm = document.querySelector('#patient-form form');
    const hospitalLoginForm = document.querySelector('#hospital-form form');

    patientLoginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('patient-email').value.trim();
        const password = document.getElementById('patient-password').value.trim();
        let isValid = true;
        
        // Simple validation
        if (!email) {
            document.getElementById('patient-email').style.borderColor = 'red';
            isValid = false;
        } else {
            document.getElementById('patient-email').style.borderColor = '#ddd';
        }
        
        if (!password) {
            document.getElementById('patient-password').style.borderColor = 'red';
            isValid = false;
        } else {
            document.getElementById('patient-password').style.borderColor = '#ddd';
        }
        
        if (isValid) {
            handlePatientLogin(email, password, patientLoginForm);
        }
    });

    hospitalLoginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('hospital-email').value.trim();
        const password = document.getElementById('hospital-password').value.trim();
        let isValid = true;
        
        // Simple validation
        if (!email) {
            document.getElementById('hospital-email').style.borderColor = 'red';
            isValid = false;
        } else {
            document.getElementById('hospital-email').style.borderColor = '#ddd';
        }
        
        if (!password) {
            document.getElementById('hospital-password').style.borderColor = 'red';
            isValid = false;
        } else {
            document.getElementById('hospital-password').style.borderColor = '#ddd';
        }
        
        if (isValid) {
            handleHospitalLogin(email, password, hospitalLoginForm);
        }
    });
    
    // Handle patient sign-up
    async function handlePatientSignup(name, email, password, form) {
        showLoading(form, true);
        try {
            const response = await fetch(`${API_BASE_URL}/patient/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                showMessage(form, 'Account created successfully! You can now sign in.', false);
                setTimeout(() => {
                    form.reset();
                    // Switch to login tab after successful registration
                    switchTab(patientTab, patientForm, patientLeftSection);
                }, 2000);
            } else {
                showMessage(form, data.message || 'Registration failed', true);
            }
        } catch (error) {
            console.error('Error during patient registration:', error);
            showMessage(form, 'Network error. Please try again.', true);
        } finally {
            showLoading(form, false);
        }
    }
    
    // Handle hospital sign-up
    async function handleHospitalSignup(name, email, password, form) {
        showLoading(form, true);
        try {
            const response = await fetch(`${API_BASE_URL}/hospital/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                showMessage(form, 'Hospital account created successfully! You can now sign in.', false);
                setTimeout(() => {
                    form.reset();
                    // Switch to login tab after successful registration
                    switchTab(hospitalTab, hospitalForm, hospitalLeftSection);
                }, 2000);
            } else {
                showMessage(form, data.message || 'Registration failed', true);
            }
        } catch (error) {
            console.error('Error during hospital registration:', error);
            showMessage(form, 'Network error. Please try again.', true);
        } finally {
            showLoading(form, false);
        }
    }
    
    // Patient sign-up form submission
    patientSignupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('new-patient-name').value.trim();
        const email = document.getElementById('new-patient-email').value.trim();
        const password = document.getElementById('new-patient-password').value.trim();
        const confirmPassword = document.getElementById('new-patient-confirm-password').value.trim();
        let isValid = true;
        
        // Simple validation
        if (!name) {
            document.getElementById('new-patient-name').style.borderColor = 'red';
            isValid = false;
        } else {
            document.getElementById('new-patient-name').style.borderColor = '#ddd';
        }
        
        if (!email) {
            document.getElementById('new-patient-email').style.borderColor = 'red';
            isValid = false;
        } else {
            document.getElementById('new-patient-email').style.borderColor = '#ddd';
        }
        
        if (!password) {
            document.getElementById('new-patient-password').style.borderColor = 'red';
            isValid = false;
        } else {
            document.getElementById('new-patient-password').style.borderColor = '#ddd';
        }
        
        if (!confirmPassword || password !== confirmPassword) {
            document.getElementById('new-patient-confirm-password').style.borderColor = 'red';
            isValid = false;
            showMessage(patientSignupForm, 'Passwords do not match', true);
        } else {
            document.getElementById('new-patient-confirm-password').style.borderColor = '#ddd';
        }
        
        if (isValid) {
            handlePatientSignup(name, email, password, patientSignupForm);
        }
    });
    
    // Hospital sign-up form submission
    hospitalSignupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('new-hospital-name').value.trim();
        const email = document.getElementById('new-hospital-email').value.trim();
        const password = document.getElementById('new-hospital-password').value.trim();
        const confirmPassword = document.getElementById('new-hospital-confirm-password').value.trim();
        let isValid = true;
        
        // Simple validation
        if (!name) {
            document.getElementById('new-hospital-name').style.borderColor = 'red';
            isValid = false;
        } else {
            document.getElementById('new-hospital-name').style.borderColor = '#ddd';
        }
        
        if (!email) {
            document.getElementById('new-hospital-email').style.borderColor = 'red';
            isValid = false;
        } else {
            document.getElementById('new-hospital-email').style.borderColor = '#ddd';
        }
        
        if (!password) {
            document.getElementById('new-hospital-password').style.borderColor = 'red';
            isValid = false;
        } else {
            document.getElementById('new-hospital-password').style.borderColor = '#ddd';
        }
        
        if (!confirmPassword || password !== confirmPassword) {
            document.getElementById('new-hospital-confirm-password').style.borderColor = 'red';
            isValid = false;
            showMessage(hospitalSignupForm, 'Passwords do not match', true);
        } else {
            document.getElementById('new-hospital-confirm-password').style.borderColor = '#ddd';
        }
        
        if (isValid) {
            handleHospitalSignup(name, email, password, hospitalSignupForm);
        }
    });
});
