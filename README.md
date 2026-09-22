# Aprameya Satish — Personal site

Academic site for [Aprameya Satish](https://www.linkedin.com/in/aprameya-satish/), Senior Research Engineer at GTRI.

## Pages

- `index.html` — Overview + private contact form
- `research.html` — Research programs & experience
- `publications.html` — Full bibliography
- `resume/` — LaTeX CV source (not linked from the public site)

## Private contact form

The site never shows a personal email. Messages go through [Formspree](https://formspree.io):

1. Create a free Formspree form and register your private email there.
2. Put the endpoint in `contact-config.js`:

```js
window.SITE_CONTACT = {
  formspreeEndpoint: "https://formspree.io/f/xxxxxxxx"
};
```

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.
