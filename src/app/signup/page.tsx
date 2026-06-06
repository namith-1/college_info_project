import { AuthForm } from "@/components/auth/AuthForm";

export default function SignUpPage() {
  return (
    <main className="px-4 py-10">
      <AuthForm mode="signup" />
    </main>
  );
}
