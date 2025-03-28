import { LoginForm } from "@/ds/organisms/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Task Manager",
  description: "Login to your Task Manager account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <p className="text-muted-foreground">Manage your tasks efficiently</p>
      </div>
      <LoginForm />
    </div>
  );
}
