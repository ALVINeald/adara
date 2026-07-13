import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Don't worry. Enter your email and we'll send you a secure password reset link."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}