export function validateSignUp(email: string, firstName: string, password: string, confirmPassword: string): string | null {
    if (!email || !firstName || !password || !confirmPassword) {
        return "Missing information";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }

    if (password !== confirmPassword) {
        return "Passwords are not the same";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }

    return null;
}


export function validateSignIn(email: string, password: string): string | null {
    if (!email || !password) {
        return 'Email and password are required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Invalid email format';
    }

    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }

    return null;
}
