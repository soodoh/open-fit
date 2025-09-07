import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { redirect } from "next/navigation";

export default async function SigninPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return <LoginForm />;
}
