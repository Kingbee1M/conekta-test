import PropertySearchFilter from "./PropertySearchFilter";
import MarqueeBanner from "./MarqueeBanner";
import HomeOfTheWeek from "./HomeWeek";

export default function EditorsPick() {
  return (
    <section className="w-full relative z-30">
      {/* Floating search container overlapping the hero above and marquee below */}
      <div className="-mt-12 md:-mt-14 mb-6 relative z-40">
        <PropertySearchFilter />
      </div>

      {/* Moving data strip */}
      <MarqueeBanner />

      {/* Editor's Pick Listings content goes here */}
      <HomeOfTheWeek />
    </section>
  );
}