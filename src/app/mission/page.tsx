import Link from "next/link";

export default function Mission() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'left' }}>
      <Link href="/" className="back-link" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>
        &larr; Back to Home
      </Link>
      
      <h1 style={{ color: 'var(--base-blue)', fontSize: '3rem', marginTop: '2rem' }}>Our Mission</h1>
      
      <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '2rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
          <p>We know the exact feeling: toiling and stressing over the charts, watching the price of Bitcoin rollercoaster, and constantly refreshing the page just to make sure your position is still green and in range.</p>
          <p>Manually checking dynamic APY rates, reviewing token metrics on platforms like Aerodrome, and tracking live minting and staking pipelines is exhausting. It turns what should be an exciting ecosystem into a full-time, high-stress job.</p>
          <p>That is exactly why we built <strong>Base_Nation</strong>.</p> 
          <p>Our mission is to make professional-grade crypto liquidity management accessible to absolutely everyone. We wanted to take the anxiety out of DeFi. Our custom-built liquidity pool manager bots handle the complex execution—keeping your positions active, in range, and optimized—so you can finally step away from the screens.</p> 
          <p style={{ color: 'var(--base-blue)', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '2rem' }}>
            Let the automation do the heavy lifting, and let&apos;s turn these trenches into mountains.
          </p>
      </div>
    </div>
  );
}
