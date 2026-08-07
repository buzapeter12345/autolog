import React, { useState } from 'react';
import { Car, ShieldCheck, Lock, Mail, KeyRound, UserPlus, LogIn } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail, isFirebaseActive } from '../firebase/config';

export default function AuthScreen() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google Auth Error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('A Google bejelentkezés még nincs engedélyezve a Firebase konzolban. Kérjük használd az Email / Jelszó bejelentkezést!');
      } else {
        setErrorMsg(err.message || 'Hiba történt a Google bejelentkezés során.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Kérjük adja meg az email címét és a jelszavát!');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A jelszónak legalább 6 karakterből kell állnia!');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (err) {
      console.error('Auth Error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Hibás email cím vagy jelszó!');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Ez az email cím már regisztrálva van!');
      } else {
        setErrorMsg(err.message || 'Hitelesítési hiba történt.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1.5rem 1rem',
      background: 'radial-gradient(circle at 50% 30%, rgba(234, 179, 8, 0.08) 0%, transparent 60%), #0b0f17'
    }}>
      <div style={{ maxWidth: '460px', width: '100%' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Car size={36} color="var(--primary)" />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
              Auto<span style={{ color: 'var(--primary)' }}>Log</span>
            </span>
            <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>PRO</span>
          </div>

          <p className="text-muted" style={{ fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Prémium Digitális Szervizkönyv & Járműnapló
          </p>
        </div>

        {/* Login / Register Card */}
        <div className="glass-card" style={{ padding: '2rem 1.75rem', boxShadow: 'var(--shadow-md)' }}>
          
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <button 
              type="button"
              className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              style={{ flex: 1, justifyContent: 'center', padding: '0.75rem', fontSize: '1rem' }}
            >
              <LogIn size={18} /> Bejelentkezés
            </button>
            <button 
              type="button"
              className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              style={{ flex: 1, justifyContent: 'center', padding: '0.75rem', fontSize: '1rem' }}
            >
              <UserPlus size={18} /> Regisztráció
            </button>
          </div>

          {errorMsg && (
            <div style={{ padding: '0.75rem 1rem', background: 'var(--danger-light)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Google Login Button */}
          {isFirebaseActive && (
            <div style={{ marginBottom: '1.5rem' }}>
              <button 
                type="button"
                className="btn btn-secondary btn-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700, padding: '0.85rem 1rem' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '0.5rem' }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Belépés Google Fiókkal
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0 0.5rem 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                <div style={{ flex: 1, borderBottom: '1px solid var(--border-color)' }}></div>
                <span style={{ padding: '0 0.75rem' }}>vagy email címmel</span>
                <div style={{ flex: 1, borderBottom: '1px solid var(--border-color)' }}></div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} /> Email Cím
              </label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="nev@email.hu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <KeyRound size={15} /> Jelszó
              </label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={isLoading}
              style={{ marginTop: '0.75rem', padding: '0.85rem' }}
            >
              {isLoading ? 'Feldolgozás...' : (mode === 'login' ? 'Bejelentkezés' : 'Regisztráció')}
            </button>
          </form>

          {/* Security guarantee badge */}
          <div style={{ marginTop: '1.5rem', background: 'rgba(15,23,42,0.6)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck color="var(--success)" size={22} style={{ flexShrink: 0 }} />
            <div>
              <strong>Felhős Adatvédelem:</strong> Az adataidat a Google Firebase védi, így kizárólag a te fiókod fér hozzá az autóidhoz.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
