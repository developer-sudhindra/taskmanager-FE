import { useActionState, useEffect, useId } from "react";
import { useAddProjectMemberMutation } from "../../../../features/project/projectApi";
import {
  ProjectRole,
  type ProjectRoleType,
} from "../../../../types/projectRoles";
import { Button } from "../../../../shared/ui/button/button";
import { Input } from "../../../../shared/ui/Input/Input";
import { Select } from "../../../../shared/ui/Select/Select";
import { useParams, useNavigate } from "react-router-dom";

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
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [addMemberMutation, { isLoading: isAdding }] =
    useAddProjectMemberMutation();

  // React 19 Accessibility Scoping Identifiers
  const baseId = useId();
  const emailFieldId = `${baseId}-email`;
  const roleFieldId = `${baseId}-role`;

  const updateFormAction = async (
    previousState: IAddMemberState,
    formData: FormData,
  ) => {
    const email = formData.get("email") as string;
    const role = formData.get("role") as ProjectRoleType;

    const payload = {
      projectId,
      email,
      role,
    };

    try {
      // unwrap() captures standard API exceptions locally if needed
      await addMemberMutation(payload).unwrap();
      return {
        success: true,
        data: { email, role },
      };
    } catch (error) {
      console.error("Failed to provision ghost user invitation:", error);
      return {
        success: false,
        data: { email, role },
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    updateFormAction,
    initialState,
  );

  // Automated layout redirection hook upon form action completion
  useEffect(() => {
    if (state.success) {
      navigate(-1);
    }
  }, [state.success, navigate]);

  return (
    // Outer canvas backdrop aligning card cleanly across theme states
    <>
      <div>
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
      <div className=" w-full flex items-center justify-center bg-bg px-4 py-12">
        {/* Centered Modal Content Container */}
        <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-md p-8">
          {/* Header Branding Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text tracking-tight">
              Add Team Member
            </h2>
            <p className="text-sm text-muted mt-1">
              Invite a new user to collaborate in this workspace
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            {/* Email input field block layout container */}
            <div className="flex flex-col">
              <label
                htmlFor={emailFieldId}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                User Email
              </label>
              <Input
                id={emailFieldId}
                type="email"
                defaultValue={state.data.email}
                name="email"
                disabled={isPending || isAdding}
                placeholder="teammate@company.com"
                className="w-full"
              />
            </div>

            {/* Role selection dropdown block layout container */}
            <div className="flex flex-col">
              <label
                htmlFor={roleFieldId}
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Role
              </label>
              <Select
                id={roleFieldId}
                name="role"
                defaultValue={state.data.role}
                disabled={isPending || isAdding}
                className="w-full"
              >
                <option value="OWNER">OWNER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MEMBER">MEMBER</option>
                <option value="VIEWER">VIEWER</option>
              </Select>
            </div>

            {/* Bottom Interactive Workflow Action Links */}
            <div className="flex items-center gap-4 pt-4 border-t border-border mt-6">
              <Button
                variant="outline"
                type="button" // 🚨 FIXED: Changed to type="button" so it never triggers accidental submissions
                onClick={() => navigate(-1)}
                disabled={isPending || isAdding}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                type="submit"
                disabled={isPending || isAdding}
              >
                {isPending || isAdding ? "Adding..." : "Add member"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
