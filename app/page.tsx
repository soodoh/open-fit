/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export default function Home() {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        max-width: var(--max-width);
        width: 100%;
        margin: 2rem;
        gap: 2rem;
      `}
    >
      Home page!
    </div>
  );
}
