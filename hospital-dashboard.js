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

    // Set hospital name from localStorage if available
    const hospitalNameElement = document.getElementById('hospital-name');
    const storedName = localStorage.getItem('userName');
    if (storedName) {
        hospitalNameElement.textContent = `Welcome, ${storedName}`;
    }

    // Buying form handling
    const buyingForm = document.getElementById('buying-form');
    if (buyingForm) {
        buyingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const buyingData = {
                itemName: formData.get('itemName'),
                category: formData.get('category'),
                quantity: formData.get('quantity'),
                budget: formData.get('budget'),
                description: formData.get('description'),
                urgency: formData.get('urgency')
            };

            // Submit buying request
            submitBuyingRequest(buyingData);
        });
    }

    // Selling form handling
    const sellingForm = document.getElementById('selling-form');
    if (sellingForm) {
        sellingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const sellingData = {
                itemName: formData.get('itemName'),
                category: formData.get('category'),
                quantity: formData.get('quantity'),
                price: formData.get('price'),
                description: formData.get('description'),
                condition: formData.get('condition')
            };

            // Submit selling listing
            submitSellingListing(sellingData);
        });
    }

    // Load appointments when appointments tab is clicked
    const appointmentsTab = document.querySelector('[data-tab="appointments"]');
    if (appointmentsTab) {
        appointmentsTab.addEventListener('click', function() {
            console.log('🏥 Appointments tab clicked, loading appointments...');
            loadHospitalAppointments();
        });
    }

    // Load doctors when doctors tab is clicked
    const doctorsTab = document.querySelector('[data-tab="doctors"]');
    if (doctorsTab) {
        doctorsTab.addEventListener('click', function() {
            console.log('👨‍⚕️ Doctors tab clicked, loading doctors...');
            loadHospitalDoctors();
        });
    }

    // Doctor Management Functions - Defined early for immediate access
    window.openAddDoctorModal = function() {
        console.log('🔓 Opening add doctor modal...');
        console.log('🔍 Looking for modal element...');
        
        const modal = document.getElementById('add-doctor-modal');
        console.log('📋 Modal element found:', modal);
        
        if (modal) {
            console.log('✅ Modal found, setting display to block...');
            modal.style.display = 'block';
            console.log('🎯 Modal display style set to:', modal.style.display);
            
            // Reset form
            const form = document.getElementById('add-doctor-form');
            if (form) {
                form.reset();
                console.log('✅ Form reset successfully');
            } else {
                console.error('❌ Form element not found!');
            }
        } else {
            console.error('❌ Modal element not found!');
            console.log('🔍 Available elements with "modal" in ID:');
            document.querySelectorAll('[id*="modal"]').forEach(el => {
                console.log('  -', el.id);
            });
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Hospital profile form handling
    const hospitalProfileForm = document.getElementById('hospital-profile-form');
    if (hospitalProfileForm) {
        hospitalProfileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const profileData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                type: formData.get('type'),
                address: formData.get('address'),
                specialties: formData.get('specialties'),
                services: formData.get('services'),
                totalBeds: parseInt(formData.get('totalBeds')),
                staffCount: parseInt(formData.get('staffCount')),
                annualPatients: parseInt(formData.get('annualPatients')),
                accreditation: formData.get('accreditation'),
                emergencyServices: formData.get('emergencyServices') === 'on'
            };

            // Update hospital profile
            updateHospitalProfile(profileData);
            
            // Update displayed statistics immediately
            updateHospitalStatistics(profileData);
        });
    }

    // Search functionality for blood donors
    const donorSearchBtn = document.getElementById('donor-search-btn');
    if (donorSearchBtn) {
        donorSearchBtn.addEventListener('click', function() {
            const searchTerm = document.getElementById('donor-search').value.trim();
            if (searchTerm) {
                searchBloodDonors(searchTerm);
            }
        });
    }

    // Search functionality for companies
    const companySearchBtn = document.getElementById('company-search-btn');
    if (companySearchBtn) {
        companySearchBtn.addEventListener('click', function() {
            const searchTerm = document.getElementById('company-search').value.trim();
            if (searchTerm) {
                searchCompanies(searchTerm);
            }
        });
    }

    // Filter functionality for blood donors
    const bloodTypeFilter = document.getElementById('blood-type-filter');
    const locationFilter = document.getElementById('location-filter');
    const availabilityFilter = document.getElementById('availability-filter');

    if (bloodTypeFilter) {
        bloodTypeFilter.addEventListener('change', applyDonorFilters);
    }
    if (locationFilter) {
        locationFilter.addEventListener('change', applyDonorFilters);
    }
    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', applyDonorFilters);
    }

    // Filter functionality for companies
    const serviceTypeFilter = document.getElementById('service-type-filter');
    const companyLocationFilter = document.getElementById('company-location-filter');

    if (serviceTypeFilter) {
        serviceTypeFilter.addEventListener('change', applyCompanyFilters);
    }
    if (companyLocationFilter) {
        companyLocationFilter.addEventListener('change', applyCompanyFilters);
    }

    // Functions
    function submitBuyingRequest(buyingData) {
        // Show loading state
        const submitBtn = buyingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Posting...';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            showMessage('Buying request posted successfully! Suppliers will be notified.', 'success');
            
            // Reset form
            buyingForm.reset();
        }, 2000);
    }

    function submitSellingListing(sellingData) {
        // Show loading state
        const submitBtn = sellingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Posting...';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            showMessage('Selling listing posted successfully! Buyers will be notified.', 'success');
            
            // Reset form
            sellingForm.reset();
        }, 2000);
    }

    async function updateHospitalProfile(profileData) {
        try {
            // Show loading state
            const submitBtn = hospitalProfileForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Updating...';
            submitBtn.disabled = true;

            // Get hospital ID from localStorage
            const hospitalId = localStorage.getItem('hospitalId');
            if (!hospitalId) {
                throw new Error('Hospital ID not found. Please log in again.');
            }

            // Prepare data for API
            const updateData = {
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                type: profileData.type,
                address: profileData.address,
                specialties: profileData.specialties || [],
                services: profileData.services || [],
                totalBeds: parseInt(profileData.totalBeds) || 0,
                staffCount: parseInt(profileData.staffCount) || 0,
                annualPatients: parseInt(profileData.annualPatients) || 0,
                accreditation: profileData.accreditation,
                emergencyServices: profileData.emergencyServices || false
            };

            // Send API request to update profile
            const response = await fetch(`http://localhost:3001/api/hospital/profile/${hospitalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update hospital profile');
            }

            const result = await response.json();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            showMessage('Hospital profile updated successfully in database!', 'success');
            
            // Update displayed name if it's the name field
            if (profileData.name) {
                hospitalNameElement.textContent = `Welcome, ${profileData.name}`;
                localStorage.setItem('userName', profileData.name);
            }

            // Update localStorage with new email if changed
            if (profileData.email) {
                localStorage.setItem('userEmail', profileData.email);
            }

            console.log('Hospital profile updated successfully:', result);

            // Update displayed statistics immediately
            updateHospitalStatistics(updateData);

        } catch (error) {
            console.error('Error updating hospital profile:', error);
            
            // Reset button
            const submitBtn = hospitalProfileForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update Profile';
            submitBtn.disabled = false;
            
            // Show error message
            showMessage(`Error updating profile: ${error.message}`, 'error');
        }
    }

    // Update hospital statistics display function
    function updateHospitalStatistics(profileData) {
        // Update the statistics display with new values
        const totalBedsElement = document.getElementById('stats-total-beds');
        const staffCountElement = document.getElementById('stats-staff-count');
        const annualPatientsElement = document.getElementById('stats-annual-patients');
        const accreditationElement = document.getElementById('stats-accreditation');
        const emergencyServicesElement = document.getElementById('stats-emergency-services');

        if (totalBedsElement) totalBedsElement.textContent = profileData.totalBeds || '0';
        if (staffCountElement) staffCountElement.textContent = profileData.staffCount ? profileData.staffCount.toLocaleString() : '0';
        if (annualPatientsElement) annualPatientsElement.textContent = profileData.annualPatients ? profileData.annualPatients.toLocaleString() : '0';
        if (accreditationElement) accreditationElement.textContent = profileData.accreditation || 'Not specified';
        if (emergencyServicesElement) emergencyServicesElement.textContent = profileData.emergencyServices ? '24/7' : 'Not available';

        console.log('Hospital statistics updated:', profileData);
    }

    function searchBloodDonors(searchTerm) {
        // Simulate search functionality (replace with actual search)
        const donorRows = document.querySelectorAll('.donors-table tbody tr');
        
        donorRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(searchTerm.toLowerCase())) {
                row.style.display = 'table-row';
                row.style.opacity = '1';
            } else {
                row.style.opacity = '0.5';
            }
        });

        showMessage(`Searching donors for: ${searchTerm}`, 'info');
    }

    function searchCompanies(searchTerm) {
        // Simulate search functionality (replace with actual search)
        const companyCards = document.querySelectorAll('.company-card');
        
        companyCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchTerm.toLowerCase())) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0.5';
            }
        });

        showMessage(`Searching companies for: ${searchTerm}`, 'info');
    }

    function applyDonorFilters() {
        const bloodType = bloodTypeFilter ? bloodTypeFilter.value : '';
        const location = locationFilter ? locationFilter.value : '';
        const availability = availabilityFilter ? availabilityFilter.value : '';

        // Apply filters to donor table (simplified - replace with actual filtering logic)
        const donorRows = document.querySelectorAll('.donors-table tbody tr');
        
        donorRows.forEach(row => {
            let shouldShow = true;
            
            // Apply blood type filter
            if (bloodType && shouldShow) {
                const bloodTypeCell = row.querySelector('.blood-type');
                if (bloodTypeCell && !bloodTypeCell.textContent.includes(bloodType)) {
                    shouldShow = false;
                }
            }
            
            // Apply location filter
            if (location && shouldShow) {
                const locationCell = row.cells[4]; // Location column
                if (locationCell && !locationCell.textContent.toLowerCase().includes(location.toLowerCase())) {
                    shouldShow = false;
                }
            }
            
            // Apply availability filter
            if (availability && shouldShow) {
                const statusCell = row.querySelector('.status');
                if (statusCell && !statusCell.textContent.toLowerCase().includes(availability.toLowerCase())) {
                    shouldShow = false;
                }
            }
            
            row.style.display = shouldShow ? 'table-row' : 'none';
        });
    }

    function applyCompanyFilters() {
        const serviceType = serviceTypeFilter ? serviceTypeFilter.value : '';
        const location = companyLocationFilter ? companyLocationFilter.value : '';

        // Apply filters to company cards (simplified - replace with actual filtering logic)
        const companyCards = document.querySelectorAll('.company-card');
        
        companyCards.forEach(card => {
            let shouldShow = true;
            
            // Apply service type filter
            if (serviceType && shouldShow) {
                const serviceTypeElement = card.querySelector('.service-type');
                if (serviceTypeElement && !serviceTypeElement.textContent.toLowerCase().includes(serviceType.toLowerCase())) {
                    shouldShow = false;
                }
            }
            
            // Apply location filter
            if (location && shouldShow) {
                const locationElement = card.querySelector('.company-details p:first-child');
                if (locationElement && !locationElement.textContent.toLowerCase().includes(location.toLowerCase())) {
                    shouldShow = false;
                }
            }
            
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    // Contact donor functionality
    document.addEventListener('click', function(event) {
        if (event.target.textContent === 'Contact') {
            const row = event.target.closest('tr');
            const donorName = row.cells[0].textContent;
            const donorEmail = row.cells[5].textContent;
            
            showMessage(`Contacting ${donorName} at ${donorEmail}`, 'info');
            // You can implement actual contact functionality here
        }
    });

    // Company action buttons
    document.addEventListener('click', function(event) {
        if (event.target.textContent === 'Request Quote') {
            const companyCard = event.target.closest('.company-card');
            const companyName = companyCard.querySelector('h3').textContent;
            
            showMessage(`Quote request sent to ${companyName}`, 'success');
        }
        
        if (event.target.textContent === 'Contact Sales') {
            const companyCard = event.target.closest('.company-card');
            const companyName = companyCard.querySelector('h3').textContent;
            
            showMessage(`Sales team from ${companyName} will contact you soon`, 'info');
        }
    });

    // Inventory management actions
    document.addEventListener('click', function(event) {
        if (event.target.textContent === 'Reorder') {
            const row = event.target.closest('tr');
            const itemName = row.cells[0].textContent;
            const itemCategory = row.cells[1].textContent;
            const currentQuantity = row.cells[2].textContent;
            
            openReorderModal(itemName, itemCategory, currentQuantity);
        }
        
        if (event.target.textContent === 'Edit') {
            const row = event.target.closest('tr');
            const itemName = row.cells[0].textContent;
            const itemCategory = row.cells[1].textContent;
            const currentPrice = row.cells[3].textContent;
            
            openEditPriceModal(itemName, itemCategory, currentPrice);
        }
    });

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

    // Initialize dashboard
    function initDashboard() {
        console.log('🔄 initDashboard() called - Starting dashboard initialization...');
        
        try {
            // Load any saved profile data
            console.log('📋 Loading profile data...');
            loadProfileData();
            
            // Initialize inventory summary (you can load from API)
            console.log('📊 Initializing inventory summary...');
            updateInventorySummary();
            
            // Initialize modal event handlers
            console.log('🔧 Initializing modal handlers...');
            initializeModalHandlers();
            
            // Load blood donors from database
            console.log('🩸 Loading blood donors from database...');
            loadBloodDonors();
            
            // Load company aid providers from database
            console.log('🏢 Loading company aid providers from database...');
            loadCompanyAidProviders();
            
            console.log('✅ Dashboard initialization completed successfully!');
        } catch (error) {
            console.error('❌ Error during dashboard initialization:', error);
        }
    }

    // Load blood donors from database
    async function loadBloodDonors() {
        try {
            console.log('Loading blood donors from database...');
            const response = await fetch('http://localhost:3001/api/hospital/blood-donations');
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                
                if (data.success) {
                    console.log(`Found ${data.donations.length} blood donations`);
                    displayBloodDonors(data.donations);
                } else {
                    console.error('API returned success: false:', data.message);
                    showMessage(`Error: ${data.message}`, 'error');
                }
            } else {
                console.error('Response not ok:', response.status, response.statusText);
                showMessage(`HTTP Error: ${response.status}`, 'error');
            }
        } catch (error) {
            console.error('Error loading blood donors:', error);
            showMessage('Error loading blood donors from database', 'error');
        }
    }

    // Display blood donors in the table
    function displayBloodDonors(donations) {
        console.log('Displaying blood donors:', donations);
        
        // Store donations globally for access by other functions
        window.currentBloodDonations = donations;
        
        const tbody = document.getElementById('blood-donors-tbody');
        console.log('Found tbody element:', tbody);
        
        if (!tbody) {
            console.error('Blood donors tbody element not found!');
            return;
        }

        if (donations.length === 0) {
            console.log('No donations to display');
            tbody.innerHTML = '<tr><td colspan="10" class="no-data">No blood donors found in database</td></tr>';
            return;
        }

        console.log(`Creating HTML for ${donations.length} donations`);
        const donorsHTML = donations.map(donation => `
            <tr>
                <td>${donation.donorName}</td>
                <td><span class="blood-type ${getBloodTypeClass(donation.bloodType)}">${donation.bloodType}</span></td>
                <td>${donation.age}</td>
                <td>${donation.weight}</td>
                <td>${donation.hemoglobin}</td>
                <td>${new Date(donation.donationDate).toLocaleDateString()}</td>
                <td>${donation.donationCenter || 'Not specified'}</td>
                <td>${donation.donorEmail}</td>
                <td><span class="status ${getStatusClass(donation.status)}">${donation.status}</span></td>
                <td>
                    <button class="btn-small btn-primary" onclick="contactDonor('${donation.donorEmail}', '${donation.donorPhone}')">Contact</button>
                </td>
            </tr>
        `).join('');

        console.log('Setting tbody HTML');
        tbody.innerHTML = donorsHTML;
        console.log('Blood donors displayed successfully');
    }

    // Get CSS class for blood type styling
    function getBloodTypeClass(bloodType) {
        const typeMap = {
            'A+': 'a-positive',
            'A-': 'a-negative',
            'B+': 'b-positive',
            'B-': 'b-negative',
            'AB+': 'ab-positive',
            'AB-': 'ab-negative',
            'O+': 'o-positive',
            'O-': 'o-negative'
        };
        return typeMap[bloodType] || 'default';
    }

    // Get CSS class for status styling
    function getStatusClass(status) {
        const statusMap = {
            'pending': 'pending',
            'rejected': 'rejected',
            'completed': 'completed'
        };
        return statusMap[status] || 'approved';
    }

    // Contact donor function
    function contactDonor(email, phone) {
        const contactInfo = phone ? `${email} / ${phone}` : email;
        showMessage(`Contacting donor at: ${contactInfo}`, 'info');
        
        // Simulate contact action
        console.log('📞 Contacting donor:', { email, phone });
        
        // You can implement actual contact functionality here
        // For example, opening email client or phone dialer
        if (email) {
            window.open(`mailto:${email}?subject=Blood Donation Inquiry`, '_blank');
        }
    }

    // Update donor status function
    function updateDonorStatus(donationId, currentStatus) {
        console.log('🔄 Updating donor status:', { donationId, currentStatus });
        
        // Show status update options
        const newStatus = prompt(`Current status: ${currentStatus}\n\nEnter new status (pending/approved/rejected/completed):`);
        
        if (newStatus && ['pending', 'approved', 'rejected', 'completed'].includes(newStatus.toLowerCase())) {
            // Here you would typically make an API call to update the status
            console.log(`✅ Status updated from ${currentStatus} to ${newStatus}`);
            showMessage(`Donor status updated to: ${newStatus}`, 'success');
            
            // Refresh the blood donors data to show updated status
            setTimeout(() => {
                loadBloodDonors();
            }, 1000);
        } else if (newStatus !== null) {
            showMessage('Invalid status. Please use: pending, approved, rejected, or completed', 'error');
        }
    }



    // Refresh blood donors data (can be called periodically or manually)
    function refreshBloodDonors() {
        loadBloodDonors();
    }

    // Auto-refresh blood donors every 30 seconds to catch new submissions
    setInterval(refreshBloodDonors, 30000);

    // Load company aid providers from database
    async function loadCompanyAidProviders() {
        try {
            console.log('🏢 Loading company aid providers from database...');
            const response = await fetch('http://localhost:3001/api/hospital/company-aid');
            console.log('Company aid response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Company aid response data:', data);
                
                if (data.success) {
                    console.log(`Found ${data.companies.length} company aid providers`);
                    displayCompanyAidProviders(data.companies);
                } else {
                    console.error('Company aid API returned success: false:', data.message);
                    showMessage(`Error: ${data.message}`, 'error');
                }
            } else {
                console.error('Company aid response not ok:', response.status, response.statusText);
                showMessage(`HTTP Error: ${response.status}`, 'error');
            }
        } catch (error) {
            console.error('Error loading company aid providers:', error);
            showMessage('Error loading company aid providers from database', 'error');
        }
    }

    // Display company aid providers in the grid
    function displayCompanyAidProviders(companies) {
        console.log('Displaying company aid providers:', companies);
        
        // Store companies globally for access by other functions
        window.currentCompanyAidProviders = companies;
        
        const companiesGrid = document.getElementById('companies-grid');
        console.log('Found companies grid element:', companiesGrid);
        
        if (!companiesGrid) {
            console.error('Companies grid element not found!');
            return;
        }

        if (companies.length === 0) {
            console.log('No companies to display');
            companiesGrid.innerHTML = '<div class="no-data">No company aid providers found in database</div>';
            return;
        }

        console.log(`Creating HTML for ${companies.length} companies`);
        const companiesHTML = companies.map(company => `
            <div class="company-card" data-company-id="${company._id}">
                <div class="company-header">
                    <h3>${company.name}</h3>
                    <span class="service-type ${company.serviceType}">${getServiceTypeDisplayName(company.serviceType)}</span>
                </div>
                <div class="company-details">
                    <p><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${company.location}</p>
                    <p><i class="fas fa-users"></i> <strong>Team Size:</strong> ${company.teamSize}</p>
                    <p><i class="fas fa-star"></i> <strong>Rating:</strong> ${company.rating}/5</p>
                    <p><i class="fas fa-clock"></i> <strong>Response Time:</strong> ${company.responseTime}</p>
                </div>
                <div class="company-services">
                    <h4>Services Offered:</h4>
                    <ul>
                        ${company.services.map(service => `<li>${service}</li>`).join('')}
                    </ul>
                </div>
                <div class="company-actions">
                    <button class="btn-primary" onclick="requestQuote('${company._id}', '${company.name}')">Request Quote</button>
                    <button class="btn-outline" onclick="contactCompanySales('${company._id}', '${company.name}')">Contact Sales</button>
                </div>
            </div>
        `).join('');

        console.log('Setting companies grid HTML');
        companiesGrid.innerHTML = companiesHTML;
        console.log('Company aid providers displayed successfully');
    }

    // Get display name for service type
    function getServiceTypeDisplayName(serviceType) {
        const serviceTypeMap = {
            'billing': 'Medical Billing',
            'coding': 'Medical Coding',
            'transcription': 'Medical Transcription',
            'claims': 'Claims Processing',
            'customer-service': 'Customer Service'
        };
        return serviceTypeMap[serviceType] || serviceType;
    }



    // Request quote function
    function requestQuote(companyId, companyName) {
        showMessage(`Quote request sent to ${companyName}. They will contact you within 24 hours.`, 'success');
        console.log('💰 Quote requested from company:', { companyId, companyName });
    }

    // Contact company sales function
    function contactCompanySales(companyId, companyName) {
        const company = window.currentCompanyAidProviders?.find(c => c._id === companyId);
        if (company && company.contactInfo?.phone) {
            showMessage(`Contacting ${companyName} at: ${company.contactInfo.phone}`, 'info');
            // You can implement actual phone dialing here
            if (company.contactInfo.phone) {
                window.open(`tel:${company.contactInfo.phone}`, '_blank');
            }
        } else if (company && company.contactInfo?.email) {
            showMessage(`Contacting ${companyName} at: ${company.contactInfo.email}`, 'info');
            // You can implement actual email opening here
            if (company.contactInfo.email) {
                window.open(`mailto:${company.contactInfo.email}?subject=Inquiry about ${company.serviceType} services`, '_blank');
            }
        } else {
            showMessage(`No contact information available for ${companyName}. Please use the View Profile option for more details.`, 'warning');
        }
        console.log('📞 Contacting company sales:', { companyId, companyName });
    }



    // Make functions globally accessible for testing
    window.testBloodDonors = function() {
        console.log('🧪 Manual test of blood donors loading...');
        loadBloodDonors();
    };

    window.debugBloodDonors = function() {
        console.log('🔍 Debugging blood donors system...');
        console.log('loadBloodDonors function:', typeof loadBloodDonors);
        console.log('displayBloodDonors function:', typeof displayBloodDonors);
        console.log('Current tbody element:', document.getElementById('blood-donors-tbody'));
    };

    // Test donor modal functionality
    window.testDonorModal = function() {
        console.log('🔍 Testing donor modal functionality...');
        
        // Check if modal elements exist
        const modal = document.getElementById('donor-details-modal');
        const contentDiv = document.getElementById('donor-details-content');
        
        console.log('Modal element:', modal);
        console.log('Content div element:', contentDiv);
        
        if (!modal || !contentDiv) {
            console.error('❌ Modal elements not found!');
            alert('Modal elements not found! Check the console for details.');
            return;
        }
        
        // Test opening the modal with sample data
        const sampleDonation = {
            _id: 'test-123',
            donorName: 'Test Donor',
            donorEmail: 'test@example.com',
            donorPhone: '+1 (555) 123-4567',
            donorAddress: '123 Test Street',
            age: 25,
            weight: 70,
            hemoglobin: 14.0,
            bloodType: 'O+',
            donationDate: '2025-09-15T00:00:00.000Z',
            donationCenter: 'Test Center',
            status: 'pending',
            additionalNotes: 'Test donation',
            healthStatus: {
                goodHealth: true,
                noInfections: true,
                noMedications: true,
                noRecentSurgery: true
            }
        };
        
        // Store sample data globally
        window.currentBloodDonations = [sampleDonation];
        
        // Test the modal
        viewDonorDetails('test-123');
        
        console.log('✅ Modal test completed');
    };



    async function loadProfileData() {
        try {
            // Load basic data from localStorage
            const savedName = localStorage.getItem('userName');
            const savedEmail = localStorage.getItem('userEmail');
            const hospitalId = localStorage.getItem('hospitalId');
            
            if (savedName && document.getElementById('hospital-profile-name')) {
                document.getElementById('hospital-profile-name').value = savedName;
            }
            if (savedEmail && document.getElementById('hospital-profile-email')) {
                document.getElementById('hospital-profile-email').value = savedEmail;
            }

            // If we have a hospital ID, try to load complete profile from database
            if (hospitalId) {
                const response = await fetch(`http://localhost:3001/api/hospital/profile/${hospitalId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.hospital) {
                        const hospital = data.hospital;
                        
                        // Update form fields with database data
                        if (document.getElementById('hospital-profile-phone')) {
                            document.getElementById('hospital-profile-phone').value = hospital.phone || '';
                        }
                        if (document.getElementById('hospital-profile-type')) {
                            document.getElementById('hospital-profile-type').value = hospital.type || 'general';
                        }
                        if (document.getElementById('hospital-profile-address')) {
                            document.getElementById('hospital-profile-address').value = hospital.address || '';
                        }
                        if (document.getElementById('hospital-profile-specialties')) {
                            document.getElementById('hospital-profile-specialties').value = Array.isArray(hospital.specialties) ? hospital.specialties.join(', ') : '';
                        }
                        if (document.getElementById('hospital-profile-services')) {
                            document.getElementById('hospital-profile-services').value = Array.isArray(hospital.services) ? hospital.services.join(', ') : '';
                        }
                        if (document.getElementById('hospital-profile-total-beds')) {
                            document.getElementById('hospital-profile-total-beds').value = hospital.totalBeds || '';
                        }
                        if (document.getElementById('hospital-profile-staff-count')) {
                            document.getElementById('hospital-profile-staff-count').value = hospital.staffCount || '';
                        }
                        if (document.getElementById('hospital-profile-annual-patients')) {
                            document.getElementById('hospital-profile-annual-patients').value = hospital.annualPatients || '';
                        }
                        if (document.getElementById('hospital-profile-accreditation')) {
                            document.getElementById('hospital-profile-accreditation').value = hospital.accreditation || '';
                        }
                        if (document.getElementById('hospital-profile-emergency-services')) {
                            document.getElementById('hospital-profile-emergency-services').checked = hospital.emergencyServices || false;
                        }

                        // Update the statistics display with loaded data
                        updateHospitalStatistics(hospital);

                        console.log('Hospital profile data loaded from database:', hospital);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading hospital profile data:', error);
            // Continue with localStorage data if database load fails
        }
    }

    function updateInventorySummary() {
        // This function can be used to update inventory summary from API
        // For now, it's just a placeholder
        console.log('Inventory summary updated');
    }

    // Initialize the dashboard
    initDashboard();
});

