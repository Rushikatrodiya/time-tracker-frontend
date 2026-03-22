import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <AuthLayout activeTab="login">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
