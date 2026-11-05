'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@yukizi/api-client';

const RESEND_SECONDS = 30;
const PHONE_RE = /^[6-9]\d{9}$/;

/**
 * Shown on checkout to someone who is not logged in.
 *
 * The phone number is mandatory at checkout, so it is also the proof of who the
 * buyer is: confirming it by one-time code either logs them into the account
 * that number already belongs to, or creates a buyer account for it (the same
 * /auth/send-otp + /auth/verify-otp the login popup uses; the server finds or
 * creates the buyer). From then on the order is placed exactly as for any
 * logged-in buyer, so sellers, settlements and reporting see an ordinary order.
 *
 * Why a code and not just "trust the number they typed": without it, typing
 * someone else's number would log you into their account, with their address
 * book and order history.
 *
 * Styled with inline colours like the rest of the checkout, which is a light
 * page in both themes.
 */
export default function GuestPhoneVerification({
  onVerified,
  initialPhone = '',
}: {
  /** Called with the confirmed 10-digit number once the session exists. */
  onVerified: (phone: string) => void;
  initialPhone?: string;
}) {
  const { sendOtp, verifyOtp } = useAuth();
  const [phone, setPhone] = useState(initialPhone.replace(/\D/g, '').slice(-10));
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === 'otp') otpRef.current?.focus();
  }, [step]);

  const phoneValid = PHONE_RE.test(phone);

  const send = async () => {
    if (!phoneValid) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await sendOtp(phone);
      setStep('otp');
      setOtp('');
      setCooldown(RESEND_SECONDS);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Could not send the code. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit code.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await verifyOtp(phone, otp);
      onVerified(phone);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'That code did not work. Check it and try again.');
    } finally {
      setBusy(false);
    }
  };

  const primary: React.CSSProperties = {
    height: 42, padding: '0 18px', border: 'none', borderRadius: 6, background: '#0066cc',
    color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
  };

  return (
    <div
      id="guest-phone-verification"
      style={{ background: '#fff', border: '1px solid #cfe0f5', borderRadius: 10, padding: 16, marginBottom: 24 }}
    >
      <p className="co-section-title" style={{ marginBottom: 4 }}>Verify your mobile number</p>
      <p style={{ fontSize: 13, color: '#555', lineHeight: 1.5, marginBottom: 12 }}>
        We&apos;ll confirm it with a one-time code and set up your Yukizi account with it, so you can track
        this order. No password needed. Already a customer? Use the number on your account.
      </p>

      {step === 'phone' ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: 0, height: 42, display: 'flex', alignItems: 'center', fontSize: 14, color: '#555', pointerEvents: 'none' }}>+91</span>
            <input
              className="co-input"
              style={{ paddingLeft: 44 }}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              name="verify-phone"
              placeholder="Mobile number"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              onKeyDown={(e) => { if (e.key === 'Enter') void send(); }}
            />
          </div>
          <button type="button" style={{ ...primary, opacity: busy || !phoneValid ? 0.6 : 1 }} disabled={busy || !phoneValid} onClick={send}>
            {busy ? 'Sending…' : 'Send code'}
          </button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>
            Code sent to +91 {phone}.{' '}
            <button type="button" onClick={() => { setStep('phone'); setError(null); }}
              style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: 13, padding: 0, textDecoration: 'underline', fontFamily: 'inherit' }}>
              Change
            </button>
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              ref={otpRef}
              className="co-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              name="verify-otp"
              placeholder="6-digit code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={(e) => { if (e.key === 'Enter') void verify(); }}
              style={{ letterSpacing: 4, textAlign: 'center' }}
            />
            <button type="button" style={{ ...primary, opacity: busy || otp.length !== 6 ? 0.6 : 1 }} disabled={busy || otp.length !== 6} onClick={verify}>
              {busy ? 'Checking…' : 'Verify'}
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#777', marginTop: 8 }}>
            Didn&apos;t get it?{' '}
            {cooldown > 0 ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <button type="button" onClick={send} disabled={busy}
                style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: 12, padding: 0, textDecoration: 'underline', fontFamily: 'inherit' }}>
                Send a new code
              </button>
            )}
          </p>
        </>
      )}

      {error && (
        <p role="alert" style={{ marginTop: 10, fontSize: 13, color: '#b91c1c' }}>{error}</p>
      )}
    </div>
  );
}
