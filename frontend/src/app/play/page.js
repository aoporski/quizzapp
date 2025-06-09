import Link from "next/link";

const PlayHomePage = () => {
  return (
    <div>
      <h2>🎮 Play a Quiz</h2>
      <p>Select a quiz to get started:</p>
      <Link href="/quiz/browse">🔍 Browse All Quizzes</Link>
    </div>
  );
};

export default PlayHomePage;
