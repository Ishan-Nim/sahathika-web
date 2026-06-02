import ejptCert from "../../Certs/1.png";
import emaptCert from "../../Certs/2.png";
import ecpptCert from "../../Certs/3.png";
import cehCert from "../../Certs/4.png";
import oscpCert from "../../Certs/7.png";

import recipientPhoto from "../../cert_images/wallet_ishannim725761/009_17547308458293757209917787462506_jpeg.jpeg";
import ineLogo from "../../cert_images/5288c26e-cd38-47c1-b036-eaa1ed04cc92/009_16945463285349996469494460218671_png.png";
import offsecLogo from "../../cert_images/d47f0b7b-cb87-4dc3-b4ea-498df7fa07aa/007_1677688426119022572090472748455_png.png";
import ecLogo from "../../cert_images/ec_logo.png";

import ejptBadge from "../../cert_images/5288c26e-cd38-47c1-b036-eaa1ed04cc92/012_16947192901898719699151540862834_png.png";
import emaptBadge from "../../cert_images/2c262235-047f-40a1-a63a-e8422993bc8e/010_16947191522574407741170443928939_png.png";
import ecpptBadge from "../../cert_images/15172f35-44b0-45c0-b9bc-ea122c51307f/010_16947190403078086581199361007762_png.png";
import cehBadge from "../../cert_images/ceh/badge.png";
import oscpBadge from "../../cert_images/d47f0b7b-cb87-4dc3-b4ea-498df7fa07aa/006_1677682410975725023965573912354_png.png";

import accredibleHeaderLogo from "../../accredible_credential_net_logo.svg";
import accredibleFooterLogo from "../../accredible_logo.svg";

export const brandAssets = {
  headerLogo: accredibleHeaderLogo,
  footerLogo: accredibleFooterLogo,
};

export const profile = {
  name: "Ishan Nimantha",
  credentials: 5,
  issuers: 3,
  recipientPhoto,
};

export const issuerUrls = {
  INE: "https://ine.com",
  "EC-Council": "https://www.eccouncil.org",
  OffSec: "https://www.offsec.com",
};

export const issuerLogos = {
  INE: ineLogo,
  OffSec: offsecLogo,
  "EC-Council": ecLogo,
};

export const footerLinks = [
  {
    title: "Issue Credentials",
    items: [
      { label: "About Accredible", url: "https://www.accredible.com/about" },
      { label: "Request a Demo", url: "https://www.accredible.com/demo" },
    ],
  },
  {
    title: "Credential Recipients",
    items: [
      { label: "Retrieve a Credential", url: "https://v2.accounts.accredible.com/credential-retrieval" },
      { label: "Help", url: "https://help.accredible.com/" },
      { label: "Coursefinder", url: "https://www.coursefinder.io/" },
    ],
  },
];

export const legalLinks = [
  { label: "Terms of Service", url: "https://www.accredible.com/legal/terms-of-service" },
  { label: "Privacy Policy", url: "https://www.accredible.com/legal/privacy-policy" },
  { label: "Accessibility", url: "https://help.accredible.com/accessibility" },
  { label: "Site Map", url: "https://www.credential.net/site-map" },
];

export const languages = [
  { code: "en-us", label: "English (US)" },
  { code: "en-uk", label: "English (UK)" },
  { code: "es", label: "Español" },
  { code: "es-419", label: "Español (Latinoamérica)" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt-br", label: "Português (Brasil)" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh-cn", label: "简体中文" },
  { code: "zh-hk", label: "繁體中文" },
  { code: "ar", label: "عربى" },
  { code: "hi", label: "हिन्दी" },
];

export const verifySteps = [
  "Verifying credential data",
  "Verifying issuer",
  "Checking blockchain records",
  "Verifying owner",
  "Checking credential status",
];

