import { auth } from "@/auth";
import { SignUpForm } from "@/components/auth/signUpForm";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return <SignUpForm />;
}
