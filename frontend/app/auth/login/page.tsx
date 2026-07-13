import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="We're glad to see you again. Sign in to continue your journey with Adara."
    >
      <LoginForm />
    </AuthLayout>
  );
}