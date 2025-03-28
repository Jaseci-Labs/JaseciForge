import { RegisterForm } from "@/ds/organisms/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Task Manager",
  description: "Create a new Task Manager account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <p className="text-muted-foreground">Create a new account</p>
      </div>
      <RegisterForm />
    </div>
  );
}
