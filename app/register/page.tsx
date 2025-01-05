import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/signUpForm";
import { auth } from "@/auth";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return <SignUpForm />;
}
