# Vanilla Crepe Ecommerce Revamp

A responsive storefront concept for Vanilla Crepe. Serve the project folder over HTTP and open `index.html` to explore the catalogue, search and sort flavours, choose a slice or whole-cake size, build a shopping bag, and enter delivery or pickup details.

## Included in this preview

- 26 products from the public Vanilla Crepe shop catalogue, with product descriptions and one locally downloaded product image per item in `assets/products/`.
- The live shop's listed slice and whole-cake variants and prices, plus the product names, official logo, and homepage feature image.
- Classic, premium, and batik categories; quantity controls; search; sorting; and a saved cart.
- KL and Selangor delivery and kitchen pickup options, date and time selection, gift notes, and a sample delivery fee estimate.
- A checkout confirmation saved in the current browser only.

The preview does not create a kitchen order, send an email, or charge a customer. Sample delivery fees need approval before launch. Product names, descriptions, variants, and images were collected from the current public [Vanilla Crepe shop](https://www.vanillacrepe.com/).

## To accept live orders and payment

Connect checkout to a trusted order database and implement Fiuu Hosted Payment Page on a server. Keep merchant verification keys server-side, verify Fiuu payment notifications before marking an order paid, and do not trust the customer's return redirect as proof of payment. The credentials, callback domain, delivery rules, and production order storage must be supplied and configured by the business before live checkout can be enabled.

Fiuu's official API specifications and integration notes are linked at [Fiuu API documentation](https://docs.fiuu.dev/reference/official-fiuu-api-specifications).
