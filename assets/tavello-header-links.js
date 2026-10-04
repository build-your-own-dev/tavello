(() => {
  const BYO = 'https://build-your-own.ch';
  let scheduled = false;

  function setHref(link, href) {
    if (link && link.getAttribute('href') !== href) link.setAttribute('href', href);
  }

  function makeNavLink(nav, label, href, afterLink) {
    let link = Array.from(nav.querySelectorAll(':scope > a')).find(item => item.textContent.trim() === label);
    if (!link) {
      const template = nav.querySelector(':scope > a');
      link = document.createElement('a');
      link.textContent = label;
      if (template) link.className = template.className;
      if (afterLink) afterLink.after(link);
      else nav.append(link);
    }
    setHref(link, href);
    return link;
  }

  function syncNav(nav) {
    if (!nav) return;
    nav.querySelectorAll('a[href*="instagram.com"]').forEach(link => link.remove());
    const start = Array.from(nav.querySelectorAll(':scope > a')).find(link => link.textContent.trim() === 'Start');
    const work = Array.from(nav.querySelectorAll(':scope > a')).find(link => link.textContent.trim() === 'Arbeiten');
    setHref(start, BYO + '/#/');
    setHref(work, BYO + '/#/portfolio');

    const offers = makeNavLink(nav, 'Angebote', BYO + '/konfigurator.html', work);
    const tavello = makeNavLink(nav, 'Tavello', 'https://tavello.build-your-own.ch/', offers);

    nav.querySelectorAll(':scope > a').forEach(link => {
      link.removeAttribute('aria-current');
      link.classList.remove('bg-secondary', 'text-foreground');
    });
    tavello.setAttribute('aria-current', 'page');
    tavello.classList.add('bg-secondary', 'text-foreground');
  }

  function sync() {
    scheduled = false;
    setHref(document.querySelector('a[aria-label="Build Your Own — Startseite"]'), BYO + '/');
    setHref(document.querySelector('a[aria-label="Mustafa – KI-Website-Assistent"]'), BYO + '/mustafa.html');
    document.querySelectorAll('a').forEach(link => {
      if (link.textContent.trim() === 'Projekt starten') setHref(link, BYO + '/projekt.html');
    });
    syncNav(document.querySelector('nav[aria-label="Hauptnavigation"]'));
    syncNav(document.querySelector('nav[aria-label="Mobile Navigation"]'));
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(sync);
  }

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  schedule();
})();