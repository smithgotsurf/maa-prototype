import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_PATHS, usePageTitle } from '../../utils';
import { questions } from './questions';

export default function FaqPage() {
  usePageTitle('FAQ');
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[30px] font-bold mb-1.5">Frequently Asked Questions</h1>
      <div className="w-11 h-[3px] bg-primary rounded-sm mb-4" />
      {questions.map((f, i) => (
        <div className="border border-secondary rounded-[9px] p-4 mb-2" key={i}>
          <h4 className="text-base font-semibold">
            <button
              type="button"
              className="flex items-center justify-between w-full cursor-pointer text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span>{f.q}</span>
              <span aria-hidden="true" className="text-base-content/30 ml-2 font-normal">
                {open === i ? '▾' : '▸'}
              </span>
            </button>
          </h4>
          {open === i && (
            <div className="text-sm text-base-content/50 leading-relaxed mt-2.5 bg-base-100 rounded-[5px] p-2">
              {f.a}
              {f.link && (
                <button
                  className="btn btn-ghost btn-sm mt-2 inline-flex"
                  onClick={() => navigate(PAGE_PATHS[f.link!.p])}
                >
                  {f.link.l} →
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
