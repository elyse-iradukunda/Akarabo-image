import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, CameraIcon, CheckIcon, ClockIcon, MailIcon, MenuIcon, UsersIcon, XIcon } from '../assets';
import { ClientPhotoSlider } from '../components/ClientPhotoSlider';
import { fetchClientPhotos, type ClientPhoto } from '../data/clientPhotos';
import { useAuth } from '../context/AuthContext';
import { inquiryService } from '../services/inquiryService';
import { useLanguage } from '../i18n/LanguageContext';
import { Modal } from '../ui/Modal';
import { toast } from 'react-toastify';
import type { CreateInquiryPayload } from '../types/inquiry';

const services = [
  { icon: CameraIcon, title: 'service.weddings', text: 'service.weddingsText' },
  { icon: UsersIcon, title: 'service.portraits', text: 'service.portraitsText' },
  { icon: CalendarIcon, title: 'service.celebrations', text: 'service.celebrationsText' },
  { icon: ClockIcon, title: 'service.brand', text: 'service.brandText' },
] as const;

const packages = [
  { name: 'Essential', price: 'From RWF 300K', text: 'A beautiful beginning for intimate celebrations.', items: ['Up to 2 hours coverage', '40 edited photographs', 'Private online gallery'] },
  { name: 'Signature', price: 'From RWF 650K', text: 'A little more room for the story to unfold.', items: ['Up to 6 hours coverage', '80 edited photographs', 'Print-ready gallery', 'Planning consultation'], featured: true },
  { name: 'Full story', price: 'From RWF 1.2M', text: 'The complete experience, from first look to last dance.', items: ['Full day coverage', '150 edited photographs', 'Cinematic highlight film', 'Keepsake photo book'] },
];

const testimonials = [
  { quote: 'They captured the feeling of the day so beautifully. Looking through our gallery felt like being there all over again.', name: 'Aline & John', kind: 'Wedding · Kigali' },
  { quote: 'The whole team made us feel comfortable, and the photos are full of personality. We could not be happier.', name: 'The Mugabo family', kind: 'Family portraits' },
  { quote: 'Professional, calm and creative. They turned our event into a story our whole team is proud to share.', name: 'Ignace Group', kind: 'Brand event' },
];

/** Public studio site and client inquiry entry point. */
export function Landing() {
  const { isAuthenticated } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [sending, setSending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [pendingInquiry, setPendingInquiry] = useState<CreateInquiryPayload | null>(null);
  const [clientPhotos, setClientPhotos] = useState<ClientPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [photosFailed, setPhotosFailed] = useState(false);
  const photoFeedUrl = import.meta.env.VITE_CLIENT_PHOTOS_URL?.trim();

  useEffect(() => {
    if (!photoFeedUrl) return;

    const controller = new AbortController();
    setPhotosLoading(true);
    setPhotosFailed(false);
    fetchClientPhotos(photoFeedUrl, controller.signal)
      .then(setClientPhotos)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setPhotosFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setPhotosLoading(false);
      });

    return () => controller.abort();
  }, [photoFeedUrl]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setPendingInquiry({
      name: String(values.get('name') ?? '').trim(),
      email: String(values.get('email') ?? '').trim(),
      service: String(values.get('service') ?? ''),
      preferredDate: String(values.get('date') ?? '') || undefined,
      message: String(values.get('message') ?? '').trim() || undefined,
    });
  }

  async function confirmInquiry() {
    if (!pendingInquiry) return;
    setSending(true);
    try {
      await inquiryService.create(pendingInquiry);
      setInquirySent(true);
      setPendingInquiry(null);
      toast.success(t('form.success'));
    } catch {
      toast.error(t('form.error'));
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="studio-site">
      <header className="studio-nav" ref={navRef}>
        <a href="#home" className="studio-brand" aria-label="Akarabo Image home"><span className="studio-brand__mark">A</span><span>akarabo<span className="studio-brand__light">image</span><small>PHOTOGRAPHY STUDIO · KIGALI</small></span></a>
        <div className="studio-language" role="group" aria-label="Select language">{(['en', 'rw', 'fr'] as const).map((choice) => <button key={choice} type="button" aria-pressed={locale === choice} onClick={() => setLocale(choice)}>{choice.toUpperCase()}</button>)}</div>
        <button className="studio-nav__toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}</button>
        <nav className={menuOpen ? 'studio-nav__links is-open' : 'studio-nav__links'} aria-label="Main navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}><CameraIcon size={17} /><span>{t('nav.work')}</span></a>
          <a href="#services" onClick={() => setMenuOpen(false)}><UsersIcon size={17} /><span>{t('nav.services')}</span></a>
          <a href="#packages" onClick={() => setMenuOpen(false)}><CalendarIcon size={17} /><span>{t('nav.packages')}</span></a>
          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="studio-nav__staff"><span className="studio-nav__staff-dot" />{t('nav.login')}</Link>
          <a href="#contact" className="studio-button studio-button--small" onClick={() => setMenuOpen(false)}><MailIcon size={17} />{t('nav.enquire')}</a>
        </nav>
      </header>

      <section className="studio-hero" id="home">
        <div className="studio-hero__image" role="img" aria-label="A couple sharing a joyful moment at their wedding" />
        <div className="studio-hero__shade" />
        <div className="studio-hero__content">
          <p className="studio-kicker studio-kicker--light"><span /> {t('hero.kicker')}</p>
          <h1>{locale === 'en' ? <>For the moments<br />you want to <em>keep.</em></> : t('hero.title')}</h1>
          <p className="studio-hero__intro">{t('hero.intro')}</p>
          <div className="studio-hero__actions"><a className="studio-button" href="#contact">{t('hero.book')} <span aria-hidden="true">↗</span></a><a className="studio-text-link" href="#work">{t('hero.explore')} <span aria-hidden="true">↓</span></a></div>
          <div className="studio-hero__note"><span>01</span><span>{t('hero.note')}</span><span className="studio-hero__line" /></div>
        </div>
        <div className="studio-hero__side">{t('hero.side')}</div>
      </section>

      <section className="studio-intro" aria-label="About our studio"><p className="studio-kicker">{t('intro.kicker')}</p><h2>{locale === 'en' ? <>Beautiful photographs begin with<br className="desktop-break" /> feeling <em>at home.</em></> : t('intro.title')}</h2><p>{t('intro.text')}</p><a className="studio-inline-link" href="#services">{t('intro.link')} <span>↗</span></a></section>

      <section className="studio-work" id="work"><div className="studio-section-heading"><div><p className="studio-kicker">{t('work.kicker')}</p><h2>{t('work.title')}</h2></div><p>{t('work.text')}</p></div>{photosLoading ? <p role="status">{t('work.loading')}</p> : clientPhotos.length ? <ClientPhotoSlider slides={clientPhotos} /> : <p role={photosFailed ? 'alert' : undefined}>{photosFailed ? t('work.loadError') : t('work.empty')}</p>}</section>

      <section className="studio-services" id="services"><div className="studio-section-heading"><div><p className="studio-kicker">{t('services.kicker')}</p><h2>{t('services.title')}</h2></div><p>{t('services.text')}</p></div><div className="studio-services__grid">{services.map(({ icon: Icon, title, text }, i) => <article className="studio-service" key={title}><span className="studio-service__number">0{i + 1}</span><span className="studio-service__icon"><Icon size={22} /></span><h3>{t(title)}</h3><p>{t(text)}</p><a href="#contact" aria-label={`${t('nav.enquire')} ${t(title)}`}>↗</a></article>)}</div></section>

      <section className="studio-packages" id="packages"><div className="studio-section-heading"><div><p className="studio-kicker">{t('packages.kicker')}</p><h2>{t('packages.title')}</h2></div><p>{t('packages.text')}</p></div><div className="studio-packages__grid">{packages.map((pkg) => <article className={pkg.featured ? 'studio-package is-featured' : 'studio-package'} key={pkg.name}>{pkg.featured && <span className="studio-package__label">{t('packages.popular')}</span>}<p className="studio-package__price">{pkg.price}</p><h3>{pkg.name}</h3><p className="studio-package__text">{pkg.text}</p><ul>{pkg.items.map((item) => <li key={item}><CheckIcon size={16} />{item}</li>)}</ul><a href="#contact" className={pkg.featured ? 'studio-button studio-button--full' : 'studio-outline-button'}>{t('packages.ask')} {pkg.name} <span>↗</span></a></article>)}</div></section>

      <section className="studio-love"><div className="studio-love__heading"><p className="studio-kicker studio-kicker--light">{t('love.kicker')}</p><h2>{t('love.title')}</h2><p>{t('love.text')}</p></div><div className="studio-love__quotes">{testimonials.map((item) => <figure key={item.name}><span className="studio-quote-mark">“</span><blockquote>{item.quote}</blockquote><figcaption><strong>{item.name}</strong><span>{item.kind}</span></figcaption></figure>)}</div></section>

      <section className="studio-contact" id="contact"><div className="studio-contact__copy"><p className="studio-kicker">{t('contact.kicker')}</p><h2>{t('contact.title')}</h2><p>{t('contact.text')}</p><div className="studio-contact__direct"><span>{t('contact.team')}</span><span>{t('contact.reply')}</span></div></div><form className="studio-inquiry" onSubmit={submitInquiry}><div className="studio-inquiry__heading"><span>{t('contact.formKicker')}</span><p>{t('contact.formIntro')}</p></div>{inquirySent ? <div className="studio-inquiry__success" role="status"><span>✓</span><strong>{t('form.success')}</strong><p>{t('form.followup')}</p><button type="button" className="studio-outline-button" onClick={() => setInquirySent(false)}>{t('form.another')}</button></div> : <><label>{t('form.name')}<input name="name" autoComplete="name" placeholder="e.g. Aline Mukamana" required /></label><div className="studio-inquiry__row"><label>{t('form.email')}<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label><label>{t('form.service')}<select name="service" defaultValue="Wedding"><option value="Wedding">{t('form.service.wedding')}</option><option value="Portrait session">{t('form.service.portrait')}</option><option value="Family photography">{t('form.service.family')}</option><option value="Celebration or event">{t('form.service.event')}</option><option value="Brand photography">{t('form.service.brand')}</option><option value="Something else">{t('form.service.other')}</option></select></label></div><label>{t('form.date')} <span className="studio-optional">{t('form.optional')}</span><input name="date" type="date" /></label><label>{t('form.message')}<textarea name="message" rows={3} placeholder={t('form.messageHint')} /></label><button type="submit" className="studio-button studio-button--full">{t('form.submit')} <span>↗</span></button><p className="studio-inquiry__privacy">{t('form.privacy')}</p></>}</form></section>

      <footer className="studio-footer"><a href="#home" className="studio-brand"><span className="studio-brand__mark">A</span><span>akarabo<span className="studio-brand__light">image</span><small>PHOTOGRAPHY STUDIO · KIGALI</small></span></a><p>{t('footer.made')}</p><a href="#home">{t('footer.top')} ↑</a></footer>
      <Modal open={Boolean(pendingInquiry)} onClose={() => !sending && setPendingInquiry(null)} title={t('form.confirmTitle')} footer={<><button type="button" className="ak-button ak-button--secondary" onClick={() => setPendingInquiry(null)} disabled={sending}>{t('form.cancel')}</button><button type="button" className="ak-button ak-button--primary" onClick={() => void confirmInquiry()} disabled={sending}>{sending ? t('form.sending') : t('form.confirm')}</button></>}>
        <p>{t('form.confirmText')}</p>
        {pendingInquiry && <div className="studio-confirm-summary"><strong>{pendingInquiry.name}</strong><span>{pendingInquiry.email}</span><span>{pendingInquiry.service}{pendingInquiry.preferredDate ? ` · ${pendingInquiry.preferredDate}` : ''}</span></div>}
      </Modal>
    </main>
  );
}

export default Landing;
