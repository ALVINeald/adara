import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Begin your journey toward connection, hope, and healing."
    >
      <SignUpForm />
    </AuthLayout>
  );
}