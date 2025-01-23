document.addEventListener('DOMContentLoaded', () => {
    const passwordOutput = document.getElementById('password-output');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const discordBtn = document.getElementById('discord-btn');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthLabel = document.querySelector('.strength-label');
    const notificationContainer = document.querySelector('.notification-container');

    const charsets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    const checkboxes = {
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        numbers: document.getElementById('numbers'),
        symbols: document.getElementById('symbols')
    };

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 500);
        }, 2000);
    }

    function calculatePasswordEntropy(password) {
        const charsetSize = Object.keys(checkboxes)
            .filter(key => checkboxes[key].checked)
            .reduce((total, key) => total + charsets[key].length, 0);
        
        const entropy = Math.log2(Math.pow(charsetSize, password.length));
        return Math.round(entropy);
    }

    function calculatePasswordStrength(password) {
        const criteria = [
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /[0-9]/.test(password),
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            password.length >= 12
        ];

        const strengthScore = criteria.filter(Boolean).length * 20;
        const entropy = calculatePasswordEntropy(password);
        
        strengthBar.style.width = `${strengthScore}%`;
        strengthBar.style.background = 
            strengthScore < 20 ? 'linear-gradient(to right, darkred, red)' :
            strengthScore < 40 ? 'linear-gradient(to right, red, orange)' :
            strengthScore < 60 ? 'linear-gradient(to right, orange, yellow)' :
            strengthScore < 80 ? 'linear-gradient(to right, green, lightgreen)' :
            'linear-gradient(to right, darkgreen, green)';
        
        strengthLabel.textContent = 
            strengthScore < 20 ? `Very Weak (Entropi: ${entropy})` : 
            strengthScore < 40 ? `Weak (Entropi: ${entropy})` : 
            strengthScore < 60 ? `Middle (Entropi: ${entropy})` : 
            strengthScore < 80 ? `Strong (Entropi: ${entropy})` : 
            `Very Strong (Entropi: ${entropy})`;
    }

    function generatePassword() {
        const length = lengthSlider.value;
        let chars = '';
        
        Object.keys(checkboxes).forEach(key => {
            if (checkboxes[key].checked) {
                chars += charsets[key];
            }
        });

        if (chars === '') {
            showNotification('You must select at least one character type!', 'error');
            return;
        }

        const password = Array.from(crypto.getRandomValues(new Uint32Array(length)))
            .map(x => chars[x % chars.length])
            .join('');

        passwordOutput.value = password;
        calculatePasswordStrength(password);
    }

    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    discordBtn.addEventListener('click', () => {
const discordInviteLink = 'https://discord.gg/XJBBNx7R4k';

window.open(discordInviteLink, '_blank');
showNotification('Discord sunucumuza davetlisiniz!');
});
    generateBtn.addEventListener('click', generatePassword);
    
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(passwordOutput.value)
            .then(() => {
                showNotification('Password copied');
            })
            .catch(err => {
                showNotification('copy error', 'error');
            });
    });

    // Initial generation
    generatePassword();
});