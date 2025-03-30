import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/modules/users/hooks/use-auth";
import { loginFormSchema, LoginFormValues } from "../schemas/login-schema";

interface UseLoginFormProps {
  onSuccess?: () => void;
}

export function useLoginForm({ onSuccess }: UseLoginFormProps = {}) {
  const { login, isLoading, error } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await login(values.email, values.password);
    if (onSuccess) onSuccess();
  };

  return {
    form,
    isLoading,
    error,
    onSubmit,
  };
}