// Modal functions for inventory management
function openEditPriceModal(itemName, itemCategory, currentPrice) {
    // Set modal data
    document.getElementById('edit-item-name').value = itemName;
    document.getElementById('edit-item-category').value = itemCategory;
    document.getElementById('edit-current-price').value = currentPrice;
    document.getElementById('edit-new-price').value = '';
    document.getElementById('edit-price-reason').value = '';
    
    // Show modal
    document.getElementById('edit-price-modal').style.display = 'block';
}

function openReorderModal(itemName, itemCategory, currentQuantity) {
    console.log('openReorderModal called with:', itemName, itemCategory, currentQuantity);
    
    // Set item info
    const itemInfo = document.getElementById('reorder-item-info');
    console.log('Item info element:', itemInfo);
    
    if (itemInfo) {
        itemInfo.innerHTML = `
            <div class="item-details">
                <h4>${itemName}</h4>
                <p><strong>Category:</strong> ${itemCategory}</p>
                <p><strong>Current Stock:</strong> ${currentQuantity}</p>
            </div>
        `;
        console.log('Item info updated');
    } else {
        console.error('Item info element not found!');
    }
    
    // Load dealers data
    loadDealersData(itemName, itemCategory);
    
    // Show modal
    const modal = document.getElementById('reorder-modal');
    if (modal) {
        modal.style.display = 'block';
        console.log('Modal displayed');
    } else {
        console.error('Reorder modal not found!');
    }
}

function loadDealersData(itemName, itemCategory) {
    // Simulate dealer data - in a real app, this would come from an API
    const dealers = [
        {
            name: "MedSupply Pro",
            price: "$0.45",
            deliveryStatus: "2-3 business days",
            quantityAvailable: "1000+",
            rating: 4.8,
            contact: "+1 (555) 123-4567"
        },
        {
            name: "Healthcare Solutions Inc.",
            price: "$0.52",
            deliveryStatus: "1-2 business days",
            quantityAvailable: "500+",
            rating: 4.6,
            contact: "+1 (555) 234-5678"
        },
        {
            name: "Medical Equipment Plus",
            price: "$0.48",
            deliveryStatus: "3-5 business days",
            quantityAvailable: "2000+",
            rating: 4.9,
            contact: "+1 (555) 345-6789"
        },
        {
            name: "Quality Medical Supplies",
            price: "$0.55",
            deliveryStatus: "Same day delivery",
            quantityAvailable: "300+",
            rating: 4.7,
            contact: "+1 (555) 456-7890"
        }
    ];
    
    displayDealers(dealers);
}

function displayDealers(dealers) {
    console.log('displayDealers called with:', dealers);
    
    const dealersContainer = document.getElementById('dealers-container');
    console.log('Dealers container:', dealersContainer);
    
    if (!dealersContainer) {
        console.error('Dealers container not found!');
        return;
    }
    
    dealersContainer.innerHTML = '';
    
    dealers.forEach((dealer, index) => {
        console.log(`Creating dealer card ${index}:`, dealer.name);
        
        const dealerCard = document.createElement('div');
        dealerCard.className = 'dealer-card';
        dealerCard.innerHTML = `
            <div class="dealer-header">
                <h4>${dealer.name}</h4>
                <div class="dealer-rating">
                    <span class="stars">${'★'.repeat(Math.floor(dealer.rating))}${'☆'.repeat(5-Math.floor(dealer.rating))}</span>
                    <span>${dealer.rating}/5</span>
                </div>
            </div>
            <div class="dealer-details">
                <div class="detail-row">
                    <span class="label">Price:</span>
                    <span class="value price">${dealer.price}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Delivery:</span>
                    <span class="value">${dealer.deliveryStatus}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Available:</span>
                    <span class="value">${dealer.quantityAvailable}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Contact:</span>
                    <span class="value">${dealer.contact}</span>
                </div>
            </div>

        `;
        

        
        dealersContainer.appendChild(dealerCard);
        console.log(`Dealer card ${index} created and added`);
    });
    
    console.log('Total dealer cards created:', dealersContainer.children.length);
}





