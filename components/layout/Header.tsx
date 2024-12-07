/** @jsxImportSource @emotion/react */
import Image from "next/image";
import Link from "next/link";
import { AccountNavItem } from "./AccountNavItem";
import { css } from "@emotion/react";

export const Header = () => {
  return (
    <header
      css={css`
        background-color: var(--space-cadet);
        color: var(--isabelline);
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        css={css`
          margin: 1rem 2rem;
          max-width: var(--max-width);
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <nav
          css={css`
            display: flex;
            align-items: center;
            gap: 1rem;
          `}
        >
          <Link href="/">
            <Image
              src="/logo-bg-white.png"
              alt="logo"
              priority
              width={40}
              height={40}
            />
          </Link>
          <Link href="/routines">Routines</Link>
          <Link href="/exercises">Exercises</Link>
          <Link href="/nutrition">Nutrition</Link>
        </nav>
        <AccountNavItem />
      </div>
    </header>
  );
};
