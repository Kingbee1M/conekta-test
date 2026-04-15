import LandingHero from "./components/landinghero";
import EverythingYou from "./components/EverythingYou";
import HowItWorks from "./components/howItWorks";
import BuiltSecurity from "./components/builtSecurity";
import LandigBot from "./components/landingbot";
import Statistics from "./components/statistics";

export default function Home() {
  return (
    <>
      <LandingHero/>
      <EverythingYou/>
      <HowItWorks/>
      <Statistics/>
      <BuiltSecurity/>
      <LandigBot/>
    </>
  );
}
