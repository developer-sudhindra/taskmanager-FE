import { useActionState, useEffect, useState, useId } from "react";
import { validateEmail } from "../../../shared/utils/utils";
import { Input } from "../../../shared/ui/Input/Input";
import { Button } from "../../../shared/ui/button/button";
import { useNavigate, Link } from "react-router-dom";
import { loginService } from "./login.service";
import { ErrorMessages } from "../../../shared/ui/ErrorMessage/ErrorMessage";

interface LoginResponse {
  accessToken: string;
}
interface LoginState {
  success: boolean;
  loginResponse: LoginResponse | null;
  value: {
    email: string;
    emailError: string;
    password: string;
    passwordError: string;
  };
}

const initialState: LoginState = {
  success: false,
  loginResponse: null,
  value: {
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
  },
};

interface ApiPayload {
  email: string;
  password: string;
}

const updateLoginStateHandler = async (
  previousState: LoginState,
  formData: FormData,
): Promise<LoginState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors = {
    emailError: "",
    passwordError: "",
  };

  if (!validateEmail(email)) {
    errors.emailError = "Invalid email id";
  }

  if (password.length < 6) {
    errors.passwordError = "Password should contain at least 6 characters";
  }

  if (errors.emailError || errors.passwordError) {
    return {
      success: false,
      loginResponse: null,
      value: {
        email,
        password,
        ...errors,
      },
    };
  }

  try {
    const payload: ApiPayload = {
      email,
      password,
    };
    const response = await loginService(payload);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        loginResponse: null,
        value: {
          email,
          password: "",
          emailError: "",
          passwordError: data.message ?? "Login failed",
        },
      };
    }

    return {
      success: true,
      loginResponse: data,
      value: {
        email,
        password: "",
        emailError: "",
        passwordError: "",
      },
    };
  } catch (error) {
    return {
      success: false,
      loginResponse: null,
      value: {
        email,
        password,
        emailError: "",
        passwordError: "Something went wrong",
      },
    };
  }
};

export const Login = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState("password");

  const baseId = useId();
  const emailFieldId = `${baseId}-email`;
  const passwordFieldId = `${baseId}-password`;

  const [state, updateActionHandler, isPending] = useActionState(
    updateLoginStateHandler,
    initialState,
  );

  useEffect(() => {
    if (state.loginResponse) {
      const { accessToken } = state.loginResponse;
      localStorage.setItem("accessToken", accessToken);
    }
    if (state.success) {
      navigate("/projects");
    }
  }, [state.success, navigate, state.loginResponse]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Please enter your details to sign in
          </p>
        </div>

        <form action={updateActionHandler} className="space-y-5">
          <div className="flex flex-col">
            <label
              htmlFor={emailFieldId}
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Email id
            </label>
            <Input
              type="email"
              id={emailFieldId}
              name="email"
              defaultValue={state.value.email}
              disabled={isPending}
              className={`w-full ${state.value.emailError ? "border-red-400 focus:ring-red-100" : ""}`}
            />
            {state.value.emailError.length > 0 && (
              <ErrorMessages>{state.value.emailError}</ErrorMessages>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor={passwordFieldId}
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <a
                href="#forgot"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  type={inputType}
                  id={passwordFieldId}
                  name="password"
                  defaultValue={state.value.password}
                  disabled={isPending}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="md"
                disabled={isPending}
                onClick={() =>
                  setInputType((previous) =>
                    previous === "password" ? "text" : "password",
                  )
                }
              >
                {inputType === "text" ? "Hide" : "Show"}
              </Button>
            </div>
            {state.value.passwordError.length > 0 && (
              <ErrorMessages>{state.value.passwordError}</ErrorMessages>
            )}
          </div>

          <div className="pt-2">
            <Button
              disabled={isPending}
              type="submit"
              variant="primary"
              size="full"
            >
              {isPending ? "Signing in..." : "Login"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
