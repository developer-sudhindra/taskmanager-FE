import { useActionState, useEffect, useState } from "react";
import { validateEmail } from "../../../shared/utils/utils";
import { Input } from "../../../shared/ui/Input/Input";
import { Button } from "../../../shared/ui/button/button";
import { useNavigate } from "react-router-dom";
import { FormWrapper } from "../FormWrapper/FormWrapper";
import { loginService } from "./login.service";
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
  }, [state.success]);

  return (
    <>
      <FormWrapper>
        <h1>User Login</h1>
        <form action={updateActionHandler}>
          <div className="mb-[15px]">
            <label htmlFor="email">Email id</label>
            <Input
              type={"email"}
              id={"email"}
              name={"email"}
              defaultValue={state.value.email}
            />
            {state.value.emailError.length > 0 && (
              <span>{state.value.emailError}</span>
            )}
          </div>
          <div className="mb-[15px]">
            <label htmlFor="password" className="font-regular">
              Password
            </label>
            <div className="flex ">
              <Input
                type={inputType}
                id="password"
                name="password"
                defaultValue={state.value.password}
              />
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() =>
                  setInputType((previous) =>
                    previous === "password" ? "text" : "password",
                  )
                }
              >
                {inputType === "text" ? "T" : "P"}
              </Button>
            </div>
          </div>
          {state.value.passwordError.length > 0 && (
            <span>{state.value.passwordError}</span>
          )}
          <div>
            <Button
              disabled={isPending}
              type={"submit"}
              onClick={() => {}}
              variant={"primary"}
              size="full"
            >
              Login
            </Button>
          </div>
        </form>
      </FormWrapper>
    </>
  );
};
