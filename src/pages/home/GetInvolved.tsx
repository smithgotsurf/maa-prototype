import ContactSection from '../../components/ContactSection';
import { getInvolved } from './copy';

export default function GetInvolved() {
  return (
    <section className="mt-12">
      <h2 className="text-[30px] font-bold mb-1.5">{getInvolved.heading}</h2>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      <p className="text-[17px] text-base-content/70 leading-relaxed mb-5">{getInvolved.body}</p>
      <ContactSection />
    </section>
  );
}
