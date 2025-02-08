import { getCurrentSession } from "@/actions/getCurrentSession";
import { getUnits } from "@/actions/getUnits";
import { CurrentSession } from "@/components/sessions/CurrentSession";
import { EditSessionMenu } from "@/components/sessions/EditSessionMenu";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Chip, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";

export default async function Page() {
  const currentSession = await getCurrentSession();
  const units = await getUnits();

  if (!currentSession) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4">No active session</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            variant="outlined"
            label={dayjs(currentSession.startTime).format("MM/DD/YYYY")}
          />

          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            LinkComponent={Link}
            href="/logs"
          >
            Logs
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography variant="h4">{currentSession.name}</Typography>
          <EditSessionMenu session={currentSession} />
        </Box>
      </Container>

      <CurrentSession session={currentSession} units={units} />
    </>
  );
}
