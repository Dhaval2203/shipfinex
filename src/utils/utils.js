export const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&]/.test(password)) strength += 1;

    switch (strength) {
        case 5:
            return 'Strong';
        case 4:
            return 'Moderate';
        default:
            return 'Weak';
    }
};