import { useForm } from "react-hook-form";
import AuthLabeledInput from "./AuthLabeledInput";

export default function ChangeForm() {
  const form = useForm({});
  return (
    <form>
      <AuthLabeledInput form={form} inputName="username" label="Логин" />
      <AuthLabeledInput
        label="Пароль"
        inputName="password"
        form={form}
        secure={true}
        className="mb-2"
      />
    </form>
  );
}