function initializeModalHandlers() {
    // Edit price form handler
    const editPriceForm = document.getElementById('edit-price-form');
    if (editPriceForm) {
        editPriceForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const itemName = document.getElementById('edit-item-name').value;
            const newPrice = document.getElementById('edit-new-price').value;
            const reason = document.getElementById('edit-price-reason').value;
            
            if (!newPrice || newPrice <= 0) {
                showMessage('Please enter a valid price', 'error');
                return;
            }
            
            updateItemPrice(itemName, newPrice, reason);
        });
    }
    
    // Modal close button handlers
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
}

function updateItemPrice(itemName, newPrice, reason) {
    console.log('Updating price for:', itemName, 'New price:', newPrice, 'Reason:', reason);
    
    // Find the row in the inventory table and update the price
    const tableRows = document.querySelectorAll('.inventory-table tbody tr');
    let found = false;
    
    tableRows.forEach(row => {
        if (row.cells[0].textContent === itemName) {
            found = true;
            const currentPriceCell = row.cells[3];
            const totalValueCell = row.cells[4];
            const quantity = parseInt(row.cells[2].textContent);
            
            console.log('Found row, updating price from', currentPriceCell.textContent, 'to', newPrice);
            
            // Update price
            currentPriceCell.textContent = `$${parseFloat(newPrice).toFixed(2)}`;
            
            // Update total value
            const newTotalValue = (parseFloat(newPrice) * quantity).toFixed(2);
            totalValueCell.textContent = `$${newTotalValue}`;
            
            console.log('Updated total value to:', newTotalValue);
        }
    });
    
    if (!found) {
        console.error('Item not found in table:', itemName);
        showMessage(`Error: Could not find item "${itemName}" in inventory table`, 'error');
        return;
    }
    
    // Close modal
    document.getElementById('edit-price-modal').style.display = 'none';
    
    // Show success message
    showMessage(`Price updated successfully for ${itemName}!`, 'success');
    
    // Log the change (in a real app, this would go to a database)
    console.log(`Price updated for ${itemName}: $${newPrice}, Reason: ${reason}`);
}

