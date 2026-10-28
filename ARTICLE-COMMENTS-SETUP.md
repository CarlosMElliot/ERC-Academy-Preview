# Article comments

Reusable Vercel Node function and plain JavaScript component. No dependencies or account required for readers. The name is self-reported, not a verified identity. Country is selected by the reader (including an option not to disclose), not detected. Timestamp is server-generated UTC and displayed in each reader's local time.

## Activate once

1. Create a fine-grained GitHub access token restricted to `CarlosMElliot/ERC-Academy-Preview` with **Contents: read and write**. Never paste it into chat, source code or the client.
2. In this preview site's Vercel project → Settings → Environment Variables, add `ERC_COMMENTS_GITHUB_TOKEN` as a sensitive server variable for the deployment environment serving the preview domain (typically Production for the main branch).
3. Redeploy main. Vercel must deploy the repository root with `/api` functions enabled, not a static-only output directory. No build command is required for these files.
4. Post a short real comment and refresh the page to verify persistence. Confirm a JSON file appears at `data/article-comments/<slug>.json`. Delete the test record afterward if desired.

Without the variable, the form states that comments aren't available and cannot submit. The UI only reports success after GitHub confirms saving. Errors preserve the entered text; retries use a submission ID to prevent duplicates.

## Storage and limits

Comments are public JSON committed on main in this repository; names, chosen countries, text and UTC times are visible both on the site and in Git history. No email or IP address is collected by this application. Hosting providers may maintain their own request logs. The form explains public storage and links to Contact for removal requests.

This is a small-volume starter system: maximum 500 comments per article, 2,000 characters each, a durable 15-second gap between comments on each article, honeypot, same-origin checks, input validation and conflict retries. These are basic defenses, not a full spam filter. Add managed CAPTCHA and durable per-client rate limiting before high-volume promotion. A country or name does not verify a person's location or identity.

Each submission makes a Git commit. `[skip ci]` is included but **do not assume it prevents Vercel deployments**: verify project behavior and configure an appropriate ignored-build rule if needed. A database is preferable once traffic grows. The token cannot be restricted to one directory, so restrict it to this preview repository only. Do not enable this against the production repository without revisiting access.

To remove a comment from the site, remove its record from the JSON file in GitHub. This does not erase Git history or third-party copies; a full erasure request requires additional GitHub history cleanup. Never enter secrets or private information into comments.

## Future articles

1. Add the unique slug to `data/articles.json` (server allowlist).
2. Include `/assets/article-comments.css` and `/assets/article-comments.js` (defer) in the head.
3. Add `<section class="article-comments" data-article-comments="YOUR-SLUG" aria-label="Comentarios del artículo"><noscript>Activa JavaScript para ver y publicar comentarios.</noscript></section>` below the article.
4. No separate backend or empty JSON file is needed: the first comment creates its storage file. Keep the 300px article card and shared image ratio when adding its listing card.

Tests: `node tests/article-comments.cjs`. These mock GitHub and do not publish comments. Live persistence still needs the private Vercel configuration above.

## Medium source

The first card links to the new local discussion page with the owner's thumbnail and alias. Full text could not be imported because Medium denied access (403). The local page links to the original; it does not contain an invented summary. Replace that source-link block with the owner's supplied text when available.
