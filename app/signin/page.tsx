import { auth } from "@/auth";
import { SigninForm } from "@/components/auth/signinForm";
import { redirect } from "next/navigation";

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    redirect("/");
  }

  return <SigninForm callbackUrl={params.callbackUrl} error={params.error} />;
}
