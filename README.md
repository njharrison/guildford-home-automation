# Guildford Home Automation

Local source for the Guildford Home Automation website.

## Deployment

The site deploys to Cloudflare Workers from the `main` branch using `npx wrangler deploy`.

Static assets are served directly from the repository. Requests under `/api/*` run through `src/worker.js` first. The contact form posts to `/api/contact`, which uses the Cloudflare Email Service `EMAIL` binding to deliver enquiries to a verified destination address.

The public site is https://guildfordhomeautomation.co.uk/
