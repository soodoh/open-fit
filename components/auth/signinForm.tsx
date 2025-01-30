import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { Button, Container, TextField } from "@mui/material";
import { redirect } from "next/navigation";

export const SigninForm = ({
  callbackUrl,
  error,
}: {
  callbackUrl?: string;
  error?: string;
}) => {
  console.log("callbackUrl", callbackUrl);
  console.log("error", error);
  return (
    <Container
      maxWidth="xs"
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
      component="form"
      action={async (formData) => {
        "use server";
        try {
          await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
          });
          redirect(callbackUrl || "/");
        } catch (error) {
          if (error instanceof AuthError) {
            redirect(`/signin?error=${error.type}`);
          }
          throw error;
        }
      }}
    >
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        variant="outlined"
        label="Email"
        name="email"
        error={!!error}
      />
      <TextField
        sx={{ mb: 3 }}
        fullWidth
        variant="outlined"
        label="Password"
        type="password"
        name="password"
        error={!!error}
        helperText={error}
      />
      <Button variant="contained" type="submit" fullWidth>
        Sign In
      </Button>
    </Container>
  );
};
