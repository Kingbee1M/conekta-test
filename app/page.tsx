import LandingHero from "./components/landinghero";
import EverythingYou from "./components/EverythingYou";
import HowItWorks from "./components/howItWorks";
import BuiltSecurity from "./components/builtSecurity";
import LandigBot from "./components/landingbot";

export default function Home() {
  return (
    <>
      <LandingHero/>
      <EverythingYou/>
      <HowItWorks/>
      <BuiltSecurity/>
      <LandigBot/>
    </>
  );
}
