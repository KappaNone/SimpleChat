import React from "react";

interface IProps {
  userName: string;
  user: string;
}

const RoomUser: React.FC<IProps> = ({ userName, user }) => {
  return (
    <div>
      {user === userName ? `${user} (you)` : user}
      <br />
    </div>
  );
};
export default RoomUser;
