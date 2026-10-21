import { usePageTitle } from '../../utils';
import { useAppContext } from '../../context/AppContext';
import PageColumn from '../../components/PageColumn';
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
    <>
      <Hero />
      <PageColumn className="pt-6 pb-18">
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
      </PageColumn>
    </>
  );
}