export const credentials = [
  {
    id: "ejpt",
    title: "Junior Penetration Tester",
    shortCode: "eJPT",
    issuedOn: "August 9, 2025",
    expiresOn: "August 9, 2028",
    issuer: "INE",
    issuerShort: "INE",
    type: "certificate",
    recipient: "Ishan Nimantha",
    recipientInitials: "IN",
    recipientPhoto,
    certImg: ejptCert,
    badgeImg: ejptBadge,
    credentialUrl: "https://www.credential.net/5288c26e-cd38-47c1-b036-eaa1ed04cc92#acc.LMRW6KEi",
    careerJourneyUrl: "https://app.mycareerjourney.com/speak-your-skills/5288c26e-cd38-47c1-b036-eaa1ed04cc92",
    blockchainId: null,
    certId: "157709114",
    summary:
      "The Junior Penetration Tester (eJPT) is a thoughtfully crafted certification designed to test you on every phase of the penetration life cycle from assessment methodologies, to host and network auditing, host and network penetration testing, and web application penetration testing. This browser-based, hands-on exam mirrors real world junior penetration tasks using a methodological approach. Our exam environment features modern infrastructure, operating systems, and current software versions, while using innovative technology to make each user's testing experience unique.",
    skills: [
      "Assessment Methodologies",
      "Web Application Penetration Testing",
      "Host & Networking Penetration Testing",
      "Host & Networking Auditing",
    ],
    talkingPoint:
      "You've demonstrated foundational penetration testing knowledge spanning network auditing, web application testing, and host-based exploitation using a methodological approach.",
  },
  {
    id: "emapt",
    title: "Mobile Application Penetration Tester",
    shortCode: "eMAPT",
    issuedOn: "May 3, 2026",
    expiresOn: "May 3, 2029",
    issuer: "INE",
    issuerShort: "INE",
    type: "certificate",
    recipient: "Ishan Nimantha",
    recipientInitials: "IN",
    recipientPhoto,
    certImg: emaptCert,
    badgeImg: emaptBadge,
    credentialUrl: "https://www.credential.net/2c262235-047f-40a1-a63a-e8422993bc8e",
    careerJourneyUrl: "https://app.mycareerjourney.com/speak-your-skills/2c262235-047f-40a1-a63a-e8422993bc8e",
    blockchainId: null,
    certId: "181370914",
    summary:
      "The eMAPT credential validates hands-on mobile application penetration testing skills, including Android and iOS assessment workflows, reverse engineering, traffic interception, and secure reporting.",
    skills: ["Mobile Security Testing", "Reverse Engineering", "Threat Analysis"],
    talkingPoint:
      "You've practiced practical mobile app testing across modern attack paths, showing strong command of reverse engineering, interception, and reporting workflows.",
  },
  {
    id: "ecppt",
    title: "Certified Professional Penetration Tester",
    shortCode: "eCPPT",
    issuedOn: "July 6, 2025",
    expiresOn: "July 6, 2028",
    issuer: "INE",
    issuerShort: "INE",
    type: "certificate",
    recipient: "Ishan Nimantha",
    recipientInitials: "IN",
    recipientPhoto,
    certImg: ecpptCert,
    badgeImg: ecpptBadge,
    credentialUrl: "https://www.credential.net/15172f35-44b0-45c0-b9bc-ea122c51307f#acc.7vkiAqOe",
    careerJourneyUrl: "https://app.mycareerjourney.com/speak-your-skills/15172f35-44b0-45c0-b9bc-ea122c51307f",
    blockchainId: null,
    certId: "154311923",
    summary:
      "The eCPPT credential demonstrates professional penetration testing capability spanning reconnaissance, exploitation, pivoting, lateral movement, and concise technical communication.",
    skills: ["Network Penetration Testing", "Privilege Escalation", "Reporting"],
    talkingPoint:
      "You've demonstrated the ability to plan and execute realistic penetration tests while clearly communicating risk, methodology, and results.",
  },
  {
    id: "ceh",
    title: "Certified Ethical Hacker (CEH)",
    shortCode: "CEH",
    issuedOn: "April 28, 2026",
    expiresOn: "May 1, 2027",
    issuer: "EC-Council",
    issuerShort: "EC",
    type: "ceh",
    recipient: "Ishan Nimantha",
    recipientInitials: "IN",
    recipientPhoto,
    certImg: cehCert,
    badgeImg: cehBadge,
    credentialUrl: "https://aspen.eccouncil.org/Home",
    careerJourneyUrl: null,
    blockchainId: null,
    certId: "ECC4091838573",
    summary:
      "The CEH certification validates knowledge of ethical hacking methodologies, attack vectors, and countermeasures across network security, web application security, and system hacking.",
    skills: ["Ethical Hacking", "Network Security", "Vulnerability Assessment"],
    talkingPoint:
      "You've demonstrated comprehensive knowledge of attacker tools and techniques to proactively defend systems and networks against real-world threats.",
  },
  {
    id: "oscp",
    title: "OffSec Certified Professional (OSCP)",
    shortCode: "OSCP",
    issuedOn: "May 19, 2025",
    expiresOn: "May 19, 2028",
    issuer: "OffSec",
    issuerShort: "OFF",
    type: "oscp",
    recipient: "Ishan Nimantha",
    recipientInitials: "IN",
    recipientPhoto,
    certImg: oscpCert,
    badgeImg: oscpBadge,
    credentialUrl: "https://www.credential.net/d47f0b7b-cb87-4dc3-b4ea-498df7fa07aa#acc.hj8Uvkrb",
    careerJourneyUrl: "https://app.mycareerjourney.com/speak-your-skills/d47f0b7b-cb87-4dc3-b4ea-498df7fa07aa",
    blockchainId: null,
    certId: null,
    summary:
      "The OSCP credential validates practical offensive security skill through real exploitation, enumeration, privilege escalation, and exam-proven persistence under a 24-hour proctored lab environment.",
    skills: ["Offensive Security", "Privilege Escalation", "Enumeration"],
    talkingPoint:
      "You've proven hands-on offensive security ability by chaining enumeration, exploitation, and privilege escalation under real exam conditions.",
  },
];
