import { AuthForm } from "@/components/auth/AuthForm";

export default function SignInPage() {
  return (
    <main className="px-4 py-10">
      <AuthForm mode="signin" />
    </main>
  );
}
