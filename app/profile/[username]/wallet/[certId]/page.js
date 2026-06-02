"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  brandAssets,
  credentials,
  footerLinks,
  issuerLogos,
  issuerUrls,
  languages,
  legalLinks,
  verifySteps,
} from "../../../../../src/data/site";

const SIGN_IN_URL = "https://www.accredible.com/sign-in";

function Header() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="brand brand--logo" href="https://www.credential.net/">
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
          <a className="brand brand--logo footer-brand" href="https://www.credential.net/">
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
  const issuerKey = credential.issuer.toLowerCase().replace(/[^a-z]/g, "");
  if (!logo) return <span>{credential.issuerShort}</span>;
  return (
    <>
      <span className={`issuer-badge-img issuer-badge-img--${issuerKey}`}>
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

function VerifyModal({ credential, open, onClose }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;
    setProgress(0);
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      setProgress(step);
      if (step >= verifySteps.length) clearInterval(timer);
    }, 480);
    return () => clearInterval(timer);
  }, [open]);

  if (!open || !credential) return null;

  return (
    <div className="verify-modal-backdrop" onClick={onClose}>
      <div className="verify-modal" onClick={(e) => e.stopPropagation()}>
        <button className="verify-modal__close" type="button" onClick={onClose}>
          ×
        </button>
        <h3>Verifying Credential</h3>
        <p className="verify-modal__sub">{credential.title}</p>
        <div className="verify-steps">
          {verifySteps.map((step, index) => (
            <div key={step} className={`verify-step ${index < progress ? "is-done" : index === progress ? "is-active" : ""}`}>
              <span className="verify-step__dot" />
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="verify-result">
          <strong>{progress >= verifySteps.length ? "Credential verified" : "Processing..."}</strong>
          <p>{credential.certId ? `Credential ID: ${credential.certId}` : "Issuer and credential data are being checked."}</p>
        </div>
      </div>
    </div>
  );
}

function DetailView({ credential, username }) {
  const router = useRouter();
  const [galleryState, setGalleryState] = useState("card");
  const [showDownload, setShowDownload] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const previewImage = galleryState === "card" ? credential.certImg : credential.badgeImg;
  const certDownloadName = `${credential.shortCode}-certificate.png`;
  const badgeDownloadName = `${credential.shortCode}-badge.png`;

  const handleBack = () => router.push(`/profile/${username}/wallet`);

  return (
    <>
      <section className="detail-view view-section">
        <div className="detail-hero">
          <div className="content-width detail-hero__inner">
            <div className="detail-gallery">
              <div className="detail-gallery__thumbs">
                <button
                  className={`thumb-card ${galleryState === "card" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setGalleryState("card")}
                >
                  <div className="credential-art credential-art--image">
                    <img src={credential.certImg.src} alt={`${credential.shortCode} cert`} />
                  </div>
                </button>
                <button
                  className={`thumb-card ${galleryState === "badge" ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setGalleryState("badge")}
                >
                  <div className="credential-art credential-art--image">
                    <img src={credential.badgeImg.src} alt={`${credential.shortCode} badge`} />
                  </div>
                </button>
              </div>
              <div className="detail-gallery__preview">
                <div
                  className={`credential-art credential-art--image ${
                    galleryState === "card"
                      ? credential.type === "certificate"
                        ? "credential-art--cert-portrait"
                        : "credential-art--landscape-cert"
                      : "credential-art--badge-view"
                  }`}
                >
                  <img src={previewImage.src} alt={credential.title} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-width detail-content">
          <section className="detail-main">
            <div className="issuer-line">
              <div className="issuer-badge">{renderIssuerBadge(credential)}</div>
              <a className="issuer-line__name" href={credential.credentialUrl}>
                {credential.issuer}
              </a>
            </div>

            <h2>{credential.title}</h2>

            <div className="action-row">
              <div className="action-drop">
                <button className="action-btn" type="button" onClick={() => setShowDownload((v) => !v)}>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 3v9m0 0l-3-3m3 3l3-3M4 15h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  DOWNLOAD
                </button>
                {showDownload && (
                  <div className="action-drop__menu">
                    <div className="drop-section-title">Download certificate as</div>
                    <a className="drop-item" href={credential.certImg.src} download={certDownloadName}>
                      <span>JSON</span><span className="drop-item__sub">Open Badge 3.0</span>
                    </a>
                    <a className="drop-item" href={credential.certImg.src} download={certDownloadName}>
                      <span>JSON</span><span className="drop-item__sub">W3C Verified Credential</span>
                    </a>
                    <div className="drop-section-title">Download badge as</div>
                    <a className="drop-item" href={credential.badgeImg.src} download={badgeDownloadName}>
                      <span>JSON</span><span className="drop-item__sub">Open Badge 3.0</span>
                    </a>
                    <a className="drop-item" href={credential.badgeImg.src} download={badgeDownloadName}>
                      <span>JSON</span><span className="drop-item__sub">W3C Verified Credential</span>
                    </a>
                  </div>
                )}
              </div>

              <button className="action-btn" type="button">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M8 8a2 2 0 114 0c0 1.5-2 2-2 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <circle cx="10" cy="15" r=".8" fill="currentColor" />
                </svg>
                HELP
              </button>

              <div className="action-drop">
                <button className="action-btn" type="button" onClick={() => setShowMore((v) => !v)}>
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style={{ width: 12, height: 12 }}>
                    <path d="M5 8l5 5 5-5H5z" />
                  </svg>
                  MORE
                </button>
                {showMore && (
                  <div className="action-drop__menu">
                    <a className="drop-item" href={`mailto:support@${credential.issuer.toLowerCase().replace(/[^a-z]/g, "")}.com`}>
                      Contact Issuer
                    </a>
                    <a className="drop-item" href={credential.credentialUrl} target="_blank" rel="noopener noreferrer">
                      More Information
                    </a>
                  </div>
                )}
              </div>
            </div>

            <a className="subtle-link" href={SIGN_IN_URL}>
              Sign in to access more options
            </a>

            <div className="recipient-block">
              <div className="recipient-avatar">
                <img src={credential.recipientPhoto.src} alt={credential.recipient} />
              </div>
              <div>
                <h3>{credential.recipient}</h3>
                <div className="recipient-links">
                  <button type="button" onClick={handleBack}>View All Credentials</button>
                  <a href="https://www.linkedin.com/in/ishannim/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a href="https://x.com/d4rkelves" target="_blank" rel="noopener noreferrer">X</a>
                </div>
              </div>
            </div>

            <p className="detail-description">{credential.summary}</p>

            <div className="skills-block">
              <h3>Skills / Knowledge</h3>
              <div className="skills-list">
                {credential.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="date-grid">
              <div>
                <span>Issued on</span>
                <strong>{credential.issuedOn}</strong>
              </div>
              <div>
                <span>Expires on</span>
                <strong>{credential.expiresOn}</strong>
              </div>
            </div>
          </section>

          <aside className="detail-sidebar">
            <article className="value-panel">
              <div className="value-panel__header">
                <div className="value-panel__icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2L4 5.5V11c0 5.25 3.4 10.15 8 11.5 4.6-1.35 8-6.25 8-11.5V5.5L12 2z" fill="white" />
                  </svg>
                </div>
                <div className="value-panel__titles">
                  <h3>Share Your Value</h3>
                  <p>From this credential</p>
                </div>
                <div className="value-panel__sparkle" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M16 4l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" fill="white" />
                    <path d="M26 18l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" fill="white" opacity=".7" />
                  </svg>
                </div>
              </div>
              <p className="value-panel__intro">View your talking points — ready to use on your resume, LinkedIn, or in interviews.</p>
              <blockquote>
                <div className="value-panel__quote-label">TALKING POINT:</div>
                &quot;{credential.talkingPoint}&quot;
              </blockquote>
              <a className="value-panel__button" href={credential.careerJourneyUrl || SIGN_IN_URL} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <ellipse cx="12" cy="12" rx="10" ry="7" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
                View All Statements
              </a>
            </article>

            <article className="sidebar-card">
              <h3>Credential Verification</h3>
              <ul className="verify-list">
                <li>This credential is from a <strong>verified issuer</strong></li>
                <li>Secured by Blockchain <span className="copy-id">Copy ID</span></li>
              </ul>
              <button className="outline-button" type="button" onClick={() => setShowVerify(true)}>
                Verify Credential
              </button>
            </article>

            <article className="sidebar-card">
              <h3>More about the Issuer</h3>
              <div className="issuer-summary">
                <div className="issuer-badge">{renderIssuerBadge(credential)}</div>
                <span>{credential.issuer}</span>
              </div>
              <a className="outline-button" href={issuerUrls[credential.issuer] || "#"} target="_blank" rel="noopener noreferrer">
                Visit Issuer Website
              </a>
              <div className="sidebar-card__footer">
                <p>More credentials from the Issuer</p>
                <button type="button" onClick={handleBack}>View All Credentials</button>
              </div>
            </article>
          </aside>
        </div>
      </section>

      <VerifyModal credential={credential} open={showVerify} onClose={() => setShowVerify(false)} />
    </>
  );
}

export default function CertDetailPage() {
  const { username, certId } = useParams();
  const router = useRouter();
  const [language, setLanguage] = useState("en-us");

  const credential = credentials.find((c) => c.id === certId);

  if (!credential) {
    router.replace(`/profile/${username}/wallet`);
    return null;
  }

  return (
    <div className="page-shell">
      <Header />
      <main>
        <DetailView credential={credential} username={username} />
      </main>
      <Footer language={language} setLanguage={setLanguage} />
    </div>
  );
}
