import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "StartupForge - Startup Team Builder",
  description: "A platform where startup founders can publish startup ideas, build teams, and recruit collaborators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}