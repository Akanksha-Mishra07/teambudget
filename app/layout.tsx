import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TeamProvider } from "@/context/TeamContext";
import Footer from "@/components/Footer";

export const metadata = {
  title: "TeamBudget",
  description: "Track team expenses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <TeamProvider>
            <div className="flex-1">{children}</div>
            <Footer />
          </TeamProvider>
        </AuthProvider>
      </body>
    </html>
  );
}