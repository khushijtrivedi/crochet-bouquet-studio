import "./globals.css";
import { NextIntlClientProvider } from "next-intl";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = (await import("../messages/en.json")).default;

  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}