const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const validateEmail = (value: string): string | undefined => {
    if (!value) return "Email is required";
    if (!EMAIL_REGEX.test(value)) return "Invalid email format";
    return undefined;
};

export const validatePassword = (value: string): string | undefined => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 chars";
    return undefined;
};

export const validateName = (value: string): string | undefined => {
    if (!value.trim()) return "Name is required";
    return undefined;
};

export const validateUsername = (value: string): string | undefined => {
    if (!value.trim()) return "Username is required";
    return undefined;
};