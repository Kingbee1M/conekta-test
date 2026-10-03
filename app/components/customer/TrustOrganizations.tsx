'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './TrustOrganizations.module.css';

const ORGANIZATIONS = [
  {
    name: 'Corporate Affairs Commission',
    shortName: 'CAC',
    logo: '/trusts/cac.webp',
    description:
      'Nigeria’s official registry for businesses and corporate entities.',
    href: 'https://www.cac.gov.ng/',
  },
  {
    name: 'Estate Surveyors and Valuers Registration Board of Nigeria',
    shortName: 'ESVARBON',
    logo: '/trusts/esvarbon.jpeg',
    description:
      'The statutory body responsible for registering and regulating estate surveying and valuation professionals in Nigeria.',
    href: 'https://esvarbon.gov.ng/',
  },
  {
    name: 'Kjoller',
    shortName: 'KJOLLER',
    logo: '/trusts/kjoller-logo.svg',
    description:
      'Kjøller is a privately held holding and investment company. We focus on investments. They invest in both startups and mature companies',
    href: 'https://kjoller.com/',
  },
  {
    name: 'Lagos State Employment Trust Fund',
    shortName: 'LSETF',
    logo: '/trusts/lseft.png',
    description:
      'A Lagos State initiative supporting employment, entrepreneurship, and small businesses.',
    href: 'https://lsetf.ng/',
  },
  {
    name: 'Nigerian Institution of Estate Surveyors and Valuers',
    shortName: 'NIESV',
    logo: '/trusts/niesv.png',
    description:
      'Nigeria’s professional institution for estate surveyors and valuers.',
    href: 'https://niesv.org.ng/',
  },
  {
    name: 'Real Estate Developers Association of Nigeria',
    shortName: 'REDAN',
    logo: '/trusts/redan.png',
    description:
      'An association representing real estate developers and promoting professional standards across Nigeria.',
    href: 'https://redanonline.org/',
  },
] as const;

const AUTOPLAY_DELAY = 4500;

export default function TrustOrganizations() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardSpacing, setCardSpacing] = useState(190);
  const prefersReducedMotion = useReducedMotion();
  const activeOrganization = ORGANIZATIONS[activeIndex];

  useEffect(() => {
    const updateCardSpacing = () => {
      setCardSpacing(window.innerWidth < 640 ? 145 : 245);
    };

    updateCardSpacing();
    window.addEventListener('resize', updateCardSpacing);
    return () => window.removeEventListener('resize', updateCardSpacing);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % ORGANIZATIONS.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(intervalId);
  }, [isPaused, prefersReducedMotion]);

  const moveBy = (amount: number) => {
    setActiveIndex(
      (index) =>
        (index + amount + ORGANIZATIONS.length) % ORGANIZATIONS.length,
    );
  };

  return (
    <section
      className={styles.section}
      aria-labelledby="trust-organizations-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Trust &amp; recognition</p>
        <h2 id="trust-organizations-title" className={styles.heading}>
          Registered. Recognized. Built on trust.
        </h2>
        <p className={styles.intro}>
          We’re registered with and connected to respected organizations across
          Nigerian business and real estate.
        </p>

        <div className={styles.carousel}>
          <div className={styles.stage} aria-label="Organization logos">
            {ORGANIZATIONS.map((organization, index) => {
              const relativeIndex =
                (index - activeIndex + ORGANIZATIONS.length) %
                ORGANIZATIONS.length;
              const offset =
                relativeIndex > ORGANIZATIONS.length / 2
                  ? relativeIndex - ORGANIZATIONS.length
                  : relativeIndex;
              const distance = Math.abs(offset);

              if (distance > 2) return null;

              return (
                <motion.button
                  key={organization.shortName}
                  type="button"
                  className={`${styles.card} ${
                    offset === 0 ? styles.activeCard : ''
                  }`}
                  style={{ zIndex: ORGANIZATIONS.length - distance }}
                  animate={{
                    x: offset * cardSpacing,
                    rotateY: offset * -30,
                    scale: offset === 0 ? 1 : distance === 1 ? 0.78 : 0.62,
                    opacity: offset === 0 ? 1 : distance === 1 ? 0.65 : 0.32,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${organization.name}`}
                  aria-pressed={offset === 0}
                  tabIndex={distance > 1 ? -1 : 0}
                >
                  <span className={styles.logoFrame}>
                    <Image
                      src={organization.logo}
                      alt=""
                      width={280}
                      height={150}
                      className={styles.logo}
                    />
                  </span>
                  <span className={styles.cardName}>
                    {organization.shortName}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => moveBy(-1)}
              aria-label="Previous organization"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <div className={styles.dots} aria-label="Choose an organization">
              {ORGANIZATIONS.map((organization, index) => (
                <button
                  key={organization.shortName}
                  type="button"
                  className={`${styles.dot} ${
                    index === activeIndex ? styles.activeDot : ''
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${organization.name}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => moveBy(1)}
              aria-label="Next organization"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeOrganization.shortName}
            className={styles.details}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
            aria-live="polite"
          >
            <p className={styles.organizationLabel}>
              {activeOrganization.shortName}
            </p>
            <h3 className={styles.organizationName}>
              {activeOrganization.name}
            </h3>
            <p className={styles.description}>
              {activeOrganization.description}
            </p>
            {activeOrganization.href ? (
              <a
                className={styles.link}
                href={activeOrganization.href}
                target="_blank"
                rel="noreferrer"
              >
                Visit organization website
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            ) : (
              <span className={styles.pendingLink}>
                Official website link coming soon
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
