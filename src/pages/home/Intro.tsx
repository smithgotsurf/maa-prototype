import { intro } from './copy';

export default function Intro() {
  return (
    <div className="card bg-white shadow-[0_3px_20px_rgba(0,0,0,.05)] border border-base-300 rounded-xl p-5 -mt-34 max-w-[600px] mx-auto relative z-10 mb-10">
      <h3 className="text-xl font-bold">{intro.heading}</h3>
      <p className="text-[17px] text-base-content/70 mt-1 leading-relaxed">{intro.body}</p>
    </div>
  );
}
