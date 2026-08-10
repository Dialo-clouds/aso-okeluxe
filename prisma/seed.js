const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: convert price strings like "₦320,000" to kobo
function priceToKobo(priceStr) {
  if (typeof priceStr !== 'string') return 0;
  const cleaned = priceStr.replace(/[₦,]/g, '').split(' ')[0];
  const naira = parseInt(cleaned, 10);
  return isNaN(naira) ? 0 : naira * 100;
}

async function main() {
  console.log('Clearing existing products...');
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();

  const products = [
    {
      id: "celebration-wrapper-red-gold",
      name: "Celebration Wrapper",
      nameYo: "Aṣọ Ìbora Ayẹyẹ",
      tag: "ALÁÀRÍ-STYLE · WRAPPER",
      weave: "multicolor",
      priceKobo: priceToKobo("₦320,000"),
      image: "/products/01-red-black-gold-white-stripe-rolls.webp",
    },
    {
      id: "royal-blue-detail-swatch",
      name: "Royal Blue Detail Swatch",
      nameYo: "Àyẹ̀wò Aró Aláwọ̀ Búlúù",
      tag: "SIGNATURE WEAVE · SAMPLE SWATCH",
      weave: "navy",
      priceKobo: priceToKobo("₦15,000"),
      image: "/products/03-royal-blue-pink-zigzag-macro.jpg",
    },
    {
      id: "iya-alade-wrapper",
      name: "Ìyá Aládé Wrapper",
      nameYo: "Ìyá Aládé Wrapper",
      tag: "PURPLE & GOLD · WRAPPER",
      weave: "purple",
      priceKobo: priceToKobo("₦150,000"),
      image: "/products/04-purple-lavender-yellow-stripe-stack.jpg",
    },
    {
      id: "oba-kabiyesi-wrapper",
      name: "Ọba Kábíyèsí Wrapper",
      nameYo: "Ọba Kábíyèsí Wrapper",
      tag: "DEEP PURPLE · WRAPPER",
      weave: "purple",
      priceKobo: priceToKobo("₦185,000"),
      image: "/products/05-deep-purple-lilac-trim-fold.jpg",
    },
    {
      id: "oju-okun-wrapper",
      name: "Ojú Òkun Wrapper",
      nameYo: "Ojú Òkun Wrapper",
      tag: "NAVY PINSTRIPE · WRAPPER",
      weave: "navy",
      priceKobo: priceToKobo("₦140,000"),
      image: "/products/06-navy-white-pinstripe-fold-roll.jpg",
    },
    {
      id: "ile-adunni-wrapper",
      name: "Ilẹ̀ Adúnní Wrapper",
      nameYo: "Ilẹ̀ Adúnní Wrapper",
      tag: "EARTH TONE · WRAPPER",
      weave: "brown",
      priceKobo: priceToKobo("₦135,000"),
      image: "/products/07-brown-cream-stripe-rolls.jpg",
    },
    {
      id: "aare-ijoba-set",
      name: "Ààrẹ̀ Ìjọba Set",
      nameYo: "Ààrẹ̀ Ìjọba Set",
      tag: "CHIEFTAINCY · SET",
      weave: "multicolor",
      priceKobo: priceToKobo("₦295,000"),
      image: "/products/08-navy-multicolor-border-rolls.jpg",
    },
    {
      id: "obas-cut-agbada",
      name: "The Ọba's Cut",
      nameYo: "Gé Ọba",
      tag: "ẸTÙ-STYLE · MEN'S AGBADA",
      weave: "brown",
      priceKobo: priceToKobo("₦410,000"),
      image: "/products/09-maroon-brown-motif-fold.jpg",
    },
    {
      id: "irin-ajo-wrapper",
      name: "Ìrìn-àjò Wrapper",
      nameYo: "Ìrìn-àjò Wrapper",
      tag: "EVERYDAY · WRAPPER",
      weave: "navy",
      priceKobo: priceToKobo("₦120,000"),
      image: "/products/10-navy-tan-blue-pinstripe-fold.jpg",
    },
    {
      id: "ile-oya-set",
      name: "Ilé-Ọya Set",
      nameYo: "Ilé-Ọya Set",
      tag: "MAROON & OLIVE · SET",
      weave: "multicolor",
      priceKobo: priceToKobo("₦260,000"),
      image: "/products/11-maroon-olive-cream-stripe-rolls.jpg",
    },
    {
      id: "oorun-wrapper",
      name: "Oòrùn Wrapper",
      nameYo: "Oòrùn Wrapper",
      tag: "SUNSET TONES · WRAPPER",
      weave: "brown",
      priceKobo: priceToKobo("₦150,000"),
      image: "/products/12-brown-orange-cream-stripe-fold.jpg",
    },
    {
      id: "adunni-blue-wrapper",
      name: "Adúnní Blue Wrapper",
      nameYo: "Adúnní Blue Wrapper",
      tag: "ROYAL BLUE · WRAPPER",
      weave: "navy",
      priceKobo: priceToKobo("₦145,000"),
      image: "/products/13-royal-blue-tan-stripe-stack.jpg",
    },
    {
      id: "orun-wrapper",
      name: "Ọ̀run Wrapper",
      nameYo: "Ọ̀run Wrapper",
      tag: "PALE BLUE · WRAPPER",
      weave: "navy",
      priceKobo: priceToKobo("₦138,000"),
      image: "/products/14-pale-blue-black-gold-stripe-rolls.jpg",
    },
    {
      id: "ade-ilu-collection",
      name: "Adé Ìlú Collection",
      nameYo: "Adé Ìlú Collection",
      tag: "BLOCK PATTERN · 7 COLORWAYS",
      weave: "multicolor",
      priceKobo: priceToKobo("₦160,000"),
      image: "/products/15-block-pattern-multicolor-stack.jpg",
    },
    {
      id: "wura-ila-wrapper",
      name: "Wúrà Ìlà Wrapper",
      nameYo: "Wúrà Ìlà Wrapper",
      tag: "GOLD ZIGZAG · WRAPPER",
      weave: "gold",
      priceKobo: priceToKobo("₦175,000"),
      image: "/products/16-mustard-gold-white-zigzag-rolls.jpg",
    },
    {
      id: "ola-aso-set",
      name: "Ọlá Aṣọ Set",
      nameYo: "Ọlá Aṣọ Set",
      tag: "NAVY CHECKER · SET",
      weave: "navy",
      priceKobo: priceToKobo("₦300,000"),
      image: "/products/17-navy-grey-checker-zigzag-rolls.jpg",
    },
    {
      id: "design-your-own",
      name: "Design Your Own",
      nameYo: "Ṣe Tirẹ Fúnra Rẹ",
      tag: "BESPOKE · MADE WITH ÀRÒ",
      weave: "gold",
      priceKobo: 0, // Priced on request
      image: null,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`  ✅ ${product.name}`);
  }

  console.log(`\n🎉 Seeded ${products.length} products successfully!`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });