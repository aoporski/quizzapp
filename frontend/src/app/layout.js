import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Quizz App",
  description: "App made for sharing quizzes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
