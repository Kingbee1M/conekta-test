import MarqueeBanner from "./MarqueeBanner";
import HomeOfTheWeek from "./HomeWeek";

export default function EditorsPick() {
  return (
    <section className="w-full relative z-30">

      {/* Moving data strip */}
      <MarqueeBanner />

      {/* Editor's Pick Listings content goes here */}
      <HomeOfTheWeek />
    </section>
  );
}