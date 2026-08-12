

export default function TermsOfService() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 2rem 4rem 2rem' }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', letterSpacing: '-0.05em', color: 'white' }}>
        Terms of <span className="highlight">Service</span>
      </h1>
      <p className="subtitle" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
        Effective Date: August 11, 2026
      </p>

      <div className="alert" style={{ background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.3)', padding: '15px', borderRadius: '8px', color: '#ff6b6b', margin: '2rem 0', fontWeight: 'bold' }}>
        RESTRICTED REGIONS: BaseNation and all associated smart contracts, interfaces, and vaults are strictly prohibited for use by any person or entity located in, organized under the laws of, or ordinarily resident in the United States of America (including its territories and possessions).
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
        By accessing or using the BaseNation interface, website, or any associated smart contracts (collectively, the &quot;Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, you must not use the Platform.
      </p>

      <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '2.5rem', borderLeft: '3px solid var(--base-blue)', paddingLeft: '15px' }}>1. Non-Custodial Nature</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
        BaseNation is a decentralized, non-custodial software platform. We do not have access to your private keys, funds, or assets at any time. You are solely responsible for the security of your cryptographic wallets and assets. The operators, developers, and maintainers of BaseNation cannot freeze, recover, or manage your funds on your behalf.
      </p>

      <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '2.5rem', borderLeft: '3px solid var(--base-blue)', paddingLeft: '15px' }}>2. Assumption of Risk</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>Using decentralized finance (DeFi) protocols involves significant risks, including but not limited to:</p>
      <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
        <li><strong>Smart Contract Vulnerabilities:</strong> While the smart contracts aim to be secure, they may contain undiscovered bugs, vulnerabilities, or exploits that could result in the total loss of your funds.</li>
        <li><strong>Market Volatility:</strong> The value of cryptographic assets can fluctuate rapidly. You may experience severe financial losses, including impermanent loss when participating in liquidity pools.</li>
        <li><strong>Regulatory Uncertainty:</strong> The regulatory regime governing blockchain technologies and digital assets is uncertain and evolving. New regulations or policies may materially affect the Platform.</li>
      </ul>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>By using the Platform, you acknowledge that you are sophisticated enough to understand these risks and you assume them entirely.</p>

      <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '2.5rem', borderLeft: '3px solid var(--base-blue)', paddingLeft: '15px' }}>3. U.S. Person Prohibition</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
        You expressly declare and warrant that you are not a U.S. citizen, U.S. resident, or acting on behalf of a U.S. entity. You agree not to attempt to bypass any technological measures (such as click-wrap agreements or VPNs) implemented to prevent access from restricted jurisdictions.
      </p>

      <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '2.5rem', borderLeft: '3px solid var(--base-blue)', paddingLeft: '15px' }}>4. No Warranties (As-Is)</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
        The Platform is provided &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; without warranties of any kind, either express or implied. The developers and contributors disclaim all implied warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee uninterrupted access or that the Platform will be free from errors or delays.
      </p>

      <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '2.5rem', borderLeft: '3px solid var(--base-blue)', paddingLeft: '15px' }}>5. Limitation of Liability</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
        To the fullest extent permitted by applicable law, in no event shall the developers, contributors, operators, or affiliates of BaseNation be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, or other intangible losses, resulting from:
      </p>
      <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
        <li>Your access to, use of, or inability to access or use the Platform.</li>
        <li>Any unauthorized access, use, or alteration of your transmissions or data.</li>
        <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Platform by any third party.</li>
        <li>The actions or omissions of third-party protocols (e.g., Aerodrome, Base Network) that the Platform interacts with.</li>
      </ul>

      <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '2.5rem', borderLeft: '3px solid var(--base-blue)', paddingLeft: '15px' }}>6. Indemnification</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
        You agree to indemnify, defend, and hold harmless BaseNation and its contributors from any claims, damages, liabilities, costs, or expenses (including reasonable legal fees) arising out of your use of the Platform, your violation of these Terms, or your violation of any laws or regulations.
      </p>

      <h2 style={{ fontSize: '1.5rem', color: 'white', marginTop: '2.5rem', borderLeft: '3px solid var(--base-blue)', paddingLeft: '15px' }}>7. Modifications to the Terms</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>
        We reserve the right to modify these Terms of Service at any time. Any changes will be effective immediately upon posting to this site. Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes.
      </p>
    </div>
  );
}
