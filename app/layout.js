import "./globals.css";

export const metadata = {
  title: "Jack's Hub",
  description: "Personal daily dashboards",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f1115",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
