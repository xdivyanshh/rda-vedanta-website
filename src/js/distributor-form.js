document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('distributorForm');
    
    // Custom Select Elements
    const stateWrapper = document.getElementById('stateSelectWrapper');
    const stateTrigger = document.getElementById('stateSelectTrigger');
    const stateText = document.getElementById('stateSelectedText');
    const stateSearch = document.getElementById('stateSearch');
    const stateList = document.getElementById('stateList');
    const stateInput = document.getElementById('state');

    const regionWrapper = document.getElementById('regionSelectWrapper');
    const regionTrigger = document.getElementById('regionSelectTrigger');
    const regionText = document.getElementById('regionSelectedText');
    const regionSearch = document.getElementById('regionSearch');
    const regionList = document.getElementById('regionList');
    const regionInput = document.getElementById('region');

    const otherRegionGroup = document.getElementById('otherRegionGroup');
    const otherRegionInput = document.getElementById('otherRegion');

    let regionsData = [];

    // Load Data
    try {
        const response = await fetch('../src/data/india-regions.json');
        if (response.ok) {
            const data = await response.json();
            regionsData = data.states;
            populateList(stateList, regionsData.map(s => s.name), handleStateSelect);
        }
    } catch (err) {
        console.error('Failed to load regions data:', err);
    }

    // Dropdown Toggle Logic
    function closeAllDropdowns() {
        if(stateWrapper) stateWrapper.classList.remove('open');
        if(regionWrapper) regionWrapper.classList.remove('open');
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-wrapper')) {
            closeAllDropdowns();
        }
    });

    if (stateTrigger) {
        stateTrigger.addEventListener('click', () => {
            const isOpen = stateWrapper.classList.contains('open');
            closeAllDropdowns();
            if (!isOpen) {
                stateWrapper.classList.add('open');
                stateSearch.focus();
            }
        });
    }

    if (regionTrigger) {
        regionTrigger.addEventListener('click', () => {
            if (regionWrapper.classList.contains('disabled')) return;
            const isOpen = regionWrapper.classList.contains('open');
            closeAllDropdowns();
            if (!isOpen) {
                regionWrapper.classList.add('open');
                regionSearch.focus();
            }
        });
    }

    // Populate List
    function populateList(ulElement, items, selectCallback) {
        ulElement.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.addEventListener('click', () => selectCallback(item));
            ulElement.appendChild(li);
        });
        
        // Add "Other" option if it's the region list to cover missed regions
        if (ulElement === regionList && items.length > 0) {
            const liOther = document.createElement('li');
            liOther.textContent = 'Other';
            liOther.addEventListener('click', () => selectCallback('Other'));
            ulElement.appendChild(liOther);
        }
    }

    // Selection Handlers
    function handleStateSelect(stateName) {
        stateText.textContent = stateName;
        stateInput.value = stateName;
        stateWrapper.classList.remove('open');
        stateSearch.value = '';
        filterList(stateList, '');

        // Hide "Other" field on state change as region is reset
        if (otherRegionGroup) {
            otherRegionGroup.style.display = 'none';
            otherRegionInput.removeAttribute('required');
            otherRegionInput.value = '';
        }

        // Reset and enable region
        regionText.textContent = 'Select Region';
        regionInput.value = '';
        regionWrapper.classList.remove('disabled');
        
        const stateObj = regionsData.find(s => s.name === stateName);
        if (stateObj) {
            populateList(regionList, stateObj.regions, handleRegionSelect);
        }
    }

    function handleRegionSelect(regionName) {
        regionText.textContent = regionName;
        regionInput.value = regionName;
        regionWrapper.classList.remove('open');
        regionSearch.value = '';
        filterList(regionList, '');

        // Show "Other" input if selected
        if (regionName === 'Other') {
            if (otherRegionGroup) {
                otherRegionGroup.style.display = 'block';
                if (otherRegionInput) {
                    otherRegionInput.setAttribute('required', 'required');
                    otherRegionInput.focus();
                }
            }
        } else {
            if (otherRegionGroup) {
                otherRegionGroup.style.display = 'none';
                if (otherRegionInput) {
                    otherRegionInput.removeAttribute('required');
                    otherRegionInput.value = '';
                }
            }
        }
    }

    // Search Logic
    function filterList(ulElement, query) {
        const filter = query.toLowerCase();
        const items = ulElement.getElementsByTagName('li');
        for (let i = 0; i < items.length; i++) {
            const txtValue = items[i].textContent || items[i].innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                items[i].style.display = "";
            } else {
                items[i].style.display = "none";
            }
        }
    }

    if(stateSearch) {
        stateSearch.addEventListener('input', (e) => filterList(stateList, e.target.value));
    }
    if(regionSearch) {
        regionSearch.addEventListener('input', (e) => filterList(regionList, e.target.value));
    }

    // Form Submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate custom selects array
            if (!stateInput.value) {
                alert('Please select a state.');
                return;
            }
            if (!regionInput.value) {
                alert('Please select a region/district.');
                return;
            }

            const companyName = document.getElementById('companyName').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const submitBtn = form.querySelector('.form-submit');

            let finalRegion = regionInput.value;
            if (finalRegion === 'Other' && otherRegionInput && otherRegionInput.value.trim() !== '') {
                finalRegion = otherRegionInput.value.trim();
            }

            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: 'ac9cd8de-b3de-413e-a716-99d851070bae',
                        subject: 'New Distributor Application - RDA Vedanta',
                        from_name: 'RDA Vedanta Website',
                        Company_Name: companyName,
                        State: stateInput.value,
                        Region_District: finalRegion,
                        Phone_Number: phoneNumber
                    })
                });

                const result = await response.json();

                if (result.success) {
                    alert('✅ Thank you! Your application has been submitted successfully.');
                    form.reset();
                    stateText.textContent = 'Select State';
                    stateInput.value = '';
                    regionText.textContent = 'Select State First';
                    regionInput.value = '';
                    regionWrapper.classList.add('disabled');
                    regionList.innerHTML = '';
                    if (otherRegionGroup) {
                        otherRegionGroup.style.display = 'none';
                        if (otherRegionInput) {
                            otherRegionInput.removeAttribute('required');
                            otherRegionInput.value = '';
                        }
                    }
                } else {
                    alert('❌ Something went wrong. Please try again or contact us directly.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('❌ Network error. Please check your internet connection.');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
