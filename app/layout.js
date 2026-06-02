import "./globals.css";

export const metadata = {
  title: "Accredible • Certificates, Badges and Blockchain",
  description: "Home of digital credentials",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
