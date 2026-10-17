import { usePageTitle } from '../../utils';
import { useAppContext } from '../../context/AppContext';
import Hero from './Hero';
import Intro from './Intro';
import ProgramsOffered from './ProgramsOffered';
import MoreOnTheSite from './MoreOnTheSite';
import GetInvolved from './GetInvolved';
import OpenSeason from './OpenSeason';

export default function HomePage() {
  usePageTitle();
  const { activeSeason } = useAppContext();
  return (
    <div>
      <Hero />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeSeason ? (
          <OpenSeason season={activeSeason} />
        ) : (
          <>
            <Intro />
            <ProgramsOffered />
          </>
        )}
        <MoreOnTheSite />
        <GetInvolved />
      </div>
    </div>
  );
}
