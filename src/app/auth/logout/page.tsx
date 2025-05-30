'use client'
import useLogoutMutation from "@/features/auth/hooks/useLogoutMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout, isLoading } = useLogoutMutation();

  useEffect(() => {
    const handleLogout = async () => {
      await queryClient.resetQueries();
      await logout();
      router.push('/'); // Перенаправление после выхода
    };

    handleLogout();
  }, [logout, queryClient, router]);

  return (
    <div>
      {isLoading ? 'Выход...' : 'Вы успешно вышли из системы'}
    </div>
  );
}