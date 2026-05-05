/**
 * Email Template Studio — Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════
    // UI ELEMENTS
    // ═══════════════════════════════════════════
    const deviceFrame = document.getElementById('deviceFrame');
    const deviceButtons = document.querySelectorAll('.device-btn');
    const deviceLabel = document.querySelector('.device-info__label');
    const deviceSize = document.querySelector('.device-info__size');
    const btnDarkMode = document.getElementById('btn-dark-mode');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const btnSend = document.getElementById('btn-send');
    const btnCopyCode = document.getElementById('btnCopyCode');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // ═══════════════════════════════════════════
    // DEVICE SWITCHING LOGIC
    // ═══════════════════════════════════════════
    const deviceConfigs = {
        desktop: { label: 'Desktop', width: '1200 × 900', class: 'desktop' },
        tablet: { label: 'Tablet', width: '768 × 1024', class: 'tablet' },
        mobile: { label: 'Mobile', width: '420 × 800', class: 'mobile' }
    };

    deviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const device = button.dataset.device;
            const config = deviceConfigs[device];

            // Update Active State
            deviceButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update Device Frame
            deviceFrame.className = `device-frame ${config.class}`;
            
            // Update Labels
            deviceLabel.textContent = config.label;
            deviceSize.textContent = config.width;

            // Scroll to top
            document.querySelector('.email-viewport').scrollTop = 0;
        });
    });

    // ═══════════════════════════════════════════
    // COUNTDOWN TIMER LOGIC
    // ═══════════════════════════════════════════
    function updateCountdown() {
        // Mock countdown: 3 days from now
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        targetDate.setHours(targetDate.getHours() + 14);

        function refresh() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('countDays').textContent = String(days).padStart(2, '0');
            document.getElementById('countHours').textContent = String(hours).padStart(2, '0');
            document.getElementById('countMinutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('countSeconds').textContent = String(seconds).padStart(2, '0');
        }

        setInterval(refresh, 1000);
        refresh();
    }

    updateCountdown();

    // ═══════════════════════════════════════════
    // THEME & UTILITIES
    // ═══════════════════════════════════════════
    
    // Dark Mode Toggle
    btnDarkMode.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        btnDarkMode.querySelector('i').className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        
        showToast(newTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
    });

    // Fullscreen Toggle
    btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            btnFullscreen.querySelector('i').className = 'fa-solid fa-compress';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                btnFullscreen.querySelector('i').className = 'fa-solid fa-expand';
            }
        }
    });

    // Copy Code Functionality
    btnCopyCode.addEventListener('click', () => {
        const code = document.querySelector('.promo-code__value').textContent;
        navigator.clipboard.writeText(code).then(() => {
            showToast('Promo code copied to clipboard!');
        });
    });

    // Send Test Email Action
    btnSend.addEventListener('click', () => {
        btnSend.disabled = true;
        btnSend.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Sending...</span>';
        
        setTimeout(() => {
            btnSend.disabled = false;
            btnSend.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Test</span>';
            showToast('Test email sent successfully!');
        }, 1500);
    });

    // Toast Notification System
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Unsubscribe Confirmation
    document.getElementById('unsubscribeLink').addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm('Are you sure you want to unsubscribe from our newsletter?')) {
            showToast('You have been unsubscribed.');
        }
    });
});
