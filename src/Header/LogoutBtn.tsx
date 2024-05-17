import React from "react";

interface LogoutProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
const LogoutBtn: React.FC<LogoutProps> = ({ onClick }) => {
  return <button onClick={onClick}>로그아웃</button>;
};

export default LogoutBtn;
