"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  brandAssets,
  credentials,
  footerLinks,
  issuerLogos,
  languages,
  legalLinks,
  profile,
} from "../../../../src/data/site";

const SIGN_IN_URL = "https://www.accredible.com/sign-in";

function Header() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="brand brand--logo" href="https://elvescore.jp">
          <img src={brandAssets.headerLogo.src} alt="Accredible Credential.net" height="32" className="brand__image" />
        </a>
        <nav className="topbar__nav" aria-label="Primary">
          <a href={SIGN_IN_URL}>Suggested Credentials</a>
          <a href={SIGN_IN_URL}>Career Journey</a>
          <a className="signin" href={SIGN_IN_URL}>
            <span className="signin__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" fill="currentColor" />
                <path d="M4 21c1.6-4.2 5-6 8-6s6.4 1.8 8 6" fill="currentColor" />
              </svg>
            </span>
            <span>Sign in</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer({ language, setLanguage }) {
  return (
    <footer className="site-footer">
      <div className="content-width footer-inner">
        <div className="footer-top">
          <a className="brand brand--logo footer-brand" href="https://elvescore.jp">
            <img src={brandAssets.footerLogo.src} alt="Accredible" height="28" className="brand__image brand__image--footer" />
          </a>
          <div className="footer-language">
            <label className="language-picker" htmlFor="languageSelect">
              <span>Language:</span>
              <select id="languageSelect" aria-label="Language selector" value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="footer-links">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              {group.items.map((item) => (
                <a key={item.label} href={item.url}>{item.label}</a>
              ))}
            </div>
          ))}
          <div className="footer-links__legal">
            {legalLinks.map((item) => (
              <a key={item.label} href={item.url}>{item.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function renderIssuerBadge(credential) {
  const logo = issuerLogos[credential.issuer];
  if (!logo) return <span>{credential.issuerShort}</span>;
  return (
    <>
      <span className="issuer-badge-img">
        <img src={logo.src} alt={`${credential.issuer} logo`} />
      </span>
      <span className="verified-check" aria-label="Verified issuer">
        <svg viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8" fill="#1d9bf0" />
          <path d="M4.5 8l2.5 2.5 5-5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </span>
    </>
  );
}

function CredentialCard({ credential, username }) {
  const router = useRouter();
  return (
    <button
      className="credential-card"
      type="button"
      onClick={() => router.push(`/profile/${username}/wallet/${credential.id}`)}
    >
      <div className="credential-card__media">
        <div className={`credential-art credential-art--image ${credential.type === "certificate" ? "" : "credential-art--badge-only"}`}>
          <img
            src={(credential.type === "certificate" ? credential.certImg : credential.badgeImg).src}
            alt={`${credential.shortCode} credential`}
          />
        </div>
      </div>
      <div className="credential-card__body">
        <h3 className="credential-card__title">{credential.title}</h3>
        <p className="credential-card__date">{credential.issuedOn}</p>
        <p className="credential-card__issuer">{credential.issuer}</p>
      </div>
    </button>
  );
}

export default function WalletPage() {
  const { username } = useParams();
  const [language, setLanguage] = useState("en-us");

  return (
    <div className="page-shell">
      <Header />
      <main>
        <section className="profile-strip view-section">
          <div className="profile-strip__inner">
            <div className="profile-strip__avatar" aria-hidden="true">
              <img src={profile.recipientPhoto.src} alt={profile.name} />
            </div>
            <div>
              <h1>{profile.name}</h1>
              <p>
                {profile.credentials} Credentials <span>|</span> {profile.issuers} Issuers
              </p>
            </div>
          </div>
        </section>

        <section className="list-layout view-section" aria-labelledby="credentialsHeading">
          <div className="content-width">
            <article className="insight-banner">
              <div className="insight-banner__icon" aria-hidden="true">
                <svg viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="24" fill="currentColor" />
                  <path d="M11 30l8-8 7 6 11-14" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="30" r="3" fill="white" />
                  <circle cx="19" cy="22" r="3" fill="white" />
                  <circle cx="26" cy="28" r="3" fill="white" />
                  <circle cx="37" cy="14" r="3" fill="white" />
                </svg>
              </div>
              <div className="insight-banner__copy">
                <h2>Personalized Career Insights</h2>
                <p>Sign in to view tailored job insights based on your earned credentials.</p>
              </div>
              <a className="ghost-button" href={SIGN_IN_URL}>Sign In</a>
            </article>

            <h2 className="sr-only" id="credentialsHeading">Credentials</h2>
            <div className="credential-grid">
              {credentials.map((credential) => (
                <CredentialCard key={credential.id} credential={credential} username={username} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
