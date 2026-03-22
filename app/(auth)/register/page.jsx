import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <AuthLayout activeTab="register">
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
