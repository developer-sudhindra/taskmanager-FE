import { useActionState, useEffect } from "react";
import { Input } from "../../../shared/ui/Input/Input";
import { Button } from "../../../shared/ui/button/button";
import { validateUserName, validateEmail } from "../../../shared/utils/utils";
import { useNavigate } from "react-router-dom";
import { registerService } from "./service";
import { FormWrapper } from "../FormWrapper/FormWrapper";
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
  const [state, updateStateAction, isPending] = useActionState(
    updateFormStateAction,
    registerInitialState,
  );

  useEffect(() => {
    if (state.isUserCreated) {
      navigate("/login");
    }
  }, [state.isUserCreated]);

  return (
    <FormWrapper>
      <h1>User Registration</h1>
      <form action={updateStateAction}>
        {state.value.nameError}
        {state.value.emailError}
        {state.value.passwordError}
        {state.value.confirmPasswordError}
        <div className="mb-[15px]">
          <label htmlFor="name">User name</label>
          <Input
            type={"text"}
            id={"name"}
            name={"name"}
            defaultStage={state.value.name}
            required
          />
        </div>
        <div className="mb-[15px]">
          <label htmlFor="email">Company emai id</label>
          <Input
            type={"email"}
            id={"email"}
            name={"email"}
            defaultState={state.value.email}
            required
          />
        </div>
        <div className="mb-[15px]">
          <label htmlFor="password">Password</label>
          <Input
            type={"password"}
            id={"password"}
            name={"password"}
            defaultState={state.value.password}
            required
          />
        </div>
        <div className="mb-[15px]">
          <label htmlFor="confirmPassword">Confirm password</label>
          <Input
            type={"password"}
            id={"confirmPassword"}
            name={"confirmPassword"}
            defaultState={state.value.confirmPassword}
            required
          />
        </div>
        <Button
          disabled={isPending}
          type="submit"
          variant="primary"
          size="full"
          onClick={() => {}}
        >
          Register
        </Button>
      </form>
    </FormWrapper>
  );
};
