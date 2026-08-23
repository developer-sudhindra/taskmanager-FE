import { useActionState, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "../../../shared/ui/Input/Input";
import { Button } from "../../../shared/ui/button/button";
import { useSetGostUserPasswordMutation } from "../../../features/user/usersApi";
interface IUpdateInitialState {
  success: boolean;
  data: {
    newPassword: string;
    newPasswordError: string;
    confirmPassword: string;
    confirmPasswordErrror: string;
  };
}

const initialState: IUpdateInitialState = {
  success: false,
  data: {
    newPassword: "",
    newPasswordError: "",
    confirmPassword: "",
    confirmPasswordErrror: "",
  },
};

export const UpdateGostPassword = () => {
  const { emailId } = useParams();
  const [newPasswordInputType, setNewPasswordInputType] = useState("password");
  const [confirmPasswordInputType, setConfirmPasswordInputType] =
    useState("password");

  const [updatPasswordMutation, { isLoading }] =
    useSetGostUserPasswordMutation();

  const formUpdateAction = (
    previousState: IUpdateInitialState,
    formData: FormData,
  ) => {
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const errors = {
      newPasswordError: "",
      confirmPasswordErrror: "",
    };

    if (newPassword.trim().length < 6) {
      errors.newPasswordError =
        "password length should not be less than 6 character";
    }

    if (confirmPassword.trim() !== newPassword.trim()) {
      errors.confirmPasswordErrror =
        "new password and confirm password should be same";
    }

    if (Object.values(errors).some(Boolean)) {
      return {
        success: false,
        data: {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
          ...errors,
        },
      };
    }

    try {
      const payload = {};
      payload["email"] = emailId;
      payload["password"] = newPassword;
      updatPasswordMutation(payload);

      return {
        success: true,
        data: {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
          newPasswordError: "",
          confirmPasswordErrror: "",
        },
      };
    } catch (error) {
      return {
        success: false,
        data: {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
          newPasswordError: "",
          confirmPasswordErrror: "Password error",
        },
      };
    }
  };

  const [state, updateAction, isPending] = useActionState(
    formUpdateAction,
    initialState,
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Update your password
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Update your password to manage task flow
          </p>
        </div>
        <form action={updateAction} className="space-y-5">
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              New password
            </label>
            <div className="flex gap-2">
              <Input type={newPasswordInputType} name={"newPassword"} />
              <Button
                type="button"
                size="md"
                variant="outline"
                onClick={() =>
                  setNewPasswordInputType((previousState) =>
                    previousState === "text" ? "password" : "text",
                  )
                }
              >
                {newPasswordInputType === "text" ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Confirm password
            </label>
            <div className="flex gap-2">
              <Input type={confirmPasswordInputType} name={"confirmPassword"} />
              <Button
                type="button"
                size="md"
                variant="outline"
                onClick={() =>
                  setConfirmPasswordInputType((previousState) =>
                    previousState === "text" ? "password" : "text",
                  )
                }
              >
                {newPasswordInputType === "text" ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          <div>
            <Button type="submit" size="full" variant="primary">
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
