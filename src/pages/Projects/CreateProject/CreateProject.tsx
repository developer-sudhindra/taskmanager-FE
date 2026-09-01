import { useActionState, useCallback, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../shared/ui/button/button";
import { Input } from "../../../shared/ui/Input/Input";
import { Textarea } from "../../../shared/ui/Textarea/Textarea";
import { Select } from "../../../shared/ui/Select/Select";
import { PageTitle } from "../../../shared/ui/PageTitle/PageTitle";
import { ErrorMessages } from "../../../shared/ui/ErrorMessage/ErrorMessage";

import { useCreateProjectMutation } from "../../../features/project/projectApi";

interface CreateProjectState {
  success: boolean;

  values: {
    projectName: string;
    projectNameError: string;

    description: string;
    descriptionError: string;

    projectKey: string;
    projectKeyError: string;

    color: string;
    colorError: string;

    swimlaneCount: string;
    swimlaneValues: string[];
    swimlaneError: string;
  };
}

const createProjectInitialState: CreateProjectState = {
  success: false,

  values: {
    projectName: "",
    projectNameError: "",

    description: "",
    descriptionError: "",

    projectKey: "",
    projectKeyError: "",

    color: "",
    colorError: "",

    swimlaneCount: "3",
    swimlaneValues: ["", "", ""],
    swimlaneError: "",
  },
};

export const CreateProject = () => {
  const navigate = useNavigate();

  const [createProjectMutation, { isLoading: isMutating }] =
    useCreateProjectMutation();

  const baseId = useId();

  /**
   * Local state is used for dynamically adding/removing
   * swimlane input fields.
   */
  const [swimlaneCount, setSwimlaneCount] = useState<number>(3);

  const [swimlaneValues, setSwimlaneValues] = useState<string[]>(["", "", ""]);

  /**
   * Form action
   */
  const updateFormAction = useCallback(
    async (
      _: CreateProjectState,
      formData: FormData,
    ): Promise<CreateProjectState> => {
      const projectName = (formData.get("projectName") as string) || "";

      const projectDescription = (formData.get("description") as string) || "";

      const projectKey = (formData.get("projectKey") as string) || "";

      const color = (formData.get("projectColor") as string) || "";

      const swimlaneCountValue =
        (formData.get("swimlaneCount") as string) || "3";

      const count = Number(swimlaneCountValue);

      /**
       * Get all swimlane names from FormData
       */
      const swimlaneValues = Array.from({ length: count }, (_, index) =>
        ((formData.get(`swimlane_${index}`) as string) || "").trim(),
      );

      const errors = {
        projectNameError: "",
        descriptionError: "",
        projectKeyError: "",
        colorError: "",
        swimlaneError: "",
      };

      /**
       * Project name validation
       */
      if (projectName.trim().length < 2) {
        errors.projectNameError =
          "Project name must contain at least 2 characters.";
      }

      /**
       * Description validation
       */
      if (projectDescription.trim().length < 2) {
        errors.descriptionError =
          "Project description must contain at least 2 characters.";
      }

      /**
       * Project key validation
       */
      if (projectKey.trim().length < 2) {
        errors.projectKeyError =
          "Project key must contain at least 2 characters.";
      }

      /**
       * Color validation
       */
      if (!color) {
        errors.colorError = "Please select a project color.";
      }

      /**
       * Swimlane validation
       */
      if (swimlaneValues.some((value) => value.length < 1)) {
        errors.swimlaneError = "Please enter a name for every swimlane.";
      }

      /**
       * Return validation errors
       */
      if (Object.values(errors).some(Boolean)) {
        return {
          success: false,

          values: {
            projectName,
            description: projectDescription,

            projectKey,
            color,

            swimlaneCount: swimlaneCountValue,
            swimlaneValues,

            ...errors,
          },
        };
      }

      try {
        /**
         * API payload
         */
        const payload = {
          name: projectName.trim(),

          description: projectDescription.trim(),

          projectKey: projectKey.trim().toUpperCase(),

          color,

          swimlaneCount: count,

          swimlanes: swimlaneValues,
        };

        console.log("Create Project Payload:", payload);

        await createProjectMutation(payload).unwrap();

        /**
         * Successful response
         */
        return {
          success: true,

          values: {
            projectName,

            description: projectDescription,

            projectKey,

            color,

            swimlaneCount: swimlaneCountValue,

            swimlaneValues,

            projectNameError: "",

            descriptionError: "",

            projectKeyError: "",

            colorError: "",

            swimlaneError: "",
          },
        };
      } catch (error) {
        console.error("Failed to create project:", error);

        return {
          success: false,

          values: {
            projectName,

            description: projectDescription,

            projectKey,

            color,

            swimlaneCount: swimlaneCountValue,

            swimlaneValues,

            projectNameError: "",

            descriptionError: "Failed to create project.",

            projectKeyError: "",

            colorError: "",

            swimlaneError: "",
          },
        };
      }
    },
    [createProjectMutation],
  );

  /**
   * React 19 useActionState
   */
  const [state, updateAction, isActionPending] = useActionState(
    updateFormAction,
    createProjectInitialState,
  );

  /**
   * Navigate after successful creation
   */
  useEffect(() => {
    if (state.success) {
      navigate("/projects");
    }
  }, [state.success, navigate]);

  /**
   * Combined loading state
   */
  const isPending = isActionPending || isMutating;

  /**
   * Handle swimlane count change
   */
  const handleSwimlaneCountChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const count = Number(event.target.value);

    setSwimlaneCount(count);

    /**
     * Preserve existing swimlane names
     * when increasing/decreasing the count.
     */
    setSwimlaneValues((previousValues) =>
      Array.from({ length: count }, (_, index) => previousValues[index] || ""),
    );
  };

  /**
   * Handle swimlane name change
   */
  const handleSwimlaneChange = (index: number, value: string) => {
    setSwimlaneValues((previousValues) => {
      const newValues = [...previousValues];

      newValues[index] = value;

      return newValues;
    });
  };

  return (
    <div className="min-h-screen bg-bg text-text px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Main Card */}
        <div className="rounded-xl border border-border bg-surface shadow-sm">
          {/* Header */}
          <div className="border-b border-border px-6 py-6">
            <PageTitle>Create New Project</PageTitle>

            <p className="mt-2 text-sm text-muted">
              Provide an initialization name and core descriptive objectives for
              this workspace.
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            <form action={updateAction} className="space-y-6">
              {/* =========================================
                  PROJECT NAME
              ========================================= */}
              <div className="flex flex-col">
                <label
                  htmlFor={`projectName_${baseId}`}
                  className="mb-1.5 block text-sm font-semibold text-text"
                >
                  Project Name
                </label>

                <Input
                  id={`projectName_${baseId}`}
                  name="projectName"
                  type="text"
                  placeholder="e.g., Q3 Marketing Dashboard"
                  defaultValue={state.values.projectName}
                  disabled={isPending}
                  className={`w-full ${
                    state.values.projectNameError
                      ? "border-red-400 focus:ring-red-100"
                      : ""
                  }`}
                />

                {state.values.projectNameError && (
                  <div className="mt-1">
                    <ErrorMessages>
                      {state.values.projectNameError}
                    </ErrorMessages>
                  </div>
                )}
              </div>

              {/* =========================================
                  PROJECT DESCRIPTION
              ========================================= */}
              <div className="flex flex-col">
                <label
                  htmlFor={`projectDescription_${baseId}`}
                  className="mb-1.5 block text-sm font-semibold text-text"
                >
                  Project Description
                </label>

                <Textarea
                  id={`projectDescription_${baseId}`}
                  name="description"
                  placeholder="Outline the operational tracking parameters for this project..."
                  defaultValue={state.values.description}
                  disabled={isPending}
                  rows={4}
                  className={`w-full ${
                    state.values.descriptionError
                      ? "border-red-400 focus:ring-red-100"
                      : ""
                  }`}
                />

                {state.values.descriptionError && (
                  <div className="mt-1">
                    <ErrorMessages>
                      {state.values.descriptionError}
                    </ErrorMessages>
                  </div>
                )}
              </div>

              {/* =========================================
                  PROJECT KEY
              ========================================= */}
              <div className="flex flex-col">
                <label
                  htmlFor={`projectKey_${baseId}`}
                  className="mb-1.5 block text-sm font-semibold text-text"
                >
                  Project Key
                </label>

                <Input
                  id={`projectKey_${baseId}`}
                  name="projectKey"
                  type="text"
                  placeholder="PRO"
                  defaultValue={state.values.projectKey}
                  disabled={isPending}
                  maxLength={10}
                  className={`w-full uppercase ${
                    state.values.projectKeyError
                      ? "border-red-400 focus:ring-red-100"
                      : ""
                  }`}
                />

                <p className="mt-1 text-xs text-muted">
                  A short unique identifier for your project. Example: PRO, CRM,
                  APP.
                </p>

                {state.values.projectKeyError && (
                  <div className="mt-1">
                    <ErrorMessages>
                      {state.values.projectKeyError}
                    </ErrorMessages>
                  </div>
                )}
              </div>

              {/* =========================================
                  PROJECT COLOR
              ========================================= */}
              <div className="flex flex-col">
                <label
                  htmlFor={`projectColor_${baseId}`}
                  className="mb-1.5 block text-sm font-semibold text-text"
                >
                  Project Color
                </label>

                <Select
                  id={`projectColor_${baseId}`}
                  name="projectColor"
                  defaultValue={state.values.color}
                  disabled={isPending}
                >
                  <option value="">Select project color</option>

                  <option value="#fb2629">Red</option>

                  <option value="#f59e0b">Orange</option>

                  <option value="#eab308">Yellow</option>

                  <option value="#22c55e">Green</option>

                  <option value="#06b6d4">Cyan</option>

                  <option value="#3b82f6">Blue</option>

                  <option value="#6366f1">Indigo</option>

                  <option value="#8b5cf6">Purple</option>

                  <option value="#ec4899">Pink</option>
                </Select>

                {state.values.colorError && (
                  <div className="mt-1">
                    <ErrorMessages>{state.values.colorError}</ErrorMessages>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-5">
                {/* Swimlane Count */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`swimlaneCount_${baseId}`}
                    className="mb-1.5 block text-sm font-semibold text-text"
                  >
                    Swimlane Count
                  </label>

                  <Select
                    id={`swimlaneCount_${baseId}`}
                    name="swimlaneCount"
                    value={swimlaneCount}
                    onChange={handleSwimlaneCountChange}
                    disabled={isPending}
                  >
                    <option value="3">3 Swimlanes</option>

                    <option value="4">4 Swimlanes</option>

                    <option value="5">5 Swimlanes</option>
                  </Select>

                  <p className="mt-1 text-xs text-muted">
                    Select the number of workflow swimlanes for this project.
                  </p>
                </div>

                {/* Swimlane Names */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-text">
                      Swimlane Names
                    </h3>

                    <p className="mt-1 text-xs text-muted">
                      Give each swimlane a meaningful name.
                    </p>
                  </div>

                  {/* Dynamic Inputs */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {swimlaneValues.map((value, index) => (
                      <div key={`swimlane-${index}`} className="flex flex-col">
                        <label
                          htmlFor={`swimlane_${baseId}_${index}`}
                          className="mb-1.5 block text-sm font-medium text-text"
                        >
                          Swimlane {index + 1}
                        </label>

                        <Input
                          id={`swimlane_${baseId}_${index}`}
                          name={`swimlane_${index}`}
                          type="text"
                          value={value}
                          placeholder={`Enter swimlane ${index + 1} name`}
                          disabled={isPending}
                          onChange={(event) =>
                            handleSwimlaneChange(index, event.target.value)
                          }
                          className={`w-full ${
                            state.values.swimlaneError && !value.trim()
                              ? "border-red-400 focus:ring-red-100"
                              : ""
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {state.values.swimlaneError && (
                    <div className="mt-1">
                      <ErrorMessages>
                        {state.values.swimlaneError}
                      </ErrorMessages>
                    </div>
                  )}
                </div>
              </div>

              {/* =========================================
                  ACTION FOOTER
              ========================================= */}
              <div className="mt-8 flex items-center justify-end gap-4 border-t border-border pt-6">
                <Button
                  type="button"
                  onClick={() => navigate("/projects")}
                  variant="secondary"
                  disabled={isPending}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isPending} variant="primary">
                  {isPending ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
