import { useActionState } from "react";
import { useAddProjectMemberMutation } from "../../../../features/project/projectApi";
import {
  ProjectRole,
  type ProjectRoleType,
} from "../../../../types/projectRoles";
import { Button } from "../../../../shared/ui/button/button";
import { Input } from "../../../../shared/ui/Input/Input";
import { useParams } from "react-router-dom";

interface IAddMemberState {
  success: boolean;
  data: {
    email: string;
    role: ProjectRoleType;
  };
}

const initialState: IAddMemberState = {
  success: false,
  data: {
    email: "",
    role: ProjectRole.VIEWER,
  },
};

export const AddProjectMember = () => {
  const { projectId } = useParams();
  const [addMemberMutation, { isLoading: isAdding }] =
    useAddProjectMemberMutation();

  const updateFormAction = async (
    previousState: IAddMemberState,
    formData: FormData,
  ) => {
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    const payload = {};
    payload["projectId"] = projectId;
    payload["email"] = email;
    payload["role"] = role;

    await addMemberMutation(payload);

    return {
      success: true,
      data: {
        email,
        role,
      },
    };
  };

  const [state, formAction, isPending] = useActionState(
    updateFormAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">User Email</label>
        <Input
          id={"email"}
          type={"text"}
          defaultValue={state.data.email}
          name="email"
        />
      </div>
      <div>
        <label htmlFor="role">Role</label>
        <select id={"role"} name="role" defaultValue={state.data.role}>
          <option value={"OWNER"}>OWNER</option>
          <option value={"ADMIN"}>ADMIN</option>
          <option value={"MEMBER"}>MEMBER</option>
          <option value={"VIEWER"}>VIEWER</option>
        </select>
      </div>
      <Button variant={"primary"} type="submit" disabled={isAdding}>
        Add member
      </Button>
    </form>
  );
};
