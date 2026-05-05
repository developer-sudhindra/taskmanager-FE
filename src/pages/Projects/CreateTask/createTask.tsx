import React, { useState } from "react";
import { Button } from "../../../shared/ui/button/button";
import { Input } from "../../../shared/ui/Input/Input";
import { Textarea } from "../../../shared/ui/Textarea/Textarea";
import { PageTitle } from "../../../shared/ui/PageTitle/PageTitle";
import { useParams, useNavigate } from "react-router-dom";
export const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { projectId } = useParams();
  const navigate = useNavigate();

  const createTask = () => {
    const payload = JSON.stringify({
      title: title,
      description: description,
      status: "OPEN",
      projectId: projectId,
    });
    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        navigate(`/projects/${projectId}`);
      });
  };

  const updateFormValues = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  return (
    <div className="border border-surface rounded-md p-[16px]">
      <PageTitle>Create New Task</PageTitle>
      <form>
        <label>Title</label>
        <Input
          placeholder="Task Title"
          name="title"
          onChange={updateFormValues}
          value={title}
        />
        <label>Description</label>
        <Textarea
          placeholder="Task Description"
          name="description"
          onChange={updateFormValues}
          value={description}
        />
        <Button variant="primary" onClick={createTask} type="button">
          Create Task
        </Button>
      </form>
    </div>
  );
};
