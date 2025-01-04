import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/signUpForm";

export default async function RegisterPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return <SignUpForm />;
}