// ========================================
// APPOINTMENT MANAGEMENT FUNCTIONS
// ========================================

// Load hospital appointments from database
    async function loadHospitalAppointments() {
        try {
            const hospitalId = localStorage.getItem('hospitalId');
            console.log('🔍 Retrieved hospital ID from localStorage:', hospitalId);
            
            if (!hospitalId) {
                console.error('❌ No hospital ID found in localStorage');
                showMessage('Hospital ID not found. Please log in again.', 'error');
                return;
            }

            console.log('🏥 Loading appointments for hospital:', hospitalId);
            
            const response = await fetch(`http://localhost:3001/api/hospital/${hospitalId}/appointments`);
            console.log('📡 API Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error Response:', errorText);
                throw new Error('Failed to load appointments');
            }

            const data = await response.json();
            console.log('📊 Appointments loaded:', data);

        if (data.success) {
            console.log('📊 Appointments data received:', data.appointments);
            displayAppointments(data.appointments);
            updateAppointmentSummary(data.appointments);
        } else {
            showMessage('Failed to load appointments', 'error');
        }
    } catch (error) {
        console.error('❌ Error loading appointments:', error);
        showMessage('Error loading appointments', 'error');
    }
}

// Display appointments in the table
function displayAppointments(appointments) {
    const tbody = document.getElementById('appointments-tbody');
    if (!tbody) {
        console.error('Appointments table body not found');
        return;
    }

    tbody.innerHTML = '';

    if (appointments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="no-appointments">
                    <div class="no-data-message">
                        <i class="fas fa-calendar-times"></i>
                        <p>No appointments found</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.className = `appointment-row status-${appointment.status}`;
        
        row.innerHTML = `
            <td>${appointment.patientName || 'N/A'}</td>
            <td>${appointment.patientEmail || 'N/A'}</td>
            <td>${appointment.patientPhone || 'N/A'}</td>
            <td>${appointment.specialty || 'N/A'}</td>
            <td>${formatDate(appointment.appointmentDate)}</td>
            <td>${appointment.appointmentTime || 'N/A'}</td>
            <td>${appointment.notes || 'No notes'}</td>
            <td>
                <span class="status-badge status-${appointment.status}">
                    ${getStatusDisplay(appointment.status)}
                </span>
            </td>
            <td class="actions-cell">
                ${getActionButtons(appointment)}
            </td>
        `;
        
        tbody.appendChild(row);
    });

    console.log(`✅ Displayed ${appointments.length} appointments`);
}

