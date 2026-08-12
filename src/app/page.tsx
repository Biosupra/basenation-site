'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // September 1st, 2026 countdown
    const countDownDate = new Date("Sep 1, 2026 00:00:00").getTime();

    const timer = setInterval(function() {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container">
      <header>
        <Image 
          src="/logo_black.png" 
          alt="Base Nation Logo" 
          width={350} 
          height={100} 
          style={{ width: '100%', maxWidth: '350px', height: 'auto', objectFit: 'contain', margin: '0 auto', display: 'block', filter: 'drop-shadow(0px 10px 20px rgba(0, 82, 255, 0.15))' }}
          priority
        />
        <p className="subtitle" style={{ marginTop: '1.5rem' }}>
          The hub is currently under construction. A new platform for the ecosystem is deploying soon.
        </p>
      </header>

      <section className="vault-container" style={{ padding: 0, background: 'transparent', border: 'none', overflow: 'hidden', boxShadow: 'none' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(225, 20, 61, 0.15)', border: '1px solid rgba(225, 20, 61, 0.3)', borderRadius: '12px', marginTop: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--base-blue)' }}>App Launching Soon</h3>
          <p style={{ color: 'var(--text-main)', marginBottom: 0, fontSize: '14px' }}>
            The Automated Liquidity Manager is undergoing final testing and is not yet available to the public. Check back soon!
          </p>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>About Us</h3>
          <p>Hi, I&apos;m Panda & my wife Autumn. We are building Base_Nation, an Automated Liquidity Manager built exclusively for the Base ecosystem. Our mission is to make advanced DeFi yield generation simple and accessible for everyday users by automating concentrated liquidity management.</p>
        </div>
        
        <div className="feature-card">
          <h3>Development Update</h3>
          <p>We are making incredible progress! We have successfully completed backend testing of our Smart Vaults, and our off-chain Rust Keeper bot is now fully deployed and hosted on robust cloud infrastructure. Currently, we are pursuing the formation of our LLC to ensure we have a solid legal and regulatory foundation before our official launch.</p>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <section style={{ marginTop: '3rem', textAlign: 'center', background: 'rgba(0, 82, 255, 0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(0, 82, 255, 0.2)' }}>
        <h3 style={{ color: 'var(--base-blue)', marginTop: 0 }}>Beta Launch Countdown</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '1.5rem' }}>
          Targeting <strong>September 1st, 2026</strong>. The beta launch will be restricted to a limited number of users (amount TBD).
        </p>
        
        <div id="countdown-timer" style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: 'white', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1A1C20', padding: '10px', borderRadius: '8px', border: '1px solid #333', minWidth: '60px', flex: 1 }}>
            <span>{timeLeft.days.toString().padStart(2, '0')}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal', textTransform: 'uppercase' }}>Days</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1A1C20', padding: '10px', borderRadius: '8px', border: '1px solid #333', minWidth: '60px', flex: 1 }}>
            <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal', textTransform: 'uppercase' }}>Hours</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1A1C20', padding: '10px', borderRadius: '8px', border: '1px solid #333', minWidth: '60px', flex: 1 }}>
            <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal', textTransform: 'uppercase' }}>Mins</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1A1C20', padding: '10px', borderRadius: '8px', border: '1px solid #333', minWidth: '60px', flex: 1 }}>
            <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal', textTransform: 'uppercase' }}>Secs</span>
          </div>
        </div>
      </section>

      {/* Socials Section */}
      <section style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>Socials</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a href="https://x.com/Base__Nation?s=20" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', backgroundColor: '#1A1C20', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: 'white', transition: '0.2s', textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://t.me/+81lZS1CP_882YzNh" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', backgroundColor: '#0088cc', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', color: 'white', transition: '0.2s', textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.31-.35-.11l-6.4 4.027-2.76-.862c-.602-.19-.616-.602.126-.892l10.8-4.16c.5-.19.95.115.784.887z"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
