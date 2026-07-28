import { useActionState } from "react";
import { FormWrapper } from "../FormWrapper/FormWrapper";
import { Input } from "../../../shared/ui/Input/Input";
import { Button } from "../../../shared/ui/button/button";
import { updatePassword } from "../auth.service";

interface IUpdatePassword {
  success: boolean;
  values: {
    currentPassword: string;
    newPassword: string;
    confirmPassord: string;
    currentPasswordError: string;
    newPasswordError: string;
    confirmPasswordError: string;
  };
}

const initalState: IUpdatePassword = {
  success: false,
  values: {
    currentPassword: "",
    newPassword: "",
    confirmPassord: "",
    currentPasswordError: "",
    newPasswordError: "",
    confirmPasswordError: "",
  },
};

const updateAction = async (
  previousState: IUpdatePassword,
  formData: FormData,
) => {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors = {
    currentPasswordError: "",
    newPasswordError: "",
    confirmPasswordError: "",
  };

  if (currentPassword.length < 3) {
    errors.currentPasswordError = "Password must be greater than 3 character";
  }

  if (newPassword.length < 3) {
    errors.newPasswordError = "New password must be greater than 3 character";
  }

  if (currentPassword === newPassword) {
    errors.newPasswordError = "current and new password is same";
  }

  if (newPassword !== confirmPassword) {
    errors.confirmPasswordError = "new and confirm password should be same";
  }

  if (Object.values(errors).some(Boolean)) {
    return {
      success: false,
      values: {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassord: confirmPassword,
        ...errors,
      },
    };
  }

  try {
    const payload = {
      oldPassword: currentPassword,
      newPassword: newPassword,
    };
    const response = await updatePassword(payload);

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      return {
        success: false,
        values: {
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmPassord: confirmPassword,
          currentPasswordError: "Failed to create password",
          newPasswordError: "",
          confirmPasswordError: "",
        },
      };
    }

    return {
      success: true,
      values: {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassord: confirmPassword,
        currentPasswordError: "",
        newPasswordError: "",
        confirmPasswordError: "",
      },
    };
  } catch (error) {
    return {
      success: false,
      values: {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassord: confirmPassword,
        currentPasswordError: "Failed to create password",
        newPasswordError: "",
        confirmPasswordError: "",
      },
    };
  }
};

export const UpdatePassword = () => {
  const [state, formAction, isPending] = useActionState(
    updateAction,
    initalState,
  );
  return (
    <form action={formAction}>
      <div>
        <label>Current Password</label>
        <Input
          type={"password"}
          name={"currentPassword"}
          required={true}
          defaltValue={state.values.currentPassword}
        />
      </div>
      <div>
        <label>New Password</label>
        <Input
          type={"password"}
          name={"newPassword"}
          required={true}
          defaultValue={state.values.newPassword}
        />
      </div>
      <div>
        <label>Confirm Password</label>
        <Input
          type={"password"}
          name={"confirmPassword"}
          required={true}
          defaultValue={state.values.confirmPassord}
        />
      </div>
      <Button
        variant="primary"
        size="full"
        type={"submit"}
        disabled={isPending}
      >
        Update password
      </Button>
    </form>
  );
};
