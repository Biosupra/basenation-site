'use client';

import { useState, useEffect } from 'react';

export default function VaultButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isModalOpen) return;
    
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
  }, [isModalOpen]);

  return (
    <>
      <a 
        onClick={() => setIsModalOpen(true)} 
        style={{ color: "var(--text-muted)", cursor: "pointer" }}
      >
        Vault Access
      </a>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-dark)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(0, 82, 255, 0.2)',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            <h2 style={{ color: 'var(--base-blue)', marginTop: 0 }}>Restricted Access</h2>
            <p style={{ color: 'var(--text-main)' }}>
              The vault is not yet in full launch and available to the public. Open beta testing will begin soon!
            </p>
            
            <div style={{ marginTop: '1.5rem', background: 'rgba(0, 82, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '1rem', marginTop: 0 }}>
                Targeting <strong>September 1st, 2026</strong>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1A1C20', padding: '10px', borderRadius: '8px', border: '1px solid #333', minWidth: '55px' }}>
                  <span>{timeLeft.days.toString().padStart(2, '0')}</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 'normal', textTransform: 'uppercase' }}>Days</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1A1C20', padding: '10px', borderRadius: '8px', border: '1px solid #333', minWidth: '55px' }}>
                  <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 'normal', textTransform: 'uppercase' }}>Hours</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1A1C20', padding: '10px', borderRadius: '8px', border: '1px solid #333', minWidth: '55px' }}>
                  <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 'normal', textTransform: 'uppercase' }}>Mins</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1A1C20', padding: '10px', borderRadius: '8px', border: '1px solid #333', minWidth: '55px' }}>
                  <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 'normal', textTransform: 'uppercase' }}>Secs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