// Get status display text
function getStatusDisplay(status) {
    const statusMap = {
        'pending': '⏳ Pending',
        'approved': '✅ Approved',
        'rejected': '❌ Rejected',
        'cancelled': '🚫 Cancelled',
        'completed': '✅ Completed'
    };
    return statusMap[status] || status;
}

// Get action buttons based on appointment status
function getActionButtons(appointment) {
    if (appointment.status === 'pending') {
        return `
            <button class="btn-approve" onclick="approveAppointment('${appointment._id}')" title="Approve Appointment">
                <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn-reject" onclick="rejectAppointment('${appointment._id}')" title="Reject Appointment">
                <i class="fas fa-times"></i> Reject
            </button>
        `;
    } else if (appointment.status === 'approved') {
        return `
            <button class="btn-complete" onclick="completeAppointment('${appointment._id}')" title="Mark as Completed">
                <i class="fas fa-check-double"></i> Complete
            </button>
        `;
    } else {
        return `
            <span class="no-actions">No actions available</span>
        `;
    }
}

// Approve appointment
async function approveAppointment(appointmentId) {
    try {
        console.log('✅ Approving appointment:', appointmentId);
        
        const response = await fetch(`http://localhost:3001/api/hospital/appointments/${appointmentId}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'approved',
                approvedAt: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Failed to approve appointment');
        }

        const data = await response.json();
        if (data.success) {
            showMessage('Appointment approved successfully!', 'success');
            loadHospitalAppointments(); // Reload the table
        } else {
            showMessage('Failed to approve appointment', 'error');
        }
    } catch (error) {
        console.error('❌ Error approving appointment:', error);
        showMessage('Error approving appointment', 'error');
    }
}

// Reject appointment
async function rejectAppointment(appointmentId) {
    try {
        console.log('❌ Rejecting appointment:', appointmentId);
        
        const response = await fetch(`http://localhost:3001/api/hospital/appointments/${appointmentId}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'rejected',
                rejectedAt: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Failed to reject appointment');
        }

        const data = await response.json();
        if (data.success) {
            showMessage('Appointment rejected successfully!', 'success');
            loadHospitalAppointments(); // Reload the table
        } else {
            showMessage('Failed to reject appointment', 'error');
        }
    } catch (error) {
        console.error('❌ Error rejecting appointment:', error);
        showMessage('Error rejecting appointment', 'error');
    }
}

