import Input from "./Input";
import { useState } from "react";
import Button from "../Button";

import SocialMediaBlock from "./SocialMediaBlock";
import Separator from "./Separator";
import { useNavigate } from "react-router";

interface Props{
    setSignup: ()=>void;
}
export interface LoginFormData {
    email: string;
    password: string;
}

type FormErrors = Partial<LoginFormData>;
type TouchedState = Partial<Record<keyof LoginFormData, boolean>>;

const LoginForm : React.FC<Props> = ({setSignup})=> {

    const navigate = useNavigate();

    const [formData, setLoginFormData] = useState<LoginFormData>({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedState>({});

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const validateField = (name: keyof LoginFormData, value: string): string | undefined => {
        let error: string | undefined;

        switch (name) {
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
        }
        return error;
    };

    const handleBlur = (name: keyof LoginFormData) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        
        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (name: keyof LoginFormData, value: string) => {
        setLoginFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name] || errors[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const emailError = validateField("email", formData.email);
        const passwordError = validateField("password", formData.password);

        setErrors({ email: emailError, password: passwordError });
        setTouched({ email: true, password: true });

        if (!emailError && !passwordError) {
            
        }
    };

    const getFieldStatus = (fieldName: keyof FormErrors): "valid" | "invalid" | "neutral" => {
        const hasError = !!errors[fieldName];
        const isTouched = !!touched[fieldName as keyof TouchedState];
        const value = formData[fieldName as keyof LoginFormData];

        if (isTouched && hasError) return "invalid";

        if (isTouched && !hasError && value) return "valid";

        return "neutral";
    };

    return (
    <div className="max-w-md w-full bg-white border-slate-200 shadow-lg py-8 px-8 rounded font-normal">
        <h2 className="text-amber-300 text-2xl font-medium w-full text-center mb-5" >Login</h2>
        <form onSubmit={handleSubmit}>
            <Input
                type="email"
                name="Email"
                onChange={(v)=> handleChange("email",v)}
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
                onChange={(v)=>handleChange("password",v)}
                value={formData.password}
                onBlur={() => handleBlur("password")}
                error={touched.password ? errors.password : undefined}
                isValid={getFieldStatus("password")}
            >
                Password
            </Input>
            <Button type="fill" htmlType="submit" className="w-full py-3 font-medium text-xl my-2" bgColor="var(--color-amber-300)" color="white ">Login</Button>
        </form>
        <div className="text-sm text-gray-400 mt-4 text-center">
        Already have an account?{"  "}
        <button
            type="button"
            className="cursor-pointer text-amber-300 hover:text-amber-200 font-medium bg-transparent border-none p-0 underline-offset-2 hover:underline"
            onClick={setSignup}
        >
            Sign Up
        </button>
    </div>
        <Separator> or </Separator>
        <SocialMediaBlock />
    </div> );
}

export default LoginForm;