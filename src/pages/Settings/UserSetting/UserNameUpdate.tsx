import { useEffect, useState } from "react";
import { getUserName, updateUserName } from "../settings.service";
import { Input } from "../../../shared/ui/Input/Input";
import { Button } from "../../../shared/ui/button/button";

export const UpdateUserName = () => {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    getUserName()
      .then((response) => response.json())
      .then((data) => {
        setUserName(data.userName);
      });
  }, []);

  const updateUserNameHandler = () => {
    const payload = {
      userName: userName,
    };
    updateUserName(payload);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="userName" className="mb-[15px]">
        Update Name
      </label>
      <div className="flex max-w-[500px] gap-[20px]">
        <Input
          id={"userName"}
          type={"text"}
          onChange={(event) => setUserName(event.target.value)}
          value={userName}
        />
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={updateUserNameHandler}
        >
          Update
        </Button>
      </div>
    </div>
  );
};
