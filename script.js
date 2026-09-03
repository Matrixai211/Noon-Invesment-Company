const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const sections = [...document.querySelectorAll('main section[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const activateNav = () => {
  const y = window.scrollY + 120;
  let current = 'home';
  sections.forEach((section) => {
    if (section.offsetTop <= y) current = section.id;
  });
  navAnchors.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', activateNav, { passive: true });
activateNav();

document.getElementById('year').textContent = new Date().getFullYear();

// CRM intake UI
const crmCss = document.createElement('link');
crmCss.rel = 'stylesheet';
crmCss.href = 'crm.css';
document.head.appendChild(crmCss);

const footer = document.getElementById('contact');
if (footer) {
  const section = document.createElement('section');
  section.className = 'crm-intake';
  section.id = 'crm-intake';
  section.innerHTML = `
    <div class="crm-intake__head">
      <span>CONNECT WITH NOON</span>
      <h2>Start a Conversation</h2>
      <p>Send an inquiry, partnership proposal, investor interest, supplier introduction or career application directly to Noon Investment Company.</p>
    </div>
    <div class="crm-tabs" role="tablist" aria-label="Contact type">
      <button class="crm-tab active" data-type="inquiry" type="button">GENERAL</button>
      <button class="crm-tab" data-type="partner" type="button">PARTNERSHIP</button>
      <button class="crm-tab" data-type="investor" type="button">INVESTOR</button>
      <button class="crm-tab" data-type="supplier" type="button">SUPPLIER</button>
      <button class="crm-tab" data-type="career" type="button">CAREERS</button>
    </div>
    <form class="crm-form" novalidate>
      <input type="hidden" name="lead_type" value="inquiry">
      <label>Name<input name="name" autocomplete="name" required maxlength="120"></label>
      <label>Email<input name="email" type="email" autocomplete="email" required maxlength="254"></label>
      <label>Phone<input name="phone" autocomplete="tel" maxlength="50"></label>
      <label>Company / Organization<input name="company" autocomplete="organization" maxlength="160"></label>
      <label>Country<input name="country" autocomplete="country-name" maxlength="100"></label>
      <label>Area of Interest<input name="interest" maxlength="200" placeholder="e.g. Automotive, Logistics, Capital"></label>
      <label class="full">Message<textarea name="message" maxlength="5000" required placeholder="Tell us how you would like to work with Noon."></textarea></label>
      <button type="submit">SEND TO NOON →</button>
      <p class="crm-status" role="status" aria-live="polite"></p>
    </form>`;
  footer.parentNode.insertBefore(section, footer);

  const form = section.querySelector('.crm-form');
  const status = section.querySelector('.crm-status');
  const typeInput = form.elements.lead_type;
  section.querySelectorAll('.crm-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      section.querySelectorAll('.crm-tab').forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');
      typeInput.value = tab.dataset.type;
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.className = 'crm-status';
    status.textContent = '';
    const submit = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      status.classList.add('error');
      status.textContent = 'Please complete your name, email and message.';
      return;
    }
    submit.disabled = true;
    submit.textContent = 'SENDING…';
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_type: data.lead_type,
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() || null,
          company: data.company?.trim() || null,
          country: data.country?.trim() || null,
          interest: data.interest?.trim() || null,
          message: data.message.trim(),
          metadata: { page: window.location.pathname, referrer: document.referrer || null }
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Submission failed');
      form.reset();
      typeInput.value = 'inquiry';
      section.querySelectorAll('.crm-tab').forEach((item, index) => item.classList.toggle('active', index === 0));
      status.classList.add('success');
      status.textContent = 'Thank you. Your message has been received by Noon Investment Company.';
    } catch (error) {
      status.classList.add('error');
      status.textContent = 'We could not send your message. Please try again shortly.';
    } finally {
      submit.disabled = false;
      submit.textContent = 'SEND TO NOON →';
    }
  });
}

// Footer newsletter also enters the CRM as a general inquiry.
const newsletter = document.querySelector('.newsletter');
if (newsletter) {
  const email = newsletter.querySelector('input[type="email"]');
  const button = newsletter.querySelector('button');
  button.type = 'submit';
  newsletter.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!email.value.trim()) return;
    button.disabled = true;
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_type: 'inquiry',
          name: 'Newsletter Subscriber',
          email: email.value.trim(),
          interest: 'Company updates and insights',
          message: 'Newsletter subscription request.',
          metadata: { source: 'footer-newsletter' }
        })
      });
      if (!response.ok) throw new Error('Subscription failed');
      email.value = '';
      email.placeholder = 'Subscribed ✓';
    } catch {
      email.placeholder = 'Please try again';
    } finally {
      button.disabled = false;
    }
  });
}
