import { B_URL } from '../utils';

export default function FieldsPage() {
  return (
    <div className="pg cp">
      <h1>Field Rentals</h1>
      <div className="gl" />
      <p>MAA has two fields available for rental when not in use for games or practices.</p>
      <div
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          margin: '16px 0',
          border: '1px solid var(--bdr-lt)',
          position: 'relative',
        }}
      >
        <img
          src={B_URL + 'static/fields-aerial.jpg'}
          alt="Aerial view of MAA fields"
          style={{
            width: '100%',
            display: 'block',
            maxHeight: 420,
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '38%',
            top: '49%',
            transform: 'translate(-50%,-50%)',
            background: 'rgba(0,0,0,.68)',
            color: '#fff',
            padding: '5px 14px',
            borderRadius: 6,
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '.5px',
            border: '1px solid var(--gold)',
            pointerEvents: 'none',
          }}
        >
          Field 1
        </div>
        <div
          style={{
            position: 'absolute',
            left: '61%',
            top: '76%',
            transform: 'translate(-50%,-50%)',
            background: 'rgba(0,0,0,.68)',
            color: '#fff',
            padding: '5px 14px',
            borderRadius: 6,
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '.5px',
            border: '1px solid var(--gold)',
            pointerEvents: 'none',
          }}
        >
          Field 2
        </div>
      </div>
      <div className="ic-grid">
        <div className="ic" style={{ margin: 0 }}>
          <h3>MAA Field 1</h3>
          <p>Supports T-Ball, T-Shirt, 8U, 10U, and 12U baseball and softball.</p>
        </div>
        <div className="ic" style={{ margin: 0 }}>
          <h3>MAA Field 2</h3>
          <p>Supports T-Ball, T-Shirt, 8U and 10U baseball, and 8U, 10U, and 12U softball.</p>
        </div>
      </div>
      <h2>Rental Rates</h2>
      <div className="rate-grid">
        <div
          style={{
            background: '#fff',
            border: '1px solid var(--bdr-lt)',
            borderRadius: 8,
            padding: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 600, marginBottom: 4 }}>
            Without Lights
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold-dk)' }}>
            $15<span style={{ fontSize: 14, fontWeight: 400 }}>/hr</span>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            border: '1px solid var(--bdr-lt)',
            borderRadius: 8,
            padding: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 600, marginBottom: 4 }}>
            With Lights
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold-dk)' }}>
            $35<span style={{ fontSize: 14, fontWeight: 400 }}>/hr</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray-lt)', marginTop: 2 }}>
            +$20/hr for lights
          </div>
        </div>
      </div>
      <p style={{ marginTop: 12, fontSize: 13, color: 'var(--gray)' }}>
        Example: 1 hr without lights + 1 hr with lights = $15 + $35 = $50
      </p>
      <p style={{ marginTop: 16, fontSize: 13, color: 'var(--gray)' }}>
        To reserve, contact meadowathleticassociation@gmail.com.
      </p>
    </div>
  );
}
