# ERC Academy analytics

Verified GA4 web-stream measurement ID: `G-8W5N2QYDJF`.

Every HTML page includes the standard Google tag once in its head. When creating a future page, copy the Google Analytics block from an existing page. Do not add a second config call or an additional Tag Manager installation for the same stream.

Check in GA4 Realtime after visiting a page with blockers disabled. Source-code checks confirm installation, not delivery to Google. Do not send form values, names, email addresses, phone numbers, comment text or writing exercises as event parameters. Review enhanced-measurement settings in Analytics before adding new event tracking.

The existing homepage interaction events are unchanged. This update adds page tracking; it does not implement new button events or track reading inside the PDF itself. Both the custom domain and Vercel domain may send traffic to the same stream; use hostname filters when reporting.
