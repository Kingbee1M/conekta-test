import BuiltSecurity from "./components/builtSecurity";
import LandigBot from "./components/landingbot";
import Landinghero2 from "./components/landinghero2";
import EverythingLanding from "./components/EverythingLanding";
import LandingStats from "./components/LandingStats";
import MeetTheTeam from "./components/MeetTheTeam";


export default function Home() {
  return (
    <>
      <Landinghero2/>
      <EverythingLanding/>
      <LandingStats/>
      <MeetTheTeam/>
      <BuiltSecurity/>
      <LandigBot/>
    </>
  );
}
