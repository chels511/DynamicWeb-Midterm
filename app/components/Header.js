import Link from "next/link";
import styles from "../page.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="title">Nexus Card Recommendations</div>
      <nav>
        <ul>
          <li>
            <Link href="/">By Pokemon Types</Link>
          </li>
          <li>
            <Link href="/card/cardTypes">By Yugi-Oh Rarity</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
