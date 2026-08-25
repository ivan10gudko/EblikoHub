import { SIGN_UP_SYMBOLS_LIMITS } from "../model/auth.constants";

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
    if (value.length > SIGN_UP_SYMBOLS_LIMITS.NAME) {
        return `Name must not exceed ${SIGN_UP_SYMBOLS_LIMITS.NAME} characters`;
    }
    return undefined;
};

export const validateUsername = (value: string): string | undefined => {
    if (!value.trim()) return "Username is required";
    if (value.length > SIGN_UP_SYMBOLS_LIMITS.USERNAME) {
        return `Username must not exceed ${SIGN_UP_SYMBOLS_LIMITS.USERNAME} characters`;
    }
    return undefined;
};