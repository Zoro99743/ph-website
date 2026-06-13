// App Logic
function selectEventAndCheckout(title, priceStr, imgUrl) {
    const item = {
        title: title,
        price: parseFloat(priceStr.replace(/[^0-9.]/g, '')),
        img: imgUrl
    };
    
    // Save to localStorage
    localStorage.setItem('bookingCart', JSON.stringify(item));
    
    // Redirect to billing/checkout page
    window.location.href = 'checkout.html';
}

function updateBookingEvent(eventName) {
    let priceStr = '₹0.00';
    let imgUrl = 'images/logo.png';
    
    if (eventName.includes('UNO')) {
        priceStr = '₹199.00';
        imgUrl = 'https://images.unsplash.com/photo-1632501641311-53641b0584eb?w=400';
    } else if (eventName.includes('Mafia')) {
        priceStr = '₹149.00';
    } else if (eventName.includes('D&D')) {
        priceStr = '₹249.00';
    }
    
    selectEventAndCheckout(eventName, priceStr, imgUrl);
}

// Global Profile Toggle function
function toggleProfile() {
    const sidebar = document.getElementById('profileSidebar');
    const overlay = document.getElementById('profileOverlay');
    
    if (sidebar && !sidebar.classList.contains('active')) {
        // Attempt to find Supabase session in localStorage
        let session = null;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
                try {
                    session = JSON.parse(localStorage.getItem(key));
                } catch (e) {}
                break;
            }
        }
        
        const subtitle = sidebar.querySelector('p');
        const contentDivs = sidebar.querySelectorAll('div');
        // Find the specific container holding the buttons
        let profileContent = null;
        contentDivs.forEach(div => {
            if (div.style.flexDirection === 'column') {
                profileContent = div;
            }
        });
        
        if (!profileContent && contentDivs.length > 0) {
            profileContent = contentDivs[contentDivs.length - 1];
        }
        
        if (session && session.user) {
            // User is logged in
            const email = session.user.email;
            const name = session.user.user_metadata?.full_name || email.split('@')[0];
            const avatar = session.user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=e9b65e&color=fff';
            
            if(subtitle) subtitle.innerHTML = `Welcome back, <strong style="color:var(--primary);">${name}</strong>!<br><span style="font-size:0.85rem; color:#bda79b; word-break: break-all;">${email}</span>`;
            
            if(profileContent) {
                profileContent.innerHTML = `
                    <div style="display:flex; align-items:center; gap:15px; margin-bottom: 10px; padding: 15px; background: rgba(233,182,94,0.1); border-radius: 12px; border: 1px solid var(--primary);">
                        <img src="${avatar}" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);">
                        <div>
                            <div style="color: var(--primary); font-weight: bold; font-size: 1.1rem;">Premium Member</div>
                            <div style="color: var(--text-muted); font-size: 0.9rem;">Loyalty Points: <span style="color:var(--text-main); font-weight:bold;">120</span></div>
                        </div>
                    </div>
                    <button class="btn-outline" style="width: 100%; padding: 12px; margin-bottom: 10px; border-radius: 30px; border: 1px solid var(--primary); background: transparent; color: var(--text-main); font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='var(--primary)'; this.style.color='var(--bg-dark)'; this.children[0].style.color='var(--bg-dark)';" onmouseout="this.style.background='transparent'; this.style.color='var(--text-main)'; this.children[0].style.color='var(--primary)';" onclick="window.location.href='checkout.html'">
                        <i class="fa-solid fa-calendar-check" style="color:var(--primary); transition: all 0.3s;"></i> My Bookings
                    </button>
                    
                    <button class="btn-outline" style="width: 100%; padding: 12px; margin-bottom: 10px; border-radius: 30px; border: 1px solid var(--primary); background: transparent; color: var(--text-main); font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='var(--primary)'; this.style.color='var(--bg-dark)'; this.children[0].style.color='var(--bg-dark)';" onmouseout="this.style.background='transparent'; this.style.color='var(--text-main)'; this.children[0].style.color='var(--primary)';" onclick="window.location.href='saved-games.html'">
                        <i class="fa-solid fa-heart" style="color:var(--primary); transition: all 0.3s;"></i> Saved Games
                    </button>
                    
                    <button class="btn-outline" style="width: 100%; padding: 12px; background: transparent; border: 1px solid #ff4757; color: #ff4757; margin-top: 15px; border-radius: 30px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='#ff4757'; this.style.color='white'; this.children[0].style.color='white';" onmouseout="this.style.background='transparent'; this.style.color='#ff4757'; this.children[0].style.color='#ff4757';" onclick="logout()">
                        <i class="fa-solid fa-arrow-right-from-bracket" style="transition: all 0.3s;"></i> Logout
                    </button>
                `;
            }
        } else {
            // User is NOT logged in
            if(subtitle) subtitle.innerHTML = 'Log in to view your bookings, manage saved tables, and track your loyalty points.';
            if(profileContent) {
                profileContent.innerHTML = `
                    <button class="btn-outline" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 15px; background: white; color: black; border: none; font-weight: 600; cursor: pointer; border-radius: 30px;" onclick="window.location.href='login.html'">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style="width: 20px; height: 20px;"> Login / Sign Up
                    </button>
                `;
            }
        }
    }
    
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

function logout() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
            localStorage.removeItem(key);
            break;
        }
    }
    window.location.reload();
}

let formState = {
    adults: 2,
    kidsUnder10: 0,
    kidsOver10: 0,
    tables: new Set(['A']),
    members: [],
    globalSelected: { name: 'Plan 1 (₹199)', price: 199 }
};

function loadCheckout() {
    let item = null;
    try {
        const cartData = localStorage.getItem('bookingCart');
        if (cartData) item = JSON.parse(cartData);
    } catch(e) {}

    if (!item) {
        item = { title: "Booking Session", price: 0, img: "images/logo.png" };
    }
    
    const titleEl = document.getElementById('checkoutTitle');
    if (titleEl) titleEl.innerText = item.title;
    
    const eventSelect = document.getElementById('bookingEventType');
    if (eventSelect) {
        let found = false;
        for (let i = 0; i < eventSelect.options.length; i++) {
            if (item.title.includes(eventSelect.options[i].value) || eventSelect.options[i].value.includes(item.title)) {
                eventSelect.selectedIndex = i;
                found = true;
                break;
            }
        }
        if (!found && item.title !== "Booking Session") {
            const opt = document.createElement('option');
            opt.value = item.title;
            opt.innerText = item.title;
            opt.selected = true;
            eventSelect.appendChild(opt);
        }
    }
    
    const imgEl = document.getElementById('checkoutImg');
    if (imgEl) {
        imgEl.src = item.img;
        imgEl.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1632501641311-53641b0584eb?w=400';
        };
    }
    
    
    // Setup Date constraints
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    // Populate Time Slots
    const timeSelect = document.getElementById('bookingTime');
    if (timeSelect) {
        timeSelect.innerHTML = '<option value="" disabled selected>Select a time</option>';
        if (item.title && item.title.toUpperCase().includes('UNO')) {
            timeSelect.innerHTML += `
                <option value="5:00 PM - 6:30 PM">5:00 PM - 6:30 PM</option>
                <option value="6:00 PM - 7:30 PM">6:00 PM - 7:30 PM</option>
                <option value="7:00 PM - 8:30 PM">7:00 PM - 8:30 PM</option>
            `;
        } else {
            const standardSlots = [
                "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
                "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
            ];
            standardSlots.forEach(slot => {
                timeSelect.innerHTML += `<option value="${slot}">${slot}</option>`;
            });
        }
    }

    // Initialize complex form UI
    initCheckoutForm();
}

// Auto-initialize when the script loads or DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCheckout);
} else {
    loadCheckout();
}

function initCheckoutForm() {
    renderTables();
    updateMembersList();
}

function updateCount(type, delta) {
    if (formState[type] + delta >= 0) {
        formState[type] += delta;
        
        let total = formState.adults + formState.kidsUnder10 + formState.kidsOver10;
        // ensure at least 1 person
        if (total === 0 && delta < 0) {
            formState[type] -= delta;
            return;
        }
        
        document.getElementById(type + 'Count').innerText = formState[type];
        document.getElementById('totalPersonsText').innerText = `Total: ${total} persons`;
        updateMembersList();
    }
}

function resetCounts() {
    formState.adults = 2;
    formState.kidsUnder10 = 0;
    formState.kidsOver10 = 0;
    document.getElementById('adultsCount').innerText = 2;
    document.getElementById('kidsUnder10Count').innerText = 0;
    document.getElementById('kidsOver10Count').innerText = 0;
    document.getElementById('totalPersonsText').innerText = `Total: 2 persons`;
    updateMembersList();
}

