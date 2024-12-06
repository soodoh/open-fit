import Image from "next/image";
import Link from "next/link";
import { AccountNavItem } from "./AccountNavItem";
import styles from "@/styles/header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <nav className={styles.nav}>
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