// Complete appointment
async function completeAppointment(appointmentId) {
    try {
        console.log('✅ Completing appointment:', appointmentId);
        
        const response = await fetch(`http://localhost:3001/api/hospital/appointments/${appointmentId}/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'completed',
                completedAt: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Failed to complete appointment');
        }

        const data = await response.json();
        if (data.success) {
            showMessage('Appointment marked as completed!', 'success');
            loadHospitalAppointments(); // Reload the table
        } else {
            showMessage('Failed to complete appointment', 'error');
        }
    } catch (error) {
        console.error('❌ Error completing appointment:', error);
        showMessage('Error completing appointment', 'error');
    }
}

// Update appointment summary statistics
function updateAppointmentSummary(appointments) {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const approved = appointments.filter(a => a.status === 'approved').length;
    const rejected = appointments.filter(a => a.status === 'rejected').length;

    document.getElementById('total-appointments').textContent = total;
    document.getElementById('pending-appointments').textContent = pending;
    document.getElementById('approved-appointments').textContent = approved;
    document.getElementById('rejected-appointments').textContent = rejected;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ========================================
// DOCTOR MANAGEMENT FUNCTIONS
// ========================================

// Load hospital doctors
async function loadHospitalDoctors() {
    try {
        const hospitalId = localStorage.getItem('hospitalId');
        console.log('🔍 Loading doctors for hospital:', hospitalId);
        
        if (!hospitalId) {
            console.error('❌ No hospital ID found in localStorage');
            showMessage('Hospital ID not found. Please log in again.', 'error');
            return;
        }

        const response = await fetch(`http://localhost:3001/api/hospital/${hospitalId}/doctors`);
        console.log('📡 API Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            throw new Error('Failed to load doctors');
        }

        const data = await response.json();
        console.log('📊 Doctors loaded:', data);
        
        if (data.success) {
            displayDoctors(data.doctors);
        } else {
            throw new Error(data.message || 'Failed to load doctors');
        }
    } catch (error) {
        console.error('❌ Error loading doctors:', error);
        showMessage('Failed to load doctors. Please try again.', 'error');
        document.getElementById('doctors-container').innerHTML = 
            '<div class="error-message">Failed to load doctors. Please try again.</div>';
    }
}

// Display doctors in the container
function displayDoctors(doctors) {
    const container = document.getElementById('doctors-container');
    
    if (!doctors || doctors.length === 0) {
        container.innerHTML = '<div class="no-doctors">No doctors found. Add your first doctor using the "Add New Doctor" button above.</div>';
        return;
    }

    container.innerHTML = doctors.map(doctor => `
        <div class="doctor-card" data-doctor-id="${doctor._id}">
            <div class="doctor-header">
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <span class="doctor-specialty">${doctor.specialty}</span>
                </div>
            </div>
            <div class="doctor-details">
                <p><i class="fas fa-envelope"></i> ${doctor.email}</p>
                <p><i class="fas fa-phone"></i> ${doctor.phone}</p>
                <p><i class="fas fa-graduation-cap"></i> ${doctor.qualification}</p>
                ${doctor.department ? `<p><i class="fas fa-building"></i> ${doctor.department}</p>` : ''}
                ${doctor.notes ? `<p><i class="fas fa-sticky-note"></i> ${doctor.notes}</p>` : ''}
            </div>

            <div class="doctor-actions">
                <button class="btn-edit" onclick="editDoctor('${doctor._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteDoctor('${doctor._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}



// Open add doctor modal
function openAddDoctorModal() {
    console.log('🔓 Opening add doctor modal...');
    console.log('🔍 Looking for modal element...');
    
    const modal = document.getElementById('add-doctor-modal');
    console.log('📋 Modal element found:', modal);
    
    if (modal) {
        console.log('✅ Modal found, setting display to block...');
        modal.style.display = 'block';
        console.log('🎯 Modal display style set to:', modal.style.display);
        
        // Reset form
        const form = document.getElementById('add-doctor-form');
        if (form) {
            form.reset();
            console.log('✅ Form reset successfully');
        } else {
            console.error('❌ Form element not found!');
        }
    } else {
        console.error('❌ Modal element not found!');
        console.log('🔍 Available elements with "modal" in ID:');
        document.querySelectorAll('[id*="modal"]').forEach(el => {
            console.log('  -', el.id);
        });
    }
}

// Close modal function (if not already defined)
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Add doctor form submission
document.addEventListener('DOMContentLoaded', function() {
    const addDoctorForm = document.getElementById('add-doctor-form');
    if (addDoctorForm) {
        addDoctorForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            await submitAddDoctor();
        });
    }
});

// Test function for debugging
function testAddDoctorButton() {
    console.log('🧪 Test button clicked!');
    console.log('🔍 Testing if openAddDoctorModal function exists:', typeof openAddDoctorModal);
    console.log('🔍 Testing if modal element exists:', document.getElementById('add-doctor-modal'));
    
    if (typeof openAddDoctorModal === 'function') {
        console.log('✅ Function exists, calling it...');
        openAddDoctorModal();
    } else {
        console.error('❌ Function does not exist!');
    }
}

// Submit add doctor
async function submitAddDoctor() {
    try {
        console.log('📝 Submitting add doctor form...');
        
        const form = document.getElementById('add-doctor-form');
        const formData = new FormData(form);
        


        const doctorData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            specialty: formData.get('specialty'),
            qualification: formData.get('qualification'),
            department: formData.get('department'),
            notes: formData.get('notes'),
            hospitalId: localStorage.getItem('hospitalId')
        };

        console.log('📋 Doctor data to submit:', doctorData);

        const response = await fetch('http://localhost:3001/api/hospital/doctors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doctorData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            throw new Error('Failed to add doctor');
        }

        const data = await response.json();
        
        if (data.success) {
            showMessage('Doctor added successfully!', 'success');
            closeModal('add-doctor-modal');
            form.reset();
            loadHospitalDoctors(); // Reload doctors list
        } else {
            throw new Error(data.message || 'Failed to add doctor');
        }
    } catch (error) {
        console.error('❌ Error adding doctor:', error);
        showMessage(`Error adding doctor: ${error.message}`, 'error');
    }
}

// Edit doctor (placeholder for future implementation)
function editDoctor(doctorId) {
    console.log('✏️ Edit doctor:', doctorId);
    showMessage('Edit functionality coming soon!', 'info');
}

// Delete doctor
async function deleteDoctor(doctorId) {
    try {
        console.log('🗑️ Deleting doctor:', doctorId);
        
        if (!confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
            return;
        }

        const response = await fetch(`http://localhost:3001/api/hospital/doctors/${doctorId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete doctor');
        }

        const data = await response.json();
        
        if (data.success) {
            showMessage('Doctor deleted successfully!', 'success');
            loadHospitalDoctors(); // Reload doctors list
        } else {
            throw new Error(data.message || 'Failed to delete doctor');
        }
    } catch (error) {
        console.error('❌ Error deleting doctor:', error);
        showMessage(`Error deleting doctor: ${error.message}`, 'error');
    }
}
