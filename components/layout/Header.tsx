/** @jsxImportSource @emotion/react */
import { AppBar, Box, Container, Toolbar, Link } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { AccountNavItem } from "./AccountNavItem";

export const Header = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/">
            <Image
              src="/logo-bg-white.png"
              alt="logo"
              priority
              width={40}
              height={40}
            />
          </Link>
          <Box
            sx={{
              flexGrow: 1,
              ml: 3,
              gap: 4,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Link
              component={NextLink}
              href="/routines"
              sx={{
                color: "primary.contrastText",
              }}
            >
              Routines
            </Link>
            <Link
              component={NextLink}
              href="/exercises"
              sx={{
                color: "primary.contrastText",
              }}
            >
              Exercises
            </Link>
            <Link
              component={NextLink}
              href="/nutrition"
              sx={{
                color: "primary.contrastText",
              }}
            >
              Nutrition
            </Link>
          </Box>
          <AccountNavItem />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
