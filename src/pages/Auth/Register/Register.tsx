import { useActionState, useEffect, useId } from "react";
import { Input } from "../../../shared/ui/Input/Input";
import { Button } from "../../../shared/ui/button/button";
import { validateUserName, validateEmail } from "../../../shared/utils/utils";
import { useNavigate, Link } from "react-router-dom"; // Added Link for navigation footer
import { registerService } from "./service";
import { ErrorMessages } from "../../../shared/ui/ErrorMessage/ErrorMessage"; // Leveraged your error component

const MIN_PASSWORD_LENGTH = 2;

interface RegisterState {
  isUserCreated: boolean;
  value: {
    name: string;
    nameError: string;
    email: string;
    emailError: string;
    password: string;
    confirmPassword: string;
    passwordError: string;
    confirmPasswordError: string;
  };
}

const registerInitialState = {
  isUserCreated: false,
  value: {
    name: "",
    nameError: "",
    email: "",
    emailError: "",
    password: "",
    confirmPassword: "",
    passwordError: "",
    confirmPasswordError: "",
  },
};

const updateFormStateAction = async (
  previousState: RegisterState,
  formData: FormData,
) => {
  const userName = formData.get("name") as string;
  const userEmail = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  let errors = {
    nameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  };

  if (!validateUserName(userName)) {
    errors.nameError = "Invalid user name";
  }

  if (!validateEmail(userEmail)) {
    errors.emailError = "Invalid email";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.passwordError = "password should not be less than 6 character";
  }

  if (password !== confirmPassword) {
    errors.confirmPasswordError = "password and confirm should be same";
  }

  if (Object.values(errors).some(Boolean)) {
    return {
      isUserCreated: false,
      value: {
        name: userName,
        email: userEmail,
        password,
        confirmPassword,
        ...errors,
      },
    };
  }

  try {
    const payload = {
      name: userName,
      email: userEmail,
      password: password,
    };

    const response = await registerService(payload);

    const data = await response.json();

    if (!response.ok) {
      return {
        isUserCreated: false,
        value: {
          name: userName,
          email: userEmail,
          password,
          confirmPassword,
          nameError: "",
          emailError: data.message ?? "Registration failed",
          passwordError: "",
          confirmPasswordError: "",
        },
      };
    }
    return {
      isUserCreated: true,
      value: {
        name: userName,
        email: userEmail,
        password,
        confirmPassword,
        nameError: "",
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      isUserCreated: false,
      value: {
        name: userName,
        email: userEmail,
        password: password,
        confirmPassword: confirmPassword,
        nameError: "",
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
      },
    };
  }
};

export const Register = () => {
  const navigate = useNavigate();

  // React 19 accessibility identifiers for form inputs
  const baseId = useId();
  const nameId = `${baseId}-name`;
  const emailId = `${baseId}-email`;
  const passwordId = `${baseId}-password`;
  const confirmPasswordId = `${baseId}-confirm-password`;

  const [state, updateStateAction, isPending] = useActionState(
    updateFormStateAction,
    registerInitialState,
  );

  useEffect(() => {
    if (state.isUserCreated) {
      navigate("/login");
    }
  }, [state.isUserCreated, navigate]);

  return (
    // Centered gray canvas backdrop container matching the login page layout
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 py-12">
      {/* Centered White Card Bounding Box Container */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-slate-100 p-8">
        {/* Title Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            User Registration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create an account to manage your projects and tasks
          </p>
        </div>

        {/* Form elements render natively inside the card boundary block layout */}
        <form action={updateStateAction} className="space-y-5">
          {/* User Name input field block */}
          <div className="flex flex-col">
            <label
              htmlFor={nameId}
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              User name
            </label>
            <Input
              type="text"
              id={nameId}
              name="name"
              defaultStage={state.value.name}
              disabled={isPending}
              required
              className={`w-full ${state.value.nameError ? "border-red-400 focus:ring-red-100" : ""}`}
            />
            {state.value.nameError.length > 0 && (
              <ErrorMessages>{state.value.nameError}</ErrorMessages>
            )}
          </div>

          {/* Email input field block */}
          <div className="flex flex-col">
            <label
              htmlFor={emailId}
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Company email id
            </label>
            <Input
              type="email"
              id={emailId}
              name="email"
              defaultState={state.value.email}
              disabled={isPending}
              required
              className={`w-full ${state.value.emailError ? "border-red-400 focus:ring-red-100" : ""}`}
            />
            {state.value.emailError.length > 0 && (
              <ErrorMessages>{state.value.emailError}</ErrorMessages>
            )}
          </div>

          {/* Password input field block */}
          <div className="flex flex-col">
            <label
              htmlFor={passwordId}
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Password
            </label>
            <Input
              type="password"
              id={passwordId}
              name="password"
              defaultState={state.value.password}
              disabled={isPending}
              required
              className={`w-full ${state.value.passwordError ? "border-red-400 focus:ring-red-100" : ""}`}
            />
            {state.value.passwordError.length > 0 && (
              <ErrorMessages>{state.value.passwordError}</ErrorMessages>
            )}
          </div>

          {/* Confirm Password input field block */}
          <div className="flex flex-col">
            <label
              htmlFor={confirmPasswordId}
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Confirm password
            </label>
            <Input
              type="password"
              id={confirmPasswordId}
              name="confirmPassword"
              defaultState={state.value.confirmPassword}
              disabled={isPending}
              required
              className={`w-full ${state.value.confirmPasswordError ? "border-red-400 focus:ring-red-100" : ""}`}
            />
            {state.value.confirmPasswordError.length > 0 && (
              <ErrorMessages>{state.value.confirmPasswordError}</ErrorMessages>
            )}
          </div>

          {/* Submission Action Button */}
          <div className="pt-2">
            <Button
              disabled={isPending}
              type="submit"
              variant="primary"
              size="full"
            >
              {isPending ? "Creating account..." : "Register"}
            </Button>
          </div>
        </form>

        {/* Redirection link back to the login page view */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
