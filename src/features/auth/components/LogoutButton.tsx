"use client";
import useLogoutMutation from "../hooks/useLogoutMutation";

export default function LogoutButton() {
  const { logout, isLoading } = useLogoutMutation();
  const onClick = () => {
    logout();
  };
  return <button onClick={onClick}>Выйти</button>;
}
