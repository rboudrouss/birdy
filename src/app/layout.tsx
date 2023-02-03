import "./globals.css";

import styles from "./layout.module.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <main className={styles.main}>
          <div className={styles.navbar}>
            <h1>A</h1>
          </div>
          <div className={styles.posts}>{children}</div>
          <div className={styles.followers}>
            <h1>B</h1>
          </div>
        </main>
      </body>
    </html>
  );
}
// TODO header
