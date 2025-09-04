document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function switchTab(tabName) {
        // Remove active class from all tabs and panels
        navTabs.forEach(tab => tab.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to selected tab and panel
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        const activePanel = document.getElementById(tabName);
        
        if (activeTab && activePanel) {
            activeTab.classList.add('active');
            activePanel.classList.add('active');
        }
    }
    

    // Add click event listeners to tabs
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function() {
        // Clear any stored user data
        localStorage.removeItem('userType');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        // Redirect to login page
        window.location.href = 'index.html';
    });

    // Set patient name from localStorage if available
    const patientNameElement = document.getElementById('patient-name');
    const storedName = localStorage.getItem('userName');
    if (storedName) {
        patientNameElement.textContent = `Welcome, ${storedName}`;
    }

    // Blood donation form handling
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
        donationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const donationData = {
                age: formData.get('age'),
                weight: formData.get('weight'),
                hemoglobin: formData.get('hemoglobin'),
                bloodType: formData.get('bloodType'),
                goodHealth: formData.get('goodHealth') === 'on',
                noInfections: formData.get('noInfections') === 'on',
                noMedications: formData.get('noMedications') === 'on',
                noRecentSurgery: formData.get('noRecentSurgery') === 'on',
                donationDate: formData.get('donationDate'),
                donationCenter: formData.get('donationCenter'),
                additionalNotes: formData.get('additionalNotes')
            };

            // Validate form data
            if (!donationData.goodHealth || !donationData.noInfections || 
                !donationData.noMedications || !donationData.noRecentSurgery) {
                showMessage('Please confirm all health requirements to proceed with blood donation.', 'error');
                return;
            }

            // Submit donation request (you can integrate with your backend here)
            submitDonationRequest(donationData);
        });
    }

    // Profile form handling
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const profileData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                dob: formData.get('dob'),
                address: formData.get('address')
            };

            // Update profile (you can integrate with your backend here)
            updateProfile(profileData);
        });
    }

    // Reschedule form handling
    const rescheduleForm = document.getElementById('reschedule-form');
    if (rescheduleForm) {
        rescheduleForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const appointmentId = document.getElementById('reschedule-appointment-id').value;
            const newDate = document.getElementById('reschedule-date').value;
            const newTime = document.getElementById('reschedule-time').value;
            const reason = document.getElementById('reschedule-reason').value;

            rescheduleAppointment(appointmentId, newDate, newTime, reason);
        });
    }

    // Cancel form handling
    const cancelForm = document.getElementById('cancel-form');
    if (cancelForm) {
        cancelForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const appointmentId = document.getElementById('cancel-appointment-id').value;
            const reason = document.getElementById('cancel-reason').value;

            cancelAppointment(appointmentId, reason);
        });
    }



    // Schedule form handling
    const scheduleForm = document.getElementById('schedule-form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const hospitalId = document.getElementById('schedule-hospital-id').value;
            const date = document.getElementById('schedule-date').value;
            const time = document.getElementById('schedule-time').value;
            const specialty = document.getElementById('schedule-specialty').value;
            const doctorId = document.getElementById('schedule-doctor').value;
            const type = document.getElementById('schedule-type').value;
            const notes = document.getElementById('schedule-notes').value;

            // Validate all required fields
            if (!specialty) {
                showMessage('Please select a medical specialty.', 'error');
                return;
            }
            
            if (!doctorId) {
                showMessage('Please select a doctor.', 'error');
                return;
            }

            scheduleAppointment(hospitalId, date, time, specialty, doctorId, type, notes);
        });
        
        // Add event listeners to automatically load available doctors
        const specialtySelect = document.getElementById('schedule-specialty');
        const dateInput = document.getElementById('schedule-date');
        const timeInput = document.getElementById('schedule-time');
        
        if (specialtySelect && dateInput && timeInput) {
            specialtySelect.addEventListener('change', loadAvailableDoctors);
            dateInput.addEventListener('change', loadAvailableDoctors);
            timeInput.addEventListener('change', loadAvailableDoctors);
        }
    }

    // Modal close button handling
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('close')) {
            const modal = event.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Search functionality for medical services
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = document.getElementById('service-search').value.trim();
            if (searchTerm) {
                searchMedicalServices(searchTerm);
            }
        });
    }

    // Filter functionality
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const ratingFilter = document.getElementById('rating-filter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    if (ratingFilter) {
        ratingFilter.addEventListener('change', applyFilters);
    }

    // Load appointments when the page loads
    console.log('🚀 Patient dashboard initialized, loading data...');
    loadAppointments();
    // loadMedicalServices() will be called by initDashboard()
    
    // Set up real-time updates for appointments
    setupRealTimeUpdates();

    // Functions
    async function loadAppointments() {
        try {
            const patientId = localStorage.getItem('patientId');
            if (!patientId) {
                showMessage('Patient ID not found. Please log in again.', 'error');
                return;
            }

            const response = await fetch(`http://localhost:3001/api/patient/appointments/${patientId}`);
            if (!response.ok) {
                throw new Error('Failed to load appointments');
            }

            const data = await response.json();
            if (data.success) {
                console.log('📊 Appointments refreshed:', data.appointments);
                displayAppointments(data.appointments);
                
                // Show notification if there are status changes
                checkForStatusChanges(data.appointments);
            } else {
                throw new Error(data.message || 'Failed to load appointments');
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
            showMessage('Failed to load appointments. Please try again.', 'error');
            document.getElementById('appointments-container').innerHTML = 
                '<div class="error-message">Failed to load appointments. Please try again.</div>';
        }
    }
    
    // Set up real-time updates for appointments
    function setupRealTimeUpdates() {
        console.log('🔄 Setting up real-time appointment updates...');
        
        // Refresh appointments every 30 seconds
        const refreshInterval = setInterval(() => {
            console.log('⏰ Auto-refreshing appointments...');
            loadAppointments();
        }, 30000); // 30 seconds
        
        // Refresh when page becomes visible (user switches back to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('👁️ Page became visible, refreshing appointments...');
                loadAppointments();
            }
        });
        
        // Refresh when user focuses on the window
        window.addEventListener('focus', () => {
            console.log('🎯 Window focused, refreshing appointments...');
            loadAppointments();
        });
        
        // Store the interval ID for cleanup
        window.appointmentRefreshInterval = refreshInterval;
        
        console.log('✅ Real-time updates configured');
    }
    
    // Check for status changes and show notifications
    function checkForStatusChanges(appointments) {
        const previousAppointments = window.previousAppointments || [];
        const currentAppointments = appointments || [];
        
        if (previousAppointments.length === 0) {
            // First load, just store the current state
            window.previousAppointments = currentAppointments.map(apt => ({
                id: apt._id,
                status: apt.status
            }));
            return;
        }
        
        // Check for status changes
        currentAppointments.forEach(currentApt => {
            const previousApt = previousAppointments.find(prev => prev.id === currentApt._id);
            
            if (previousApt && previousApt.status !== currentApt.status) {
                // Status changed! Show notification
                const statusMessage = getStatusChangeMessage(previousApt.status, currentApt.status);
                showMessage(statusMessage, 'success');
                
                // Update the previous state
                previousApt.status = currentApt.status;
            }
        });
        
        // Update stored appointments
        window.previousAppointments = currentAppointments.map(apt => ({
            id: apt._id,
            status: apt.status
        }));
    }
    
    // Manual refresh function for appointments
    function refreshAppointments() {
        console.log('🔄 Manual refresh requested...');
        showMessage('Refreshing appointments...', 'info');
        loadAppointments();
    }
    
    // Get user-friendly message for status changes
    function getStatusChangeMessage(oldStatus, newStatus) {
        const statusMessages = {
            'pending': '⏳ Your appointment is pending approval',
            'approved': '✅ Your appointment has been approved!',
            'rejected': '❌ Your appointment has been rejected',
            'cancelled': '🚫 Your appointment has been cancelled',
            'completed': '🏥 Your appointment has been completed',
            'rescheduled': '📅 Your appointment has been rescheduled'
        };
        
        if (newStatus === 'approved') {
            return '🎉 Great news! Your appointment has been approved by the hospital!';
        } else if (newStatus === 'rejected') {
            return '⚠️ Your appointment has been rejected. Please contact the hospital for more information.';
        } else if (newStatus === 'completed') {
            return '🏥 Your appointment has been marked as completed. Thank you for choosing our services!';
        }
        
        return statusMessages[newStatus] || `Status updated to: ${newStatus}`;
    }

    async function loadMedicalServices() {
        console.log('🏥 loadMedicalServices called, fetching hospitals...');
        try {
            const response = await fetch('http://localhost:3001/api/hospitals/medical-comparison');
            console.log('📡 API response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Failed to load hospitals for comparison');
            }

            const data = await response.json();
            console.log('📊 API response data:', data);
            
            if (data.success) {
                console.log(`✅ Found ${data.hospitals.length} hospitals, displaying...`);
                displayHospitalsForComparison(data.hospitals);
            } else {
                throw new Error(data.message || 'Failed to load hospitals for comparison');
            }
        } catch (error) {
            console.error('❌ Error loading hospitals for comparison:', error);
            document.getElementById('comparison-results').innerHTML = 
                '<div class="error-message">Failed to load hospitals for comparison. Please try again.</div>';
        }
    }

    function displayHospitalsForComparison(hospitals) {
        console.log('🎨 displayHospitalsForComparison called with:', hospitals);
        const container = document.getElementById('comparison-results');
        console.log('🔍 Container element:', container);
        
        if (!hospitals || hospitals.length === 0) {
            console.log('⚠️ No hospitals to display');
            container.innerHTML = '<div class="no-services">No hospitals available for comparison.</div>';
            return;
        }

        console.log(`🎯 Rendering ${hospitals.length} hospitals...`);
        container.innerHTML = hospitals.map(hospital => `
            <div class="result-card" data-hospital-id="${hospital._id}">
                <div class="hospital-info">
                    <h3>${hospital.name}</h3>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${hospital.address}</p>
                    <p class="hospital-type"><i class="fas fa-hospital"></i> ${hospital.type}</p>
                    <div class="rating">
                        ${hospital.hasRating ? 
                            `<span class="stars">${'★'.repeat(Math.floor(hospital.rating))}${'☆'.repeat(5 - Math.floor(hospital.rating))}</span>
                             <span class="rating-text">${hospital.rating}/5 (${hospital.totalRatings} ratings)</span>` :
                            `<span class="rating-text no-rating">No ratings yet</span>`
                        }
                    </div>
                </div>
                <div class="hospital-details">
                    <h4>Specialties & Services</h4>
                    <div class="specialties">
                        <strong>Specialties:</strong> ${hospital.specialties.length > 0 ? hospital.specialties.join(', ') : 'Not specified'}
                    </div>
                    <div class="services">
                        <strong>Services:</strong> ${hospital.services.length > 0 ? hospital.services.join(', ') : 'Not specified'}
                    </div>
                    <p class="contact"><i class="fas fa-phone"></i> ${hospital.phone}</p>
                    <p class="contact"><i class="fas fa-envelope"></i> ${hospital.email}</p>
                </div>
                <div class="actions">
                    <button class="btn-secondary" onclick="openScheduleModal('${hospital._id}', '${hospital.name}')">Schedule Appointment</button>
                    <button class="btn-outline" onclick="openHospitalDetailsModal('${hospital._id}', '${hospital.name}')">View Details & Rate</button>
                </div>
            </div>
        `).join('');
    }

    function displayAppointments(appointments) {
        const container = document.getElementById('appointments-container');
        
        if (!appointments || appointments.length === 0) {
            container.innerHTML = '<div class="no-appointments">No appointments scheduled.</div>';
            return;
        }

        container.innerHTML = appointments.map(appointment => `
            <div class="appointment-card ${appointment.status.toLowerCase()}" data-appointment-id="${appointment._id}">
                <div class="appointment-header">
                    <h3>${appointment.doctorName || 'TBD'} - ${appointment.specialty}</h3>
                    <span class="status-badge status-${appointment.status.toLowerCase()}">
                        ${getAppointmentStatusDisplay(appointment.status)}
                    </span>
                </div>
                <div class="appointment-details">
                    <p><i class="fas fa-calendar"></i> Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p><i class="fas fa-clock"></i> Time: ${appointment.appointmentTime}</p>
                    <p><i class="fas fa-map-marker-alt"></i> Location: ${appointment.hospitalName}</p>
                    <p><i class="fas fa-stethoscope"></i> Type: ${appointment.appointmentType || 'General Consultation'}</p>
                    <p><i class="fas fa-user-md"></i> Specialty: ${appointment.specialty}</p>
                    ${appointment.notes ? `<p><i class="fas fa-notes-medical"></i> Notes: ${appointment.notes}</p>` : ''}
                </div>
                <div class="appointment-actions">
                    ${getPatientAppointmentActions(appointment)}
                </div>
            </div>
        `).join('');
    }

    // Get appointment status display with icons
    function getAppointmentStatusDisplay(status) {
        const statusMap = {
            'pending': '⏳ Pending Approval',
            'approved': '✅ Approved',
            'rejected': '❌ Rejected',
            'cancelled': '🚫 Cancelled',
            'completed': '✅ Completed'
        };
        return statusMap[status] || status;
    }

    // Get patient appointment actions based on status
    function getPatientAppointmentActions(appointment) {
        if (appointment.status === 'pending') {
            return `
                <div class="status-info">
                    <p><i class="fas fa-info-circle"></i> Your appointment is pending hospital approval</p>
                </div>
            `;
        } else if (appointment.status === 'approved') {
            return `
                <button class="btn-secondary" onclick="openRescheduleModal('${appointment._id}', '${appointment.doctorName || 'TBD'}', '${appointment.specialty}', '${appointment.appointmentDate}', '${appointment.appointmentTime}')">Reschedule</button>
                <button class="btn-danger" onclick="openCancelModal('${appointment._id}', '${appointment.doctorName || 'TBD'}', '${appointment.specialty}', '${appointment.appointmentDate}', '${appointment.appointmentTime}')">Cancel</button>
            `;
        } else if (appointment.status === 'rejected') {
            return `
                <div class="status-info rejected">
                    <p><i class="fas fa-exclamation-triangle"></i> Appointment was rejected by hospital</p>
                    <button class="btn-primary" onclick="openScheduleModal('${appointment.hospitalId}', '${appointment.hospitalName}')">Book New Appointment</button>
                </div>
            `;
        } else if (appointment.status === 'cancelled') {
            return `
                <div class="status-info cancelled">
                    <p><i class="fas fa-ban"></i> Appointment was cancelled</p>
                    <button class="btn-primary" onclick="openScheduleModal('${appointment.hospitalId}', '${appointment.hospitalName}')">Book New Appointment</button>
                </div>
            `;
        } else if (appointment.status === 'completed') {
            return `
                <div class="status-info completed">
                    <p><i class="fas fa-check-circle"></i> Appointment completed successfully</p>
                </div>
            `;
        } else {
            return `
                <div class="status-info">
                    <p><i class="fas fa-question-circle"></i> Status: ${appointment.status}</p>
                </div>
            `;
        }
    }

    // Global functions for modals
    window.openRescheduleModal = function(appointmentId, doctorName, specialty, date, time) {
        document.getElementById('reschedule-appointment-id').value = appointmentId;
        document.getElementById('reschedule-date').value = date.split('T')[0];
        document.getElementById('reschedule-time').value = time;
        document.getElementById('reschedule-modal').style.display = 'block';
    };

    window.openCancelModal = function(appointmentId, doctorName, specialty, date, time) {
        document.getElementById('cancel-appointment-id').value = appointmentId;
        document.getElementById('cancel-appointment-summary').innerHTML = `
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Specialty:</strong> ${specialty}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
        `;
        document.getElementById('cancel-modal').style.display = 'block';
    };



    window.openScheduleModal = function(hospitalId, hospitalName) {
        console.log('🚀 openScheduleModal called with:', { hospitalId, hospitalName });
        console.log('🔍 Current timestamp:', new Date().toISOString());
        
        document.getElementById('schedule-hospital-id').value = hospitalId;
        document.getElementById('schedule-service-summary').innerHTML = `
            <p><strong>Hospital:</strong> ${hospitalName}</p>
            <p><strong>Note:</strong> Please select your preferred medical specialty below</p>
        `;
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('schedule-date').min = today;
        
        // Reset specialty selection
        document.getElementById('schedule-specialty').value = '';
        
        // Reset doctor selection
        document.getElementById('schedule-doctor').innerHTML = '<option value="">First select specialty, date, and time</option>';
        
        // Reset availability display
        document.getElementById('availability-display').style.display = 'none';
        document.getElementById('availability-results').innerHTML = '';
        
        // Show modal
        document.getElementById('schedule-modal').style.display = 'block';
        
        // Enhanced: Ensure form actions are visible with enhanced styling
        const formActions = document.querySelector('#schedule-modal .form-actions');
        if (formActions) {
            formActions.style.cssText = `
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: static !important;
                height: auto !important;
                overflow: visible !important;
                z-index: 1000 !important;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
                border: 3px solid #667eea !important;
                border-radius: 15px !important;
                padding: 25px !important;
                margin: 25px 0 !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 20px !important;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2) !important;
            `;
            console.log('✅ Form actions element found and enhanced styling applied');
            
            // Force all buttons to be visible with enhanced styling
            const allButtons = formActions.querySelectorAll('button');
            allButtons.forEach(button => {
                if (button.classList.contains('btn-primary')) {
                    // Book Appointment button
                    button.style.cssText = `
                        display: inline-block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        position: static !important;
                        height: auto !important;
                        width: auto !important;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        color: white !important;
                        padding: 15px 30px !important;
                        font-size: 18px !important;
                        font-weight: 700 !important;
                        border: none !important;
                        border-radius: 10px !important;
                        cursor: pointer !important;
                        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
                        margin: 10px 5px !important;
                        min-width: 180px !important;
                        text-align: center !important;
                        transition: all 0.3s ease !important;
                    `;
                } else if (button.classList.contains('btn-secondary')) {
                    // Cancel button
                    button.style.cssText = `
                        display: inline-block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        position: static !important;
                        height: auto !important;
                        width: auto !important;
                        min-width: 120px !important;
                        padding: 12px 24px !important;
                        font-size: 16px !important;
                        font-weight: 600 !important;
                        background: #6c757d !important;
                        color: white !important;
                        border: none !important;
                        border-radius: 8px !important;
                        cursor: pointer !important;
                    `;
                }
                console.log('🎯 Button enhanced and forced visible:', button.textContent);
            });
        } else {
            console.error('❌ Form actions element not found!');
        }
        
        // Additional force visibility after a short delay
        setTimeout(() => {
            const formActionsDelayed = document.querySelector('#schedule-modal .form-actions');
            if (formActionsDelayed) {
                formActionsDelayed.style.display = 'flex !important';
                formActionsDelayed.style.visibility = 'visible !important';
                formActionsDelayed.style.opacity = '1 !important';
                
                const allButtonsDelayed = formActionsDelayed.querySelectorAll('button');
                allButtonsDelayed.forEach(button => {
                    button.style.display = 'inline-block !important';
                    button.style.visibility = 'visible !important';
                    button.style.opacity = '1 !important';
                });
                console.log('Delayed force visibility applied');
            }
        }, 100);
    };

    window.openHospitalDetailsModal = function(hospitalId, hospitalName) {
        console.log('🔍 openHospitalDetailsModal called with:', { hospitalId, hospitalName });
        
        // Store current hospital ID for rating
        window.currentHospitalId = hospitalId;
        console.log('💾 Stored currentHospitalId:', window.currentHospitalId);
        
        // Update modal title
        const titleElement = document.getElementById('hospital-details-title');
        if (titleElement) {
            titleElement.textContent = `${hospitalName} - Details`;
            console.log('📝 Updated modal title');
        } else {
            console.error('❌ hospital-details-title element not found');
        }
        
        // Load hospital details
        loadHospitalDetails(hospitalId);
        
        // Show modal
        const modalElement = document.getElementById('hospital-details-modal');
        if (modalElement) {
            // Force modal to be visible
            modalElement.style.display = 'block';
            modalElement.style.visibility = 'visible';
            modalElement.style.opacity = '1';
            modalElement.style.zIndex = '1000';
            
            console.log('✅ Modal displayed successfully');
            console.log('🔍 Modal element styles:', {
                display: modalElement.style.display,
                visibility: modalElement.style.visibility,
                zIndex: modalElement.style.zIndex,
                position: modalElement.style.position,
                opacity: modalElement.style.opacity
            });
            
            // Test if modal content is visible
            const modalContent = modalElement.querySelector('.modal-content');
            if (modalContent) {
                console.log('✅ Modal content found and visible');
            } else {
                console.error('❌ Modal content not found');
            }
            
                    // Ensure rating section is visible
        const ratingSection = document.getElementById('hospital-rating-section');
        if (ratingSection) {
            ratingSection.style.display = 'block';
            ratingSection.style.visibility = 'visible';
            ratingSection.style.opacity = '1';
            console.log('✅ Rating section made visible in modal');
            

            
        } else {
            console.error('❌ Rating section not found in modal');
        }
        } else {
            console.error('❌ hospital-details-modal element not found');
        }
    };

    async function loadHospitalDetails(hospitalId) {
        try {
            const response = await fetch(`http://localhost:3001/api/hospital/${hospitalId}`);
            if (!response.ok) {
                throw new Error('Failed to load hospital details');
            }

            const data = await response.json();
            if (data.success) {
                displayHospitalDetails(data.hospital);
            } else {
                throw new Error(data.message || 'Failed to load hospital details');
            }
        } catch (error) {
            console.error('Error loading hospital details:', error);
            document.getElementById('hospital-details-content').innerHTML = 
                '<div class="error-message">Failed to load hospital details. Please try again.</div>';
        }
    }

    function displayHospitalDetails(hospital) {
        console.log('🎨 displayHospitalDetails called with:', hospital);
        const contentDiv = document.getElementById('hospital-details-content');
        console.log('🔍 Container element:', contentDiv);
        
        if (!contentDiv) {
            console.error('❌ hospital-details-content element not found');
            return;
        }

        console.log('🎯 Rendering hospital details...');
        
        contentDiv.innerHTML = `
            <div class="hospital-info-detailed">
                <div class="hospital-header">
                    <h4>${hospital.name}</h4>
                    <span class="hospital-type">${hospital.type || 'General'}</span>
                </div>
                
                <div class="hospital-stats">
                    <div class="stat-item rating-highlight">
                        <strong>Current Rating:</strong> 
                        ${hospital.totalRatings > 0 ? 
                            `<span class="current-rating">${hospital.rating}/5 ⭐ (${hospital.totalRatings} ratings)</span>` : 
                            '<span class="no-rating-yet">No ratings yet</span>'
                        }
                    </div>
                    <div class="stat-item">
                        <strong>Total Beds:</strong> ${hospital.totalBeds || 'Not specified'}
                    </div>
                    <div class="stat-item">
                        <strong>Staff Count:</strong> ${hospital.staffCount || 'Not specified'}
                    </div>
                    <div class="stat-item">
                        <strong>Annual Patients:</strong> ${hospital.annualPatients || 'Not specified'}
                    </div>
                </div>

                <div class="hospital-details-section">
                    <div class="detail-group">
                        <h5>Accreditation</h5>
                        <p>${hospital.accreditation || 'Not specified'}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Ensure the rating section is visible
        const ratingSection = document.getElementById('hospital-rating-section');
        if (ratingSection) {
            // Force all visibility properties
            ratingSection.style.display = 'block';
            ratingSection.style.visibility = 'visible';
            ratingSection.style.opacity = '1';
            ratingSection.style.height = 'auto';
            ratingSection.style.overflow = 'visible';
            ratingSection.style.position = 'static';
            ratingSection.style.zIndex = '1001';
            
            console.log('✅ Rating section made visible');
            console.log('🔍 Rating section styles:', {
                display: ratingSection.style.display,
                visibility: ratingSection.style.visibility,
                opacity: ratingSection.style.opacity,
                height: ratingSection.offsetHeight,
                width: ratingSection.offsetWidth,
                computedDisplay: window.getComputedStyle(ratingSection).display,
                computedVisibility: window.getComputedStyle(ratingSection).visibility
            });
            
            // Check if rating form elements exist
            const ratingSelect = ratingSection.querySelector('#hospital-rating');
            const ratingButton = ratingSection.querySelector('button[onclick="submitHospitalRating()"]');
            
            if (ratingSelect) {
                console.log('✅ Rating select found');
                ratingSelect.style.display = 'block';
                ratingSelect.style.visibility = 'visible';
            } else {
                console.error('❌ Rating select not found');
            }
            
            if (ratingButton) {
                console.log('✅ Rating button found');
                ratingButton.style.display = 'block';
                ratingButton.style.visibility = 'visible';
            } else {
                console.error('❌ Rating button not found');
            }
            

            
        } else {
            console.error('❌ Rating section not found');
        }
    }

    window.submitHospitalRating = async function() {
        console.log('🌟 submitHospitalRating called');
        
        const ratingElement = document.getElementById('hospital-rating');
        const rating = ratingElement ? ratingElement.value : null;
        const hospitalId = window.currentHospitalId;
        
        console.log('📊 Rating form data:', { rating, hospitalId, ratingElement: !!ratingElement });
        
        if (!rating) {
            console.log('❌ No rating selected');
            showMessage('Please select a rating before submitting.', 'error');
            return;
        }
        
        if (!hospitalId) {
            console.log('❌ No hospital ID found');
            showMessage('Hospital ID not found. Please try again.', 'error');
            return;
        }
        
        console.log('🚀 Submitting rating:', { rating, hospitalId });
        
        try {
            const response = await fetch(`http://localhost:3001/api/hospital/${hospitalId}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating: parseInt(rating) })
            });
            
            console.log('📡 API response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📊 API response data:', data);
                
                if (data.success) {
                    console.log('✅ Rating submitted successfully');
                    showMessage('Thank you for rating this hospital! Your rating has been recorded.', 'success');
                    
                    // Reset rating form
                    if (ratingElement) {
                        ratingElement.value = '';
                        console.log('🔄 Rating form reset');
                    }
                    
                    // Refresh hospital details to show updated rating
                    loadHospitalDetails(hospitalId);
                    
                    // Refresh the main comparison list
                    loadMedicalServices();
                } else {
                    console.log('❌ API returned success: false');
                    showMessage(`Error: ${data.message}`, 'error');
                }
            } else {
                console.log('❌ HTTP error response');
                showMessage(`HTTP Error: ${response.status}`, 'error');
            }
        } catch (error) {
            console.error('❌ Error submitting hospital rating:', error);
            showMessage('Error submitting rating. Please try again.', 'error');
        }
    };

    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

    async function submitDonationRequest(donationData) {
        // Show loading state
        const submitBtn = donationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            // Get patient ID from localStorage (we'll need to store this when patient logs in)
            const patientId = localStorage.getItem('patientId');
            if (!patientId) {
                throw new Error('Patient ID not found. Please log in again.');
            }

            // Prepare the data for the API
            const apiData = {
                donorId: patientId,
                age: parseInt(donationData.age),
                weight: parseFloat(donationData.weight),
                hemoglobin: parseFloat(donationData.hemoglobin),
                bloodType: donationData.bloodType,
                healthStatus: {
                    goodHealth: donationData.goodHealth === 'on' || donationData.goodHealth === true,
                    noInfections: donationData.noInfections === 'on' || donationData.noInfections === true,
                    noMedications: donationData.noMedications === 'on' || donationData.noMedications === true,
                    noRecentSurgery: donationData.noRecentSurgery === 'on' || donationData.noRecentSurgery === true
                },
                donationDate: new Date(donationData.donationDate), // Convert to Date object
                donationCenter: donationData.donationCenter || 'Not specified',
                additionalNotes: donationData.additionalNotes || '',
                status: 'pending'
            };

            // Send data to the API
            const response = await fetch('http://localhost:3001/api/patient/blood-donation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit donation request');
            }

            const result = await response.json();

            // Show success message
            showMessage('Blood donation request submitted successfully! We will contact you soon.', 'success');
            
            // Reset form
            donationForm.reset();

            // Log the successful submission
            console.log('Blood donation submitted successfully:', result);

        } catch (error) {
            console.error('Error submitting blood donation:', error);
            showMessage(`Error: ${error.message}`, 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Load blood donations for the current patient
    async function loadBloodDonations() {
        try {
            const patientId = localStorage.getItem('patientId');
            if (!patientId) {
                console.log('Patient ID not found, cannot load blood donations');
                return;
            }

            const response = await fetch(`http://localhost:3001/api/patient/blood-donations/${patientId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    displayBloodDonations(data.donations);
                }
            }
        } catch (error) {
            console.error('Error loading blood donations:', error);
        }
    }

    // Display blood donations in the UI
    function displayBloodDonations(donations) {
        const container = document.getElementById('blood-donations-list');
        if (!container) return;

        if (donations.length === 0) {
            container.innerHTML = '<p class="no-data">No blood donations found.</p>';
            return;
        }

        const donationsHTML = donations.map(donation => `
            <div class="donation-card">
                <div class="donation-header">
                    <h4>Blood Donation Request</h4>
                    <span class="status status-${donation.status}">${donation.status}</span>
                </div>
                <div class="donation-details">
                    <p><strong>Blood Type:</strong> ${donation.bloodType}</p>
                    <p><strong>Donation Date:</strong> ${new Date(donation.donationDate).toLocaleDateString()}</p>
                    <p><strong>Center:</strong> ${donation.donationCenter}</p>
                    <p><strong>Submitted:</strong> ${new Date(donation.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `).join('');

        container.innerHTML = donationsHTML;
    }

    async function rescheduleAppointment(appointmentId, newDate, newTime, reason) {
        try {
            const response = await fetch(`http://localhost:3001/api/patient/appointments/${appointmentId}/reschedule`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newDate,
                    newTime,
                    reason
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reschedule appointment');
            }

            const result = await response.json();
            showMessage('Appointment rescheduled successfully!', 'success');
            
            // Close modal and reload appointments
            closeModal('reschedule-modal');
            document.getElementById('reschedule-form').reset();
            loadAppointments();

        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            showMessage(`Error: ${error.message}`, 'error');
        }
    }



    // Load available doctors based on selected specialty, date, and time
    async function loadAvailableDoctors() {
        const hospitalId = document.getElementById('schedule-hospital-id').value;
        const specialty = document.getElementById('schedule-specialty').value;
        const date = document.getElementById('schedule-date').value;
        const time = document.getElementById('schedule-time').value;
        const doctorSelect = document.getElementById('schedule-doctor');
        
        // Reset doctor selection
        doctorSelect.innerHTML = '<option value="">Loading available doctors...</option>';
        
        // Check if all required fields are filled
        if (!hospitalId || !specialty || !date || !time) {
            doctorSelect.innerHTML = '<option value="">First select specialty, date, and time</option>';
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:3001/api/hospital/${hospitalId}/available-doctors?specialty=${encodeURIComponent(specialty)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
            
            if (!response.ok) {
                throw new Error('Failed to load available doctors');
            }
            
            const data = await response.json();
            
                                if (data.success) {
                        if (data.availableDoctors.length > 0) {
                            doctorSelect.innerHTML = '<option value="">Select a doctor</option>' + 
                                data.availableDoctors.map(doctor => 
                                    `<option value="${doctor._id}">${doctor.name} - ${doctor.specialty} (${doctor.qualification || 'MD'})</option>`
                                ).join('');
                            
                            showMessage(`Found ${data.availableDoctors.length} available doctor(s) for your selection!`, 'success');
                        } else {
                            doctorSelect.innerHTML = '<option value="">No doctors available for this time</option>';
                            showMessage('No doctors are available for the selected specialty, date, and time. Please try a different combination.', 'warning');
                        }
                    } else {
                        doctorSelect.innerHTML = '<option value="">Error loading doctors</option>';
                        showMessage(data.message || 'Failed to load available doctors', 'error');
                    }
        } catch (error) {
            console.error('Error loading available doctors:', error);
            doctorSelect.innerHTML = '<option value="">Error loading doctors</option>';
            showMessage('Failed to load available doctors. Please try again.', 'error');
        }
    }

    // Move form to nearest available slot for a given specialty across all hospitals
    async function checkDoctorAvailability() {
        console.log('🔄 Moving to nearest available slot across all hospitals...');
        
        const specialty = document.getElementById('schedule-specialty').value;
        const selectedDate = document.getElementById('schedule-date').value;
        const selectedTime = document.getElementById('schedule-time').value;
        const availabilityDisplay = document.getElementById('availability-display');
        const availabilityResults = document.getElementById('availability-results');
        
        console.log('📋 Form values:', { specialty, selectedDate, selectedTime });
        console.log('🔍 DOM elements:', { availabilityDisplay, availabilityResults });
        
        if (!specialty) {
            showMessage('Please select a medical specialty first.', 'warning');
            return;
        }
        
        if (!selectedDate || !selectedTime) {
            showMessage('Please select both date and time first.', 'warning');
            return;
        }
        
        try {
            // Show loading state
            availabilityDisplay.style.display = 'block';
            availabilityResults.innerHTML = '<p>🔄 Searching all hospitals for nearest available slot...</p>';
            
            // Get all hospitals first
            const hospitalsResponse = await fetch('http://localhost:3001/api/hospitals/medical-comparison');
            if (!hospitalsResponse.ok) {
                throw new Error('Failed to load hospitals');
            }
            
            const hospitalsData = await hospitalsResponse.json();
            console.log('🏥 Found hospitals:', hospitalsData.hospitals.length);
            
            // Search across all hospitals for available slots
            const allAvailableSlots = [];
            
            for (const hospital of hospitalsData.hospitals) {
                console.log(`🔍 Checking hospital: ${hospital.name}`);
                
                // Get doctors for this specialty at this hospital
                const doctorsResponse = await fetch(`http://localhost:3001/api/hospital/${hospital._id}/doctors-by-specialty?specialty=${encodeURIComponent(specialty)}`);
                
                if (doctorsResponse.ok) {
                    const doctorsData = await doctorsResponse.json();
                    
                    if (doctorsData.success && doctorsData.doctors.length > 0) {
                        console.log(`✅ Found ${doctorsData.doctors.length} doctors at ${hospital.name}`);
                        
                        // Find available slots for this hospital
                        const hospitalSlots = await findNearestAvailableSlots(hospital._id, specialty, selectedDate, selectedTime, doctorsData.doctors);
                        
                        // Add hospital information to each slot
                        hospitalSlots.forEach(slot => {
                            slot.hospitalId = hospital._id;
                            slot.hospitalName = hospital.name;
                            slot.doctorCount = doctorsData.doctors.length;
                        });
                        
                        allAvailableSlots.push(...hospitalSlots);
                    } else {
                        console.log(`⚠️ No doctors found at ${hospital.name} for ${specialty}`);
                    }
                } else {
                    console.log(`❌ Failed to load doctors from ${hospital.name}`);
                }
            }
            
            if (allAvailableSlots.length > 0) {
                // Sort all available slots by time difference and day offset
                allAvailableSlots.sort((a, b) => {
                    if (a.timeDifference !== b.timeDifference) {
                        return a.timeDifference - b.timeDifference;
                    }
                    return a.dayOffset - b.dayOffset;
                });
                
                console.log('✅ Total available slots across all hospitals:', allAvailableSlots.length);
                
                // Get the best available slot
                const bestSlot = allAvailableSlots[0];
                
                // Update the form with the best available slot
                document.getElementById('schedule-date').value = bestSlot.date;
                document.getElementById('schedule-time').value = bestSlot.time;
                document.getElementById('schedule-hospital-id').value = bestSlot.hospitalId;
                
                // Update the hospital summary to show the new hospital
                const hospitalSummary = document.getElementById('schedule-service-summary');
                if (hospitalSummary) {
                    hospitalSummary.innerHTML = `
                        <p><strong>Hospital:</strong> ${bestSlot.hospitalName}</p>
                        <p><strong>Note:</strong> Moved to best available slot across all hospitals</p>
                    `;
                }
                
                // Generate availability display with all available slots
                const availabilityHTML = generateAvailabilityHTMLWithSlotsAllHospitals(allAvailableSlots, selectedDate, selectedTime);
                availabilityResults.innerHTML = availabilityHTML;
                
                showMessage(`✅ Moved to best available slot! Found ${allAvailableSlots.length} slots across all hospitals. Updated to: ${bestSlot.hospitalName} on ${bestSlot.date} at ${bestSlot.time}`, 'success');
                console.log('✅ Form moved to best available slot across all hospitals');
            } else {
                availabilityResults.innerHTML = '<p>❌ No available slots found for the selected specialty, date, and time across all hospitals.</p>';
                showMessage('No available slots found across all hospitals. Please try a different date, time, or specialty.', 'warning');
            }
        } catch (error) {
            console.error('❌ Error moving to available slot:', error);
            availabilityResults.innerHTML = '<p>Error finding available slots. Please try again.</p>';
            showMessage('Failed to find available slots.', 'error');
        }
    }

    // Debug function to check form actions visibility
    function debugFormActions() {
        console.log('🔧 Debug: Checking form actions visibility');
        
        const formActions = document.querySelector('#schedule-modal .form-actions');
        const bookBtn = document.getElementById('book-appointment-btn');
        const checkBtn = document.getElementById('check-availability-btn');
        
        console.log('🔍 Form actions element:', formActions);
        console.log('🔍 Book appointment button:', bookBtn);
        console.log('🔍 Check availability button:', checkBtn);
        
        if (formActions) {
            console.log('📊 Form actions styles:', {
                display: formActions.style.display,
                visibility: formActions.style.visibility,
                opacity: formActions.style.opacity,
                position: formActions.style.position,
                height: formActions.style.height,
                overflow: formActions.style.overflow,
                zIndex: formActions.style.zIndex
            });
            
            // Force visibility
            formActions.style.display = 'flex';
            formActions.style.visibility = 'visible';
            formActions.style.opacity = '1';
            formActions.style.position = 'static';
            formActions.style.height = 'auto';
            formActions.style.overflow = 'visible';
            formActions.style.zIndex = '1000';
            
            console.log('✅ Form actions forced to be visible');
        }
        
        if (bookBtn) {
            console.log('📊 Book button styles:', {
                display: bookBtn.style.display,
                visibility: bookBtn.style.visibility,
                opacity: bookBtn.style.opacity
            });
            
            // Force button visibility
            bookBtn.style.display = 'inline-block';
            bookBtn.style.visibility = 'visible';
            bookBtn.style.opacity = '1';
            
            console.log('✅ Book button forced to be visible');
        }
        
        if (checkBtn) {
            console.log('📊 Check availability button styles:', {
                display: checkBtn.style.display,
                visibility: checkBtn.style.visibility,
                opacity: checkBtn.style.opacity
            });
        }
    }

    // Find nearest available slots for a given date and time
    async function findNearestAvailableSlots(hospitalId, specialty, selectedDate, selectedTime, doctors) {
        console.log('🔄 Finding nearest available slots for:', { hospitalId, specialty, selectedDate, selectedTime });
        
        const availableSlots = [];
        const selectedDateTime = new Date(selectedDate + 'T' + selectedTime);
        const currentDate = new Date();
        
        // Check current date and next 7 days
        for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
            const checkDate = new Date(currentDate);
            checkDate.setDate(currentDate.getDate() + dayOffset);
            const dateString = checkDate.toISOString().split('T')[0];
            
            console.log(`📅 Checking availability for ${dateString} (day ${dayOffset})`);
            
            // Define available time slots for each day
            const timeSlots = [
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
            ];
            
            for (const timeSlot of timeSlots) {
                // Check if this slot is available
                const isAvailable = await checkSlotAvailability(hospitalId, specialty, dateString, timeSlot, doctors);
                
                if (isAvailable) {
                    const slotDateTime = new Date(dateString + 'T' + timeSlot);
                    const timeDifference = Math.abs(slotDateTime - selectedDateTime);
                    
                    availableSlots.push({
                        date: dateString,
                        time: timeSlot,
                        timeDifference: timeDifference,
                        dayOffset: dayOffset
                    });
                    
                    console.log(`✅ Slot available: ${dateString} at ${timeSlot}`);
                } else {
                    console.log(`❌ Slot unavailable: ${dateString} at ${timeSlot}`);
                }
            }
        }
        
        // Sort by time difference (closest first) and then by day offset
        availableSlots.sort((a, b) => {
            if (a.timeDifference !== b.timeDifference) {
                return a.timeDifference - b.timeDifference;
            }
            return a.dayOffset - b.dayOffset;
        });
        
        console.log('✅ Found available slots:', availableSlots);
        return availableSlots;
    }
    
    // Check if a specific slot is available
    async function checkSlotAvailability(hospitalId, specialty, date, time, doctors) {
        try {
            console.log('🔍 Checking slot availability for:', { hospitalId, specialty, date, time });
            
            // Check if any doctor is available at this time
            const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            
            for (const doctor of doctors) {
                // Check if doctor is available on this day
                if (doctor.availability && doctor.availability[dayOfWeek] && doctor.availability[dayOfWeek].length > 0) {
                    // Check if the time falls within any available slot
                    const isTimeAvailable = doctor.availability[dayOfWeek].some(slot => {
                        return time >= slot.start && time <= slot.end;
                    });
                    
                    if (isTimeAvailable) {
                        console.log(`✅ Doctor ${doctor.name} is available on ${dayOfWeek} at ${time}`);
                        
                        // Check for conflicting appointments in the appointments collection
                        const response = await fetch(`http://localhost:3001/api/hospital/${hospitalId}/check-appointment-conflicts?specialty=${encodeURIComponent(specialty)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
                        
                        if (response.ok) {
                            const data = await response.json();
                            if (data.success && !data.hasConflict) {
                                console.log(`✅ No conflicts found for ${date} at ${time} - Slot is available`);
                                return true; // Slot is available
                            } else {
                                console.log(`❌ Conflict found for ${date} at ${time} - Slot is booked`);
                            }
                        } else {
                            console.log(`⚠️ Error checking conflicts for ${date} at ${time}`);
                        }
                    } else {
                        console.log(`❌ Doctor ${doctor.name} is not available on ${dayOfWeek} at ${time}`);
                    }
                } else {
                    console.log(`❌ Doctor ${doctor.name} has no availability on ${dayOfWeek}`);
                }
            }
            
            console.log(`❌ No available doctors found for ${date} at ${time}`);
            return false; // Slot is not available
        } catch (error) {
            console.error('❌ Error checking slot availability:', error);
            return false;
        }
    }

    // Generate HTML for availability display with suggested slots from all hospitals
    function generateAvailabilityHTMLWithSlotsAllHospitals(allAvailableSlots, originalDate, originalTime) {
        let html = '<div class="availability-summary">';
        html += `<h4>🎯 Cross-Hospital Availability Summary</h4>`;
        html += `<p><strong>Original Request:</strong> ${originalDate} at ${originalTime}</p>`;
        
        if (allAvailableSlots.length > 0) {
            const bestSlot = allAvailableSlots[0];
            html += `<p><strong>✅ Best Available Slot:</strong> ${bestSlot.hospitalName} on ${bestSlot.date} at ${bestSlot.time}</p>`;
            html += `<p><strong>📅 Total Available Slots:</strong> ${allAvailableSlots.length} across all hospitals</p>`;
        }
        html += '</div>';
        
        html += '<div class="available-slots-list">';
        html += '<h4>🏥 Available Time Slots by Hospital (Next 7 Days)</h4>';
        
        // Group slots by hospital
        const slotsByHospital = {};
        allAvailableSlots.forEach(slot => {
            if (!slotsByHospital[slot.hospitalName]) {
                slotsByHospital[slot.hospitalName] = [];
            }
            slotsByHospital[slot.hospitalName].push(slot);
        });
        
        // Display slots grouped by hospital
        Object.keys(slotsByHospital).forEach(hospitalName => {
            const slots = slotsByHospital[hospitalName];
            const bestHospitalSlot = slots[0]; // First slot is the best for this hospital
            
            html += `<div class="hospital-group">`;
            html += `<h5>🏥 ${hospitalName}</h5>`;
            html += `<p><strong>Best Slot:</strong> ${bestHospitalSlot.date} at ${bestHospitalSlot.time}</p>`;
            html += `<p><strong>Total Slots:</strong> ${slots.length}</p>`;
            html += `<p><strong>Doctors:</strong> ${bestHospitalSlot.doctorCount} available</p>`;
            
            // Group slots by date for this hospital
            const slotsByDate = {};
            slots.forEach(slot => {
                if (!slotsByDate[slot.date]) {
                    slotsByDate[slot.date] = [];
                }
                slotsByDate[slot.date].push(slot);
            });
            
            Object.keys(slotsByDate).sort().forEach(date => {
                const dateSlots = slotsByDate[date];
                const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
                
                html += `<div class="date-group">`;
                html += `<h6>📅 ${dayName} (${date})</h6>`;
                html += `<div class="time-slots">`;
                
                dateSlots.forEach(slot => {
                    const isBest = slot.date === bestHospitalSlot.date && slot.time === bestHospitalSlot.time;
                    const slotClass = isBest ? 'nearest-slot' : 'available-slot';
                    html += `<span class="${slotClass}">${slot.time}</span>`;
                });
                
                html += `</div></div>`;
            });
            
            html += `</div>`;
        });
        
        html += '</div>';
        
        // Show summary of all hospitals checked
        html += '<div class="hospitals-summary">';
        html += '<h4>🔍 Hospitals Checked</h4>';
        html += '<p>The system searched all available hospitals for your specialty and found the best available slots.</p>';
        html += '</div>';
        
        return html;
    }

    // Generate HTML for availability display with suggested slots
    function generateAvailabilityHTMLWithSlots(doctors, nearestSlots, originalDate, originalTime) {
        let html = '<div class="availability-summary">';
        html += `<h4>🎯 Availability Summary</h4>`;
        html += `<p><strong>Original Request:</strong> ${originalDate} at ${originalTime}</p>`;
        
        if (nearestSlots.length > 0) {
            html += `<p><strong>✅ Nearest Available:</strong> ${nearestSlots[0].date} at ${nearestSlots[0].time}</p>`;
            html += `<p><strong>📅 Total Available Slots:</strong> ${nearestSlots.length}</p>`;
        }
        html += '</div>';
        
        html += '<div class="available-slots-list">';
        html += '<h4>📋 Available Time Slots (Next 7 Days)</h4>';
        
        // Group slots by date
        const slotsByDate = {};
        nearestSlots.forEach(slot => {
            if (!slotsByDate[slot.date]) {
                slotsByDate[slot.date] = [];
            }
            slotsByDate[slot.date].push(slot);
        });
        
        // Display slots grouped by date
        Object.keys(slotsByDate).sort().forEach(date => {
            const slots = slotsByDate[date];
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
            
            html += `<div class="date-group">`;
            html += `<h5>📅 ${dayName} (${date})</h5>`;
            html += `<div class="time-slots">`;
            
            slots.forEach(slot => {
                const isNearest = slot.date === nearestSlots[0].date && slot.time === nearestSlots[0].time;
                const slotClass = isNearest ? 'nearest-slot' : 'available-slot';
                html += `<span class="${slotClass}">${slot.time}</span>`;
            });
            
            html += `</div></div>`;
        });
        
        html += '</div>';
        
        // Show doctor availability
        html += '<div class="doctor-availability">';
        html += '<h4>👨‍⚕️ Doctor Availability</h4>';
        
        doctors.forEach(doctor => {
            html += `<div class="doctor-item">
                <div class="doctor-info">
                    <strong>${doctor.name}</strong> - ${doctor.qualification || 'MD'}
                </div>
                <div class="availability-times">`;
            
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            days.forEach(day => {
                if (doctor.availability && doctor.availability[day] && doctor.availability[day].length > 0) {
                    const times = doctor.availability[day].map(slot => 
                        `${slot.start}-${slot.end}`
                    ).join(', ');
                    html += `<div><strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong> ${times}</div>`;
                }
            });
            
            html += `</div></div>`;
        });
        
        html += '</div>';
        
        return html;
    }


    
    // Generate HTML for availability display
    function generateAvailabilityHTML(doctors) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let html = '';
        
        doctors.forEach(doctor => {
            html += `<div class="availability-item">
                <div>
                    <strong>${doctor.name}</strong> - ${doctor.qualification || 'MD'}
                </div>
                <div class="availability-times">`;
            
            days.forEach(day => {
                const dayLower = day.toLowerCase();
                if (doctor.availability && doctor.availability[dayLower] && doctor.availability[dayLower].length > 0) {
                    const times = doctor.availability[dayLower].map(slot => 
                        `${slot.start}-${slot.end}`
                    ).join(', ');
                    html += `<div><strong>${day}:</strong> ${times}</div>`;
                }
            });
            
            html += `</div></div>`;
        });
        
        return html;
    }

    async function scheduleAppointment(hospitalId, date, time, specialty, doctorId, type, notes) {
        try {
            const patientId = localStorage.getItem('patientId');
            if (!patientId) {
                throw new Error('Patient ID not found. Please log in again.');
            }

            // Get the actual doctor name from the selected option
            const doctorSelect = document.getElementById('schedule-doctor');
            const selectedOption = doctorSelect.options[doctorSelect.selectedIndex];
            
            if (!selectedOption || !selectedOption.value) {
                showMessage('Please select a doctor before scheduling the appointment.', 'error');
                return;
            }
            
            const doctorName = selectedOption.text.split(' - ')[0];
            
            // Get hospital name from the service summary
            const hospitalNameElement = document.getElementById('schedule-service-summary');
            let hospitalName = 'Unknown Hospital';
            
            if (hospitalNameElement) {
                const hospitalText = hospitalNameElement.textContent;
                const hospitalMatch = hospitalText.match(/Hospital:\s*([^\n]+)/);
                if (hospitalMatch) {
                    hospitalName = hospitalMatch[1].trim();
                }
            }
            
            console.log('📋 Appointment Data:', {
                patientId,
                hospitalId,
                doctorId,
                doctorName,
                specialty,
                date,
                time,
                type,
                hospitalName,
                notes
            });

            const response = await fetch('http://localhost:3001/api/patient/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientId,
                    hospitalId,
                    doctorId: doctorId, // Include doctor ID
                    doctorName: doctorName, // Use actual selected doctor name
                    specialty: specialty, // Use selected specialty
                    appointmentDate: date,
                    appointmentTime: time,
                    appointmentType: type,
                    status: 'pending',
                    notes,
                    hospitalName: hospitalName // Include hospital name
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to schedule appointment');
            }

            const result = await response.json();
            showMessage('Appointment scheduled successfully! We will confirm shortly.', 'success');
            
            // Close modal, reset form, and reload appointments
            closeModal('schedule-modal');
            document.getElementById('schedule-form').reset();
            loadAppointments();

        } catch (error) {
            console.error('Error scheduling appointment:', error);
            showMessage(`Error: ${error.message}`, 'error');
        }
    }

    async function cancelAppointment(appointmentId, reason) {
        try {
            const response = await fetch(`http://localhost:3001/api/patient/appointments/${appointmentId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reason
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel appointment');
            }

            const result = await response.json();
            showMessage('Appointment cancelled successfully!', 'success');
            
            // Close modal and reload appointments
            closeModal('cancel-modal');
            document.getElementById('cancel-form').reset();
            loadAppointments();

        } catch (error) {
            console.error('Error cancelling appointment:', error);
            showMessage(`Error: ${error.message}`, 'error');
        }
    }

    async function updateProfile(profileData) {
        try {
            // Show loading state
            const submitBtn = profileForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Updating...';
            submitBtn.disabled = true;

            // Get patient ID from localStorage
            const patientId = localStorage.getItem('patientId');
            if (!patientId) {
                throw new Error('Patient ID not found. Please log in again.');
            }

            // Prepare data for API
            const updateData = {
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                dateOfBirth: profileData.dateOfBirth,
                address: profileData.address,
                bloodType: profileData.bloodType,
                allergies: profileData.allergies || [],
                chronicConditions: profileData.chronicConditions || [],
                emergencyContact: profileData.emergencyContact
            };

            // Send API request to update profile
            const response = await fetch(`http://localhost:3001/api/patient/profile/${patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const result = await response.json();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            showMessage('Profile updated successfully in database!', 'success');
            
            // Update displayed name if it's the name field
            if (profileData.name) {
                patientNameElement.textContent = `Welcome, ${profileData.name}`;
                localStorage.setItem('userName', profileData.name);
            }

            // Update localStorage with new email if changed
            if (profileData.email) {
                localStorage.setItem('userEmail', profileData.email);
            }

            console.log('Profile updated successfully:', result);

        } catch (error) {
            console.error('Error updating profile:', error);
            
            // Reset button
            const submitBtn = profileForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update Profile';
            submitBtn.disabled = false;
            
            // Show error message
            showMessage(`Error updating profile: ${error.message}`, 'error');
        }
    }

    function searchMedicalServices(searchTerm) {
        // Simulate search functionality (replace with actual search)
        const resultCards = document.querySelectorAll('.result-card');
        
        resultCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchTerm.toLowerCase())) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0.5';
            }
        });

        showMessage(`Searching for: ${searchTerm}`, 'info');
    }

    function applyFilters() {
        const category = categoryFilter ? categoryFilter.value : '';
        const price = priceFilter ? priceFilter.value : '';
        const rating = ratingFilter ? ratingFilter.value : '';

        // Apply filters to results (simplified - replace with actual filtering logic)
        const resultCards = document.querySelectorAll('.result-card');
        
        resultCards.forEach(card => {
            let shouldShow = true;
            
            // Apply category filter
            if (category && !card.querySelector('.service-details h4').textContent.toLowerCase().includes(category.toLowerCase())) {
                shouldShow = false;
            }
            
            // Apply price filter (simplified)
            if (price && shouldShow) {
                const priceText = card.querySelector('.price').textContent;
                if (price === 'low' && !priceText.includes('$15,000')) shouldShow = false;
                if (price === 'medium' && !priceText.includes('$25,000')) shouldShow = false;
                if (price === 'high' && !priceText.includes('$35,000')) shouldShow = false;
            }
            
            // Apply rating filter (simplified)
            if (rating && shouldShow) {
                const ratingText = card.querySelector('.rating-text').textContent;
                const ratingValue = parseFloat(ratingText.split('/')[0]);
                const filterValue = parseInt(rating);
                if (ratingValue < filterValue) shouldShow = false;
            }
            
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    function showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success':
                messageDiv.style.backgroundColor = '#28a745';
                break;
            case 'error':
                messageDiv.style.backgroundColor = '#dc3545';
                break;
            case 'warning':
                messageDiv.style.backgroundColor = '#ffc107';
                messageDiv.style.color = '#333';
                break;
            default:
                messageDiv.style.backgroundColor = '#17a2b8';
        }
        
        // Add to page
        document.body.appendChild(messageDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }

    // Handle View Details button clicks
    document.addEventListener('click', function(event) {
        if (event.target.textContent === 'View Details') {
            const resultCard = event.target.closest('.result-card');
            const hospitalName = resultCard.querySelector('.hospital-info h3').textContent;
            
            console.log('Clicked View Details for hospital:', hospitalName);
            console.log('Available hospital mapping:', hospitalMapping);
            
            // Get the real hospital ID from our mapping
            const hospitalId = getHospitalIdByName(hospitalName);
            console.log('Found hospital ID:', hospitalId);
            
            if (hospitalId) {
                window.open(`hospital-details.html?id=${hospitalId}`, '_blank');
            } else {
                showMessage('Hospital details not available', 'warning');
            }
        }
    });

    // Store hospital mapping for View Details functionality
    let hospitalMapping = {};

    // Helper function to get hospital ID by name
    function getHospitalIdByName(hospitalName) {
        return hospitalMapping[hospitalName];
    }

    // Initialize dashboard
    function initDashboard() {
        // Set minimum date for donation form to today
        const donationDateInput = document.getElementById('donation-date');
        if (donationDateInput) {
            const today = new Date().toISOString().split('T')[0];
            donationDateInput.min = today;
        }

        // Load any saved profile data
        loadProfileData();
        
        // Load medical services from database
        loadMedicalServices();
        
        // Load blood donations
        loadBloodDonations();
    }

    async function loadProfileData() {
        try {
            // Load basic data from localStorage
            const savedName = localStorage.getItem('userName');
            const savedEmail = localStorage.getItem('userEmail');
            const patientId = localStorage.getItem('patientId');
            
            if (savedName && document.getElementById('profile-name')) {
                document.getElementById('profile-name').value = savedName;
            }
            if (savedEmail && document.getElementById('profile-email')) {
                document.getElementById('profile-email').value = savedEmail;
            }

            // If we have a patient ID, try to load complete profile from database
            if (patientId) {
                const response = await fetch(`http://localhost:3001/api/patient/profile/${patientId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.patient) {
                        const patient = data.patient;
                        
                        // Update form fields with database data
                        if (document.getElementById('profile-phone')) {
                            document.getElementById('profile-phone').value = patient.phone || '';
                        }
                        if (document.getElementById('profile-dob')) {
                            document.getElementById('profile-dob').value = patient.dateOfBirth || '';
                        }
                        if (document.getElementById('profile-address')) {
                            document.getElementById('profile-address').value = patient.address || '';
                        }
                        if (document.getElementById('profile-blood-type')) {
                            document.getElementById('profile-blood-type').value = patient.bloodType || '';
                        }
                        if (document.getElementById('profile-allergies')) {
                            document.getElementById('profile-allergies').value = Array.isArray(patient.allergies) ? patient.allergies.join(', ') : '';
                        }
                        if (document.getElementById('profile-chronic-conditions')) {
                            document.getElementById('profile-chronic-conditions').value = Array.isArray(patient.chronicConditions) ? patient.chronicConditions.join(', ') : '';
                        }
                        if (document.getElementById('profile-emergency-contact')) {
                            document.getElementById('profile-emergency-contact').value = patient.emergencyContact || '';
                        }

                        console.log('Profile data loaded from database:', patient);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading profile data:', error);
            // Continue with localStorage data if database load fails
        }
    }



    // Initialize the dashboard
    initDashboard();
});
