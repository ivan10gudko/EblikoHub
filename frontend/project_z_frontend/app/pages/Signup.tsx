import React, { useState } from "react";
import Input from "../components/AuthPage/Input";
import Separator from "../components/AuthPage/Separator";
import SocialMediaBlock from "../components/AuthPage/SocialMediaBlock";
import Button from "../components/Button";
import { checkFieldAvailability} from "~/services/API";
import { useNavigate } from "react-router";
import type { RegisterData } from "~/types/auth.types";

interface RegisterFormData extends RegisterData {
    confirmPassword: string;
}
type FormErrors = Partial<RegisterFormData>;
type TouchedState = Partial<Record<keyof RegisterFormData, boolean>>;

const SignupForm = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterFormData>({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedState>({});

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;


    const validateField = (name: keyof RegisterFormData, value: string, currentFormData: RegisterFormData): string | undefined => {
        let error: string | undefined;

        switch (name) {
            case "name":
                if (!value.trim()) error = "Name is required";
                break;
            case "username":
                if (!value.trim()){
                    error = "Username is required";
                    break;
                }
                
                handleCheckAvailability("username",value)
                break;
            case "email":
                if (!value) {
                    error = "Email is required";
                } else if (!emailRegex.test(value)) {
                    error = "Invalid email format";
                }
                break;
            case "password":
                if (!value) {
                    error = "Password is required";
                } else if (value.length < 8) {
                    error = "Password must be at least 8 chars";
                }
                break;
            case "confirmPassword":
                if (!value) {
                    error = "Please confirm your password";
                } else if (value !== currentFormData.password) {
                    error = "Passwords do not match";
                }
                break;
        }

        return error;
    };

    const handleBlur = (name: keyof RegisterFormData) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const error = validateField(name, formData[name], formData);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleCheckAvailability = async (name: string, value: string) => {
        if (!value) return;


        try {
            const isTaken = await checkFieldAvailability(name, value);

            if (isTaken) {
                setErrors((prev:any) => ({
                    ...prev,
                    [name]: `This ${name} is already taken`
                }));
            }
        } catch (error) {
            console.error("Server error");
        }
    };

    const handleChange = (name: keyof RegisterFormData, value: string) => {
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        if (touched[name] || errors[name]) {
            const error = validateField(name, value, updatedFormData);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }


        if (name === "password" && touched.confirmPassword) {
            const confirmError = validateField("confirmPassword", formData.confirmPassword, updatedFormData);
            setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: FormErrors = {};
        let hasError = false;

        (Object.keys(formData) as Array<keyof RegisterFormData>).forEach((key) => {
            const error = validateField(key, formData[key], formData);
            
            if (error) {
                newErrors[key] = error;
                hasError = true;
            }
        });

        setErrors(newErrors);
    
        setTouched({
            name: true,
            username: true,
            email: true,
            password: true,
            confirmPassword: true,
        });

        if (!hasError) {
            console.log("Signup Data Submitted:", formData);

        }
    };

    const getFieldStatus = (fieldName: keyof RegisterFormData): "valid" | "invalid" | "neutral" => {
        const hasError = !!errors[fieldName];
        const isTouched = !!touched[fieldName];
        const value = formData[fieldName];

        if (isTouched && hasError) return "invalid";
        if (isTouched && !hasError && value) return "valid";
        return "neutral";
    };

    return (
<div className="max-w-md w-full bg-white border-slate-200 shadow-lg py-6 px-8 rounded font-normal">
    <h2 className="text-amber-300 text-2xl font-medium w-full text-center mb-5">
        Sign Up
    </h2>
    <form onSubmit={handleSubmit} noValidate>
        <Input
            type="text"
            name="name"
            onChange={(v) => handleChange("name", v)}
            value={formData.name}
            onBlur={() => handleBlur("name")}
            error={touched.name ? errors.name : undefined}
            isValid={getFieldStatus("name")}
        >
            Name
        </Input>

        <Input
            type="text"
            name="username"
            onChange={(v) => handleChange("username", v)}
            value={formData.username}
            onBlur={() => handleBlur("username")}
            error={touched.username ? errors.username : undefined}
            isValid={getFieldStatus("username")}
        >
            Username
        </Input>

        <Input
            type="email"
            name="email"
            onChange={(v) => handleChange("email", v)}
            value={formData.email}
            onBlur={() => handleBlur("email")}
            error={touched.email ? errors.email : undefined}
            isValid={getFieldStatus("email")}
        >
            Email
        </Input>

        <Input
            type="password"
            name="password"
            onChange={(v) => handleChange("password", v)}
            value={formData.password}
            onBlur={() => handleBlur("password")}
            error={touched.password ? errors.password : undefined}
            isValid={getFieldStatus("password")}
        >
            Password
        </Input>

        <Input
            type="password"
            name="confirmPassword"
            onChange={(v) => handleChange("confirmPassword", v)}
            value={formData.confirmPassword}
            onBlur={() => handleBlur("confirmPassword")}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            isValid={getFieldStatus("confirmPassword")}
        >
            Confirm password
        </Input>

        <Button
            type="fill"
            htmlType="submit"
            className="w-full py-3 font-medium text-xl my-2"
            bgColor="var(--color-amber-300)"
            color="white"
        >
            Sign Up
        </Button>
    </form>

    <div className="text-sm text-gray-400 mt-4 text-center">
        Already have an account?{"  "}
        <button
            type="button"
            className="cursor-pointer text-amber-300 hover:text-amber-200 font-medium bg-transparent border-none p-0 underline-offset-2 hover:underline"
            onClick={()=>navigate("/auth/login")}
        >
            Log in
        </button>
    </div>

    <Separator> or </Separator>
    <SocialMediaBlock />
</div>
);
};

export default SignupForm;