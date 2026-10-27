# Contact form activation

The preview form submits the same message to FormSubmit (erc.academianic@gmail.com) and opens WhatsApp for +505 7528 1644. WhatsApp requires the visitor to press Send.

Before relying on email delivery:
1. Submit the preview contact form once with clearly labelled test details.
2. Check erc.academianic@gmail.com, including Spam, for FormSubmit's activation email and confirm the form.
3. Submit a second test and verify that all three fields reach the inbox.

Do not assume the provider's success response proves inbox delivery. The UI says the request was processed, not delivered. Email delivery has not yet been verified end to end. The original production website has not been changed.

The form includes a honeypot, duplicate-click prevention, a 15-second timeout, failure messaging, and a direct WhatsApp fallback. No API secrets are stored in the frontend.
