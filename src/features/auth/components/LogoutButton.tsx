"use client";
import { useQueryClient } from "@tanstack/react-query";
import useLogoutMutation from "../hooks/useLogoutMutation";

export default function LogoutButton() {
  const queryClient = useQueryClient();
  const { logout, isLoading } = useLogoutMutation();
  const handleLogout  = async() => {
    await queryClient.resetQueries();
    await logout();
  };
  return <button onClick={handleLogout }>Выйти</button>;
}