function renderTables() {
    const grid = document.getElementById('tablesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const tables = ['A','B','C','D','E','F','G','H','I','J','K'];
    tables.forEach(t => {
        const div = document.createElement('div');
        div.className = `table-circle ${formState.tables.has(t) ? 'selected' : ''}`;
        div.innerHTML = `${t}<div class="dot"></div>`;
        div.onclick = () => {
            if (formState.tables.has(t)) formState.tables.delete(t);
            else formState.tables.add(t);
            document.getElementById('tablesSelectedText').innerText = `${formState.tables.size} selected`;
            div.className = `table-circle ${formState.tables.has(t) ? 'selected' : ''}`;
        };
        grid.appendChild(div);
    });
}

function updateMembersList() {
    let newMembers = [];
    for(let i=1; i<=formState.adults; i++) newMembers.push({ id: `Adult ${i}`, type: 'adult', plan: 'Plan 1 (₹199)', price: 199 });
    for(let i=1; i<=formState.kidsUnder10; i++) newMembers.push({ id: `Kid <10 ${i}`, type: 'kidUnder10', plan: 'Kids <10 (₹99)', price: 99 });
    for(let i=1; i<=formState.kidsOver10; i++) newMembers.push({ id: `Kid >10 ${i}`, type: 'kidOver10', plan: 'Kids >10 (₹149)', price: 149 });
    
    // preserve old choices if possible
    newMembers.forEach(nm => {
        const existing = formState.members.find(m => m.id === nm.id);
        if (existing) {
            nm.plan = existing.plan;
            nm.price = existing.price;
        }
    });
    
    formState.members = newMembers;
    renderMembers();
}

function renderMembers() {
    const container = document.getElementById('individualMembersContainer');
    if (!container) return;
    container.innerHTML = '';
    
    formState.members.forEach((m, idx) => {
        const row = document.createElement('div');
        row.className = 'member-row';
        
        let html = `
            <div class="member-name">${m.id}</div>
            <div class="member-options">
                <button type="button" class="member-opt-btn ${m.plan === 'Plan 1 (₹199)' ? 'active' : ''}" onclick="setMemberPlan(${idx}, 'Plan 1 (₹199)', 199)">Plan 1</button>
                <button type="button" class="member-opt-btn ${m.plan === 'Plan 2 (₹149)' ? 'active' : ''}" onclick="setMemberPlan(${idx}, 'Plan 2 (₹149)', 149)">Plan 2</button>
                <button type="button" class="member-opt-btn ${m.plan === 'Plan 3 (₹99)' ? 'active' : ''}" onclick="setMemberPlan(${idx}, 'Plan 3 (₹99)', 99)">Plan 3</button>
                <button type="button" class="member-opt-btn ${m.plan === 'Kids <10 (₹99)' ? 'active' : ''}" onclick="setMemberPlan(${idx}, 'Kids <10 (₹99)', 99)">Kids &lt;10</button>
                <button type="button" class="member-opt-btn ${m.plan === 'Kids >10 (₹149)' ? 'active' : ''}" onclick="setMemberPlan(${idx}, 'Kids >10 (₹149)', 149)">Kids &gt;10</button>
                <button type="button" class="member-opt-btn ${m.plan === 'Cafe' ? 'active' : ''}" onclick="setMemberPlan(${idx}, 'Cafe', 0)">Cafe</button>
                <span style="color: var(--text-muted); font-size: 0.85rem; margin: 0 5px;">or ₹</span>
                <input type="number" class="member-custom-input" value="${m.plan === 'Custom' ? m.price : 199}" onchange="setMemberCustom(${idx}, this.value)">
            </div>
        `;
        row.innerHTML = html;
        container.appendChild(row);
    });
    
    calculateTotal();
}

function setMemberPlan(idx, planName, price) {
    formState.members[idx].plan = planName;
    formState.members[idx].price = price;
    renderMembers();
}

function setMemberCustom(idx, val) {
    formState.members[idx].plan = 'Custom';
    formState.members[idx].price = parseFloat(val) || 0;
    renderMembers();
}

function setGlobalPlan(planName, price, element) {
    document.querySelectorAll('.plan-pill').forEach(el => el.classList.remove('active'));
    if(element) element.classList.add('active');
    formState.globalSelected = { name: planName, price: parseFloat(price) || 0 };
}

function applyGlobalPlan() {
    if (!formState.globalSelected) return;
    const { name, price } = formState.globalSelected;
    
    formState.members.forEach(m => {
        m.plan = name;
        m.price = price;
    });
    renderMembers();
}

function calculateTotal() {
    let totalFirstHour = 0;
    formState.members.forEach(m => totalFirstHour += m.price);
    
    let avg = formState.members.length > 0 ? (totalFirstHour / formState.members.length).toFixed(0) : 0;
    const avgText = document.getElementById('avgPriceText');
    if(avgText) avgText.innerText = `Total first-hour: ₹${totalFirstHour} - avg ₹${avg}/person`;
    
    const finalTotal = totalFirstHour;

    const checkoutPriceEl = document.getElementById('checkoutPrice');
    if(checkoutPriceEl) checkoutPriceEl.innerText = `₹${totalFirstHour.toFixed(2)}`;
    
    const subtotalTextEl = document.getElementById('subtotalText');
    if(subtotalTextEl) subtotalTextEl.innerText = `₹${totalFirstHour.toFixed(2)}`;
    
    const totalTextEl = document.getElementById('totalText');
    if(totalTextEl) totalTextEl.innerText = `₹${finalTotal.toFixed(2)}`;
}

function processPayment(event) {
    event.preventDefault(); // Prevent form submission
    
    const btn = document.getElementById('payBtn');
    const originalText = btn.innerHTML;
    
    // Calculate final total
    let totalAmount = 0;
    formState.members.forEach(m => totalAmount += m.price);
    
    if (totalAmount === 0) {
        showSuccess();
        return;
    }

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    // Razorpay Integration
    var options = {
        "key": "rzp_test_Sxvo8Cl7NdeO2e", // Enter the Key ID generated from the Dashboard
        "amount": Math.round(totalAmount * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Playhouse Cafe",
        "description": "Table Booking Checkout",
        "image": "images/logo.png",
        "handler": function (response){
            // Payment success handler
            // console.log(response.razorpay_payment_id);
            showSuccess();
        },
        "prefill": {
            "name": document.getElementById('custName') ? document.getElementById('custName').value : "",
            "email": document.getElementById('custEmail') ? document.getElementById('custEmail').value : "",
            "contact": document.getElementById('custMobile') ? document.getElementById('custMobile').value : ""
        },
        "notes": {
            "booking_date": document.getElementById('bookingDate') ? document.getElementById('bookingDate').value : "",
            "time_slot": document.getElementById('bookingTime') ? document.getElementById('bookingTime').value : ""
        },
        "theme": {
            "color": "#E9B65E"
        },
        "modal": {
            "ondismiss": function(){
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }
    };
    
    if (typeof Razorpay !== 'undefined') {
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
            alert("Payment Failed. Reason: " + response.error.description);
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
        rzp1.open();
    } else {
        // Fallback to simulate if script didn't load
        setTimeout(() => {
            showSuccess();
        }, 1500);
    }
}

function showSuccess() {
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'flex';
    localStorage.removeItem('bookingCart');
    
    // Save to Supabase (Host Dashboard DB)
    if (window.supabase) {
        const SUPABASE_URL = 'https://ectiisgvpwxniakspyqn.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_w9qse3-GjHoXXfXUu0tDFg_3r0dWoLG';
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        try {
            const custName = document.getElementById('custName') ? document.getElementById('custName').value : 'Guest';
            const custMobile = document.getElementById('custMobile') ? document.getElementById('custMobile').value : '';
            const bookingDate = document.getElementById('bookingDate') ? document.getElementById('bookingDate').value : '';
            const bookingTime = document.getElementById('bookingTime') ? document.getElementById('bookingTime').value : '';
            
            // create date object
            let dateTime = Date.now();
            if (bookingDate && bookingTime) {
                // simple parsing of time like "5:00 PM"
                let hours = parseInt(bookingTime.split(':')[0]);
                const minutes = parseInt(bookingTime.split(':')[1].split(' ')[0]);
                const ampm = bookingTime.includes('PM') ? 'PM' : 'AM';
                if (ampm === 'PM' && hours < 12) hours += 12;
                if (ampm === 'AM' && hours === 12) hours = 0;
                
                const dateObj = new Date(bookingDate);
                dateObj.setHours(hours, minutes, 0, 0);
                if (!isNaN(dateObj.getTime())) {
                    dateTime = dateObj.getTime();
                }
            }

            let totalGuests = formState.adults + formState.kidsUnder10 + formState.kidsOver10;
            let titleEl = document.getElementById('checkoutTitle');
            let eventName = titleEl ? titleEl.innerText : 'Table Booking';

            supabase.from('online_reservations').insert([{
                name: custName,
                mobile: custMobile,
                date_time: dateTime,
                guests: totalGuests,
                note: eventName
            }]).then(({ data, error }) => {
                if (error) {
                    console.error('Supabase save error:', error);
                    alert("Error saving reservation to database: " + error.message);
                } else {
                    console.log("Reservation saved successfully:", data);
                }
            }).catch(e => {
                console.error("Fetch exception:", e);
                alert("Network exception saving reservation: " + e.message);
            });
        } catch (e) {
            console.error('Exception saving reservation:', e);
        }
    }
}
