import { useState } from "react";

interface UseFormProps<T> {
    initialValues: T;
    validate: (name: keyof T, value: string, values: T) => string | undefined;
    onSubmit: (values: T) => Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
    initialValues,
    validate,
    onSubmit,
}: UseFormProps<T>) => {
    const [formData, setFormData] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const handleBlur = (name: keyof T) => () => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const error = validate(name, formData[name], formData);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleChange = (name: keyof T) => ( value: string) => {
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        if (touched[name] || errors[name]) {
            const error = validate(name, value, updatedFormData);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Partial<Record<keyof T, string>> = {};
        let hasError = false;
        const allTouched: Partial<Record<keyof T, boolean>> = {};

        (Object.keys(formData) as Array<keyof T>).forEach((key) => {
            const error = validate(key, formData[key], formData);
            if (error) {
                newErrors[key] = error;
                hasError = true;
            }
            allTouched[key] = true;
        });

        const mergedErrors = { ...errors, ...newErrors };
        
        const hasAnyError = Object.values(mergedErrors).some((err) => !!err);

        setErrors(mergedErrors);
        setTouched(allTouched);

        if (!hasAnyError) {
            await onSubmit(formData);
        }
    };

    const getFieldStatus = (fieldName: keyof T): "valid" | "invalid" | "neutral" => {
        const hasError = !!errors[fieldName];
        const isTouched = !!touched[fieldName];
        const value = formData[fieldName];

        if (isTouched && hasError) return "invalid";
        if (isTouched && !hasError && value) return "valid";

        return "neutral";
    };

    return {
        formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        getFieldStatus,
        setErrors,
    };
};