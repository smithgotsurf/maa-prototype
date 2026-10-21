import { Link } from 'react-router-dom';
import { PAGE_PATHS, usePageTitle } from '../../utils';
import PageBand from '../../components/PageBand';
import PageColumn from '../../components/PageColumn';

export default function NotFoundPage() {
  usePageTitle('Page Not Found');
  return (
    <>
      <PageBand title="Page Not Found" />
      <PageColumn>
        <p className="text-[17px] text-base-content/70 leading-relaxed mb-5">
          Sorry, we couldn't find the page you were looking for.
        </p>
        <Link to={PAGE_PATHS.home} className="btn btn-primary">
          Back to home
        </Link>
      </PageColumn>
    </>
  );
}
