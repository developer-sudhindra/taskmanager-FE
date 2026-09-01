import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  useGetAllProjectMemberQuery,
  useUpdateProjectMemberMutation,
  useRemoveMemberFromProjectMutation,
} from "../../features/project/projectApi";
import { ProjectRole } from "../../types/projectRoles";
import { Button } from "../../shared/ui/button/button";

// Dynamic badge styling supporting both Light and Dark theme modes seamlessly
const getRoleBadgeStyles = (role: string) => {
  switch (role?.toUpperCase()) {
    case "OWNER":
      return "bg-purple-500/10 text-purple-600 DARK:text-purple-400 border-purple-500/30";
    case "ADMIN":
      return "bg-blue-500/10 text-blue-600 DARK:text-blue-400 border-blue-500/30";
    case "MEMBER":
      return "bg-green-500/10 text-green-600 DARK:text-green-400 border-green-500/30";
    case "VIEWER":
    default:
      return "bg-slate-500/10 text-slate-600 DARK:text-slate-400 border-slate-500/30";
  }
};

// Indicator dot themes for the contextual popover list rows
const getRoleDotStyles = (role: string) => {
  switch (role?.toUpperCase()) {
    case "OWNER":
      return "bg-purple-500";
    case "ADMIN":
      return "bg-blue-500";
    case "MEMBER":
      return "bg-green-500";
    default:
      return "bg-slate-400";
  }
};

export const ProjectMember = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [updateRoleMutation, { isLoading: isUpdating }] =
    useUpdateProjectMemberMutation();
  const [removeMemberFromProjectMutation, {}] =
    useRemoveMemberFromProjectMutation();
  const navigate = useNavigate();

  // Track which unique member card dropdown menu container is currently active
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data: members = [],
    isLoading,
    error,
  } = useGetAllProjectMemberQuery(projectId ?? skipToken);

  // Automatically dismiss active open dropdown layers if a user clicks outside the dashboard arena
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleSelect = async (
    memberId: string, // This is the ProjectMember row ID (e.g. "3429b831...")
    newRole: string,
    currentRole: string,
  ) => {
    setOpenMenuId(null); // Snap dropdown menu closed instantly
    if (newRole === currentRole) return;

    // 1. FIXED: Find the matching member in your list using the memberId string
    const selectedMember = members.find((m) => m.id === memberId);

    // Safety boundary check to prevent crashes if something goes wrong
    if (!selectedMember || !selectedMember.user) {
      console.error("Could not find the target member profile metadata");
      return;
    }

    try {
      console.log(
        `Patching role update request. Member: ${memberId}, New Role: ${newRole}`,
      );

      // 2. FIXED: Now selectedMember is defined, so pulling .user.id works perfectly!
      const payload = {
        projectId,
        userId: selectedMember.user.id, // Passes the true User UUID expected by the backend
        role: newRole,
      };

      await updateRoleMutation(payload).unwrap();
    } catch (err) {
      console.error(
        "Failed to alter project membership constraint layers:",
        err,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 text-center text-muted font-medium animate-pulse">
        Loading project members...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 text-center text-red-400 font-medium">
        Failed to load project teammates. Please try again later.
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 text-center text-muted font-medium">
        No members found in this project workspace.
      </div>
    );
  }

  const removeMemberFromProject = async (memberId: string) => {
    await removeMemberFromProjectMutation({ projectId, memberId }).unwrap();
  };

  return (
    <div className="w-full max-w-6xl mx-auto" ref={containerRef}>
      <div className="pb-6 flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate(`/projects/${projectId}/project-member/add`)}
        >
          Add new member
        </Button>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text tracking-tight">
          Project Teammates
        </h2>
        <p className="text-sm text-muted mt-1">
          Manage users and access permissions for this workspace
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const { user, role, id } = member;
          const firstLetter = user?.name
            ? user.name.charAt(0).toUpperCase()
            : "?";
          const isMenuOpen = openMenuId === id;

          return (
            <div
              key={id}
              className="bg-surface border border-border rounded-xl shadow-sm p-5 flex flex-col justify-between relative group"
            >
              <div>
                {/* Identity Header row */}
                <div className="flex justify-between items-start mb-4">
                  {user?.avatarURL ? (
                    <img
                      src={user.avatarURL}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {firstLetter}
                    </div>
                  )}

                  {/* Badges Stack panel */}
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getRoleBadgeStyles(
                        role,
                      )}`}
                    >
                      {role}
                    </span>
                    {user?.status === "INVITED" && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-medium tracking-wide">
                        Pending Invite
                      </span>
                    )}
                  </div>
                </div>

                {/* Identity Metadata Information block text tags */}
                <div className="mb-6">
                  <h3 className="font-bold text-text text-base tracking-tight truncate">
                    {user?.name || "Unknown User"}
                  </h3>
                  <p className="text-sm text-muted truncate mt-0.5 select-all">
                    {user?.email || "No email available"}
                  </p>
                </div>
              </div>

              {/* Bottom Card Control Panel panel button bars */}
              <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto relative">
                <div className="flex-1 relative">
                  <button
                    type="button"
                    disabled={role?.toUpperCase() === "OWNER"}
                    onClick={() => setOpenMenuId(isMenuOpen ? null : id)}
                    className="w-full text-xs font-semibold py-2 px-3 bg-bg hover:bg-surface text-text rounded-lg border border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <span>Manage Role</span>
                    <span className="text-[10px] opacity-60">▼</span>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute bottom-full left-0 w-48 mb-2 bg-surface border border-border rounded-xl shadow-xl z-50 py-1.5">
                      {(Object.values(ProjectRole) as string[]).map(
                        (roleOption: string) => (
                          <button
                            key={roleOption}
                            type="button"
                            disabled={roleOption === "OWNER"}
                            onClick={() =>
                              handleRoleSelect(id, roleOption, role)
                            }
                            className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs font-medium transition-colors ${
                              roleOption === "OWNER"
                                ? "opacity-40 cursor-not-allowed hidden"
                                : "hover:bg-bg"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${getRoleDotStyles(roleOption)}`}
                              />

                              <span className="text-text">{roleOption}</span>
                            </div>
                            {role === roleOption && (
                              <span className="text-blue-500 font-bold">✓</span>
                            )}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={role?.toUpperCase() === "OWNER"}
                  onClick={() => removeMemberFromProject(id)}
                  className="text-xs font-semibold py-2 px-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
