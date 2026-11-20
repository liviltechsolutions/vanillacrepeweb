# Vanilla Crepe Ecommerce Revamp

A responsive storefront concept for Vanilla Crepe. Open `index.html` for the home page, or use the navigation for the full shop, About, classic and premium collections, delivery, and contact pages.

## Included in this preview

- 26 products from the public Vanilla Crepe shop catalogue, with descriptions and locally downloaded product images in `assets/products/`.
- Listed slice and whole-cake variants and prices, the official logo, and a homepage feature image.
- Search, category filters, sorting, size selection, cart quantity controls, and a saved browser cart.
- KL and Selangor delivery and kitchen pickup options, date and time selection, gift notes, and a sample delivery fee estimate.
- About, delivery, contact, classic, and premium pages, with the official shipping, privacy, terms, and returns policies linked from the footer.
- A checkout confirmation saved in the current browser only.

Product and brand information was collected from the public [Vanilla Crepe website](https://www.vanillacrepe.com/), including its [About page](https://www.vanillacrepe.com/about-us-mille-crepe/), [delivery page](https://www.vanillacrepe.com/crepe-cake-delivery-kl-selangor/), and [contact page](https://www.vanillacrepe.com/contact-us/).

The preview does not create a kitchen order, send an email, or charge a customer. The sample delivery fee needs approval before launch.

## To accept live orders and payment

Connect checkout to a trusted order database and implement Fiuu Hosted Payment Page on a server. Keep merchant verification keys server-side, verify Fiuu payment notifications before marking an order paid, and do not trust the customer's return redirect as proof of payment. The credentials, callback domain, delivery rules, and production order storage must be supplied and configured by the business before live checkout can be enabled.

Fiuu's official API specifications and integration notes are linked at [Fiuu API documentation](https://docs.fiuu.dev/reference/official-fiuu-api-specifications).
