import { B_URL } from '../utils';

export default function FieldsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Field Rentals</h1>
      <div className="border-t-2 border-primary w-16 mb-6" />
      <p className="text-sm mb-4">
        MAA has two fields available for rental when not in use for games or practices.
      </p>
      <div className="rounded-xl overflow-hidden my-4 border border-base-300 relative">
        <img
          src={B_URL + 'static/fields-aerial.jpg'}
          alt="Aerial view of MAA fields"
          className="w-full block max-h-[420px] object-cover object-center"
        />
        <div className="absolute left-[38%] top-[49%] -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-3.5 py-1 rounded-md text-xs font-bold tracking-wider border border-primary pointer-events-none">
          Field 1
        </div>
        <div className="absolute left-[61%] top-[76%] -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-3.5 py-1 rounded-md text-xs font-bold tracking-wider border border-primary pointer-events-none">
          Field 2
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card border border-base-300 p-4">
          <h3 className="font-bold mb-1">MAA Field 1</h3>
          <p className="text-sm">
            Supports T-Ball, T-Shirt, 8U, 10U, and 12U baseball and softball.
          </p>
        </div>
        <div className="card border border-base-300 p-4">
          <h3 className="font-bold mb-1">MAA Field 2</h3>
          <p className="text-sm">
            Supports T-Ball, T-Shirt, 8U and 10U baseball, and 8U, 10U, and 12U softball.
          </p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-3">Rental Rates</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="card bg-base-100 border border-base-300 p-4 text-center">
          <div className="text-xs text-gray-500 font-semibold mb-1">Without Lights</div>
          <div className="text-2xl font-bold text-primary">
            $15<span className="text-sm font-normal">/hr</span>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300 p-4 text-center">
          <div className="text-xs text-gray-500 font-semibold mb-1">With Lights</div>
          <div className="text-2xl font-bold text-primary">
            $35<span className="text-sm font-normal">/hr</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">+$20/hr for lights</div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Example: 1 hr without lights + 1 hr with lights = $15 + $35 = $50
      </p>
      <p className="text-xs text-gray-500 mt-4">
        To reserve, contact meadowathleticassociation@gmail.com.
      </p>
    </div>
  );
}
