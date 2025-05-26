export const metadata = {
  title: "Quizz App",
  description: "App made for sharing quizzes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
