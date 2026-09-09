document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

const params = new URLSearchParams(window.location.search);
const form = document.querySelector('[data-contact-form]');
const status = document.querySelector('[data-form-status]');

if (form && status) {
  if (params.get('sent') === '1') {
    status.hidden = false;
    status.innerHTML = '<h3>Thanks, your enquiry has been sent.</h3><p>We will get back to you as soon as we can.</p>';
    form.hidden = true;
  } else if (params.has('error')) {
    status.hidden = false;
    status.innerHTML = '<h3>That did not send.</h3><p>Please check the form and try again. If it still fails, email <a href="mailto:hello@guildfordhomeautomation.co.uk">hello@guildfordhomeautomation.co.uk</a>.</p>';
  }
}
