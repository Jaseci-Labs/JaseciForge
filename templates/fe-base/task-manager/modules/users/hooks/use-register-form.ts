import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/modules/users/hooks/use-auth";
import {
  registerFormSchema,
  RegisterFormValues,
} from "../schemas/register-schema";

interface UseRegisterFormProps {
  onSuccess?: () => void;
}

export function useRegisterForm({ onSuccess }: UseRegisterFormProps = {}) {
  const { register: registerUser, isLoading, error } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    console.log("registerning sdf");
    await registerUser(values.email, values.password);
    if (onSuccess) onSuccess();
  };

  return {
    form,
    isLoading,
    error,
    onSubmit,
  };
}
