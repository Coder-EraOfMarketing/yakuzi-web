'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@yukizi/api-client';

const RESEND_SECONDS = 30;
const PHONE_RE = /^[6-9]\d{9}$/;

/**
 * Sits directly under the Phone field on checkout, for someone who is not logged
 * in. There is deliberately NO second phone input: the Phone field the shopper
 * is already filling in is the number being confirmed.
 *
 * The phone is mandatory at checkout, so it doubles as the proof of who the
 * buyer is. Confirming it by one-time code either logs them into the account that
 * number already belongs to, or creates a buyer account for it (the same
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
  phone: phoneField,
  onVerified,
}: {
  /** The current value of the Phone field above; whatever was typed there. */
  phone: string;
  /** Called with the confirmed 10-digit number once the session exists. */
  onVerified: (phone: string) => void;
}) {
  const { sendOtp, verifyOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'idle' | 'otp'>('idle');
  const [sentTo, setSentTo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);

  // The field takes "+91 98765 43210" or "098765…" as readily as ten bare digits.
  const phone = phoneField.replace(/\D/g, '').slice(-10);
  const phoneValid = PHONE_RE.test(phone);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === 'otp') otpRef.current?.focus();
  }, [step]);

  // If they edit the Phone field after a code was sent, that code belongs to the
  // old number: go back to the start rather than verifying the wrong one.
  useEffect(() => {
    if (step === 'otp' && phone !== sentTo) {
      setStep('idle');
      setOtp('');
      setError(null);
    }
  }, [phone, sentTo, step]);

  const send = async () => {
    if (!phoneValid) {
      setError('Enter a valid 10-digit mobile number in the Phone field above.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await sendOtp(phone);
      setSentTo(phone);
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
      await verifyOtp(sentTo, otp);
      onVerified(sentTo);
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
  const link: React.CSSProperties = {
    background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: 12, padding: 0,
    textDecoration: 'underline', fontFamily: 'inherit',
  };

  return (
    <div
      id="guest-phone-verification"
      style={{ background: '#fff', border: '1px solid #cfe0f5', borderRadius: 8, padding: 12, marginTop: 8 }}
    >
      {step === 'idle' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <p style={{ flex: 1, minWidth: 180, fontSize: 13, color: '#555', lineHeight: 1.4 }}>
            Confirm this number with a one-time code to place your order. It also sets up your Yukizi
            account, so you can track it. No password needed.
          </p>
          <button type="button" style={{ ...primary, opacity: busy || !phoneValid ? 0.6 : 1 }} disabled={busy || !phoneValid} onClick={send}>
            {busy ? 'Sending…' : 'Send code'}
          </button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>
            We sent a code to +91 {sentTo}. Edit the Phone field above to use a different number.
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
              <button type="button" onClick={send} disabled={busy} style={link}>
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
