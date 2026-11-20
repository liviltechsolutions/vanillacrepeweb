# Vanilla Crepe Ecommerce Revamp

A responsive storefront concept for Vanilla Crepe. Open `index.html` in a browser to explore the catalogue, search and sort flavours, select cake sizes, build a shopping bag, and enter delivery or pickup details.

## Included in this preview

- 35 catalogue entries across classic cakes, premium cakes, crepe cups, and batik cups.
- 8-inch and 10-inch cake sizes where available, quantity controls, and a saved cart.
- Delivery and kitchen pickup options, date and time selection, gift notes, and a sample delivery fee estimate.
- A checkout confirmation saved in the current browser only.

The preview does not create a kitchen order, send an email, or charge a customer. Sample prices and delivery fees need approval before launch. Product names and prices were transcribed from the reference menu assets in the workspace and should be confirmed against the current approved menu.

## To accept live orders and payment

Connect checkout to a trusted order database and implement Fiuu Hosted Payment Page on a server. Keep merchant verification keys server-side, verify Fiuu payment notifications before marking an order paid, and do not trust the customer's return redirect as proof of payment. The credentials, callback domain, delivery rules, and production order storage must be supplied and configured by the business before live checkout can be enabled.

Fiuu's official API specifications and integration notes are linked at [Fiuu API documentation](https://docs.fiuu.dev/reference/official-fiuu-api-specifications).
