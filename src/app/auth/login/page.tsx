import LoginForm from "@/features/auth/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Войти в аккаунт",
};

export default function RegisterPage() {
  return <LoginForm/>;
}
