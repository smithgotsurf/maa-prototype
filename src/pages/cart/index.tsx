import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fullName, Ic, icons, usePageTitle } from '../../utils';
import { useAppContext } from '../../context/AppContext';

export default function CartPage() {
  usePageTitle('Cart');
  const { cart, removeFromCart, clearCart } = useAppContext();
  const navigate = useNavigate();
  const total = cart.reduce((s, i) => s + (i.total || i.program.fee), 0);
  const [done, sDone] = useState(false);
  if (done)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card bg-success/10 border border-success p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-primary text-primary-content flex items-center justify-center mx-auto mb-4">
            <Ic d={icons.chk} s={28} />
          </div>
          <h2 className="text-xl font-bold">Registration Submitted!</h2>
          <p className="text-sm text-base-content/50 mt-2">
            Your registration has been submitted. Payment details will be communicated separately by
            the MAA board.
          </p>
          <button
            className="btn btn-neutral mt-5"
            onClick={() => {
              sDone(false);
              clearCart();
              navigate('/');
            }}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-[21px] font-serif font-bold mb-0.5">Your Cart</h2>
        <p className="text-sm text-base-content/50 mb-5">
          {cart.length === 0
            ? 'Your cart is empty.'
            : `${cart.length} registration${cart.length !== 1 ? 's' : ''} ready to submit.`}
        </p>
        {cart.map((i) => (
          <div className="card bg-white border border-base-300 p-4 mb-3" key={i.id}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{fullName(i.player)}</h4>
                <p className="text-sm text-base-content/50">
                  {i.program.name} · Hat: {i.hat} · Jersey: {i.jersey}
                  {i.digitalPicture && ' · Digital Pic'}
                  {i.extraHat && ` · Extra Hat (${i.extraHat.size})`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">${i.total || i.program.fee}.00</span>
                <button
                  className="btn btn-error btn-ghost btn-sm"
                  onClick={() => removeFromCart(i.id)}
                >
                  <Ic d={icons.trash} s={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {cart.length > 0 && (
          <>
            <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-base-300">
              <span>Total Due</span>
              <span className="font-serif text-secondary">${total}.00</span>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-outline" onClick={() => navigate('/register')}>
                Register Another
              </button>
              <button className="btn btn-primary" onClick={() => sDone(true)}>
                Complete Registration
              </button>
            </div>
          </>
        )}
        {cart.length === 0 && (
          <div className="text-center py-8">
            <button className="btn btn-neutral" onClick={() => navigate('/register')}>
              Start Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
