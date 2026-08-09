import { useNavigate } from "react-router";
import type { RegisterData } from "~/entities/session";
import { userService } from "~/entities/user";
import {
  useAuthStore,
  validateEmail,
  validateName,
  validatePassword,
  validateUsername,
} from "~/features/auth";
import { useForm } from "~/shared/hooks";

interface RegisterFormData extends RegisterData {
  confirmPassword: string;
}

const INITIAL_VALUE = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// Ліміти довжини
const LIMITS = {
  NAME: 16,
  USERNAME: 12,
};

export const useSignup = () => {
  const signUpWithEmail = useAuthStore((state) => state.signUpWithEmail);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const {
    formData,
    errors,
    touched,
    handleChange: baseHandleChange,
    handleBlur,
    handleSubmit,
    getFieldStatus,
    setErrors,
  } = useForm<RegisterFormData>({
    initialValues: INITIAL_VALUE,
    validate: (name, value, currentValues) => {
      switch (name) {
        case "name":
          if (value.length > LIMITS.NAME) {
            return `Ім'я не повинно перевищувати ${LIMITS.NAME} символів`;
          }
          return validateName(value);

        case "username":
          if (value.length > LIMITS.USERNAME) {
            return `Тег не повинен перевищувати ${LIMITS.USERNAME} символів`;
          }
          return validateUsername(value);

        case "email":
          return validateEmail(value);

        case "password":
          return validatePassword(value);

        case "confirmPassword":
          if (!value) return "Please confirm your password";
          if (value !== currentValues.password) return "Passwords do not match";
          return undefined;

        default:
          return undefined;
      }
    },
    onSubmit: async (values) => {
      try {
        await signUpWithEmail({
          name: values.name,
          username: values.username,
          email: values.email,
          password: values.password,
        });
        navigate("/");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        setErrors((prev) => ({ ...prev, confirmPassword: errorMessage }));
      }
    },
  });

  const handleCheckAvailability = async (value: string) => {
    if (!value || value.length > LIMITS.USERNAME) return;
    try {
      const isAvailable = await userService.isNameTagAvailable(value);
      if (!isAvailable) {
        setErrors((prev) => ({
          ...prev,
          username: `This username is already taken`,
        }));
      }
    } catch (error) {
      console.error("Server error");
    }
  };

  const handleChange = (name: keyof RegisterFormData) => (value: string) => {
    let sanitizedValue = value;

    // Жорстке обмеження: обрізаємо текст при введенні
    if (name === "name" && value.length > LIMITS.NAME) {
      sanitizedValue = value.slice(0, LIMITS.NAME);
    }

    if (name === "username" && value.length > LIMITS.USERNAME) {
      sanitizedValue = value.slice(0, LIMITS.USERNAME);
    }

    baseHandleChange(name)(sanitizedValue);

    if (name === "username") {
      handleCheckAvailability(sanitizedValue);
    }

    if (name === "password" && touched.confirmPassword) {
      const error =
        formData.confirmPassword !== sanitizedValue
          ? "Passwords do not match"
          : undefined;
      setErrors((prev) => ({ ...prev, confirmPassword: error }));
    }
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    getFieldStatus,
    handleSubmit,
    isLoading,
  };
};