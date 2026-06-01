// Zenjal Boutique E-commerce — Product Catalog Database

const PRODUCTS = [
  {
    id: "marigold-chanderi-kurta",
    name: "The Marigold Chanderi Kurta Set",
    price: 4599,
    originalPrice: 5499,
    category: "Kurta Sets",
    tags: ["Festive Edit", "Bestseller", "Kurta Sets", "Chanderi"],
    badge: "Bestseller",
    rating: 4.8,
    reviewsCount: 38,
    shortDescription: "An elegant Chanderi silk kurta set featuring intricate hand-embroidered zari work along the neckline, paired with a scalloped sheer organza dupatta and straight-cut premium pants. Designed to capture natural light and flow gracefully.",
    fabric: "Pure Handwoven Chanderi Silk with premium soft Mulmul Cotton lining.",
    care: "Dry clean only. Iron on reverse using a cool setting to protect delicate hand embroidery.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "Deep Marigold Gold", hex: "#C8922A", images: ["images/kurta_marigold_1.jpg", "images/kurta_marigold_2.jpg", "images/kurta_marigold_3.jpg"] },
      { name: "Rich Maroon", hex: "#7B1F2E", images: ["images/kurta_maroon_1.jpg", "images/kurta_maroon_2.jpg", "images/kurta_maroon_3.jpg"] },
      { name: "Ivory White", hex: "#FAF5EC", images: ["images/kurta_ivory_1.jpg", "images/kurta_ivory_2.jpg", "images/kurta_ivory_3.jpg"] }
    ],
    fabrics: ["Chanderi Silk", "Premium Georgette"],
    reviews: [
      { author: "Priya S.", rating: 5, date: "2026-05-12", comment: "The fitting is absolutely flawless. The marigold color has such a rich, festive shine under lights, and the Chanderi feel is premium and highly breathable." },
      { author: "Meenakshi D.", rating: 4, date: "2026-04-30", comment: "Beautiful handwork around the collar. Got so many compliments at our family puja. Delivered within 3 days in Delhi!" }
    ]
  },
  {
    id: "varanasi-katan-silk-saree",
    name: "Royal Varanasi Katan Silk Saree",
    price: 12999,
    originalPrice: 15500,
    category: "Sarees",
    tags: ["Festive Edit", "Limited Edition", "Sarees", "Silk"],
    badge: "Limited Edition",
    rating: 4.9,
    reviewsCount: 19,
    shortDescription: "Handcrafted in the heritage lanes of Varanasi, this Katan silk Saree features traditional gold zari floral boota motifs and an opulent pallu. Drapes like a dream to reflect the timeless majesty of Indian weavers.",
    fabric: "100% Pure Varanasi Katan Silk with handwoven pure gold zari work.",
    care: "Dry clean only. Store wrapped in soft muslin cloth in a dark place to preserve the gold zari brilliance.",
    sizes: ["Free Size"],
    colors: [
      { name: "Rich Maroon", hex: "#7B1F2E", images: ["images/saree_maroon_1.jpg", "images/saree_maroon_2.jpg", "images/saree_maroon_3.jpg"] },
      { name: "Deep Marigold Gold", hex: "#C8922A", images: ["images/saree_gold_1.jpg", "images/saree_gold_2.jpg", "images/saree_gold_3.jpg"] }
    ],
    fabrics: ["Varanasi Katan Silk"],
    reviews: [
      { author: "Anjali M.", rating: 5, date: "2026-05-24", comment: "A masterpiece! The weight is just perfect and the drape is so fluid. True Indian luxury. Thank you Hemlata!" }
    ]
  },
  {
    id: "blush-rose-lehenga",
    name: "Blush Rose Georgette Lehenga",
    price: 18500,
    originalPrice: 22000,
    category: "Lehengas",
    tags: ["Festive Edit", "New Arrival", "Lehengas", "Georgette"],
    badge: "New Arrival",
    rating: 4.7,
    reviewsCount: 12,
    shortDescription: "A dreamy, romantic pastel lehenga featuring fine hand-done mirror work, silver gota accent lines, and intricate floral threadwork. Accompanied by a matching heavy blouse and a sheer net dupatta.",
    fabric: "Premium flowy Viscose Georgette with micro-crepe silk lining and sheer organza dupatta.",
    care: "Dry clean only. Steam iron only. Keep in a hanger bag.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Soft Blush", hex: "#F2D5C4", images: ["images/lehenga_blush_1.jpg", "images/lehenga_blush_2.jpg", "images/lehenga_blush_3.jpg"] },
      { name: "Ivory White", hex: "#FAF5EC", images: ["images/lehenga_ivory_1.jpg", "images/lehenga_ivory_2.jpg", "images/lehenga_ivory_3.jpg"] }
    ],
    fabrics: ["Premium Georgette", "Fine Silk-Net"],
    reviews: [
      { author: "Kriti K.", rating: 5, date: "2026-05-18", comment: "Bought this for my sister's mehendi. The mirror work is so reflective and shiny. Hemlata did custom sleeve adjustments on WhatsApp and fitted it to my exact body size!" }
    ]
  },
  {
    id: "avadh-organza-dupatta",
    name: "Avadh Gota Patti Organza Dupatta",
    price: 1899,
    originalPrice: 2499,
    category: "Dupattas",
    tags: ["Bestseller", "Dupattas", "Organza"],
    badge: "Bestseller",
    rating: 4.6,
    reviewsCount: 52,
    shortDescription: "Elevate your basic salwar or kurta with this breathtaking sheer dupatta. Features beautiful handcrafted Gota Patti floral motifs, delicate hand-painted borders, and scalloped edges.",
    fabric: "Ultra-lightweight, crisp and premium Sheer Silk Organza.",
    care: "Gentle dry clean or very light cold hand wash with mild baby shampoo. Do not wring or squeeze.",
    sizes: ["One Size"],
    colors: [
      { name: "Ivory White", hex: "#FAF5EC", images: ["images/dupatta_ivory_1.jpg", "images/dupatta_ivory_2.jpg", "images/dupatta_ivory_3.jpg"] },
      { name: "Soft Blush", hex: "#F2D5C4", images: ["images/dupatta_blush_1.jpg", "images/dupatta_blush_2.jpg", "images/dupatta_blush_3.jpg"] },
      { name: "Deep Marigold Gold", hex: "#C8922A", images: ["images/dupatta_gold_1.jpg", "images/dupatta_gold_2.jpg", "images/dupatta_gold_3.jpg"] }
    ],
    fabrics: ["Sheer Silk Organza", "Premium Chiffon"],
    reviews: [
      { author: "Sonia G.", rating: 4, date: "2026-05-02", comment: "The Gota work looks so authentic. The organza is beautifully translucent and holds its shape really well. A must-have basic." }
    ]
  },
  {
    id: "gul-mohar-cotton-anarkali",
    name: "Gul-Mohar Handblock Anarkali Set",
    price: 3899,
    originalPrice: 4799,
    category: "Kurta Sets",
    tags: ["Kurta Sets", "Cotton", "Handblock"],
    badge: "Bestseller",
    rating: 4.8,
    reviewsCount: 64,
    shortDescription: "A glorious 16-kali flared Anarkali kurta handblock printed with rich vegetable dyes in floral vines. Paired with comfortable slim trousers and a soft, airy mulmul dupatta.",
    fabric: "100% Premium Long-staple Cambric Cotton with soft Cotton Mulmul dupatta.",
    care: "Hand wash separately in cold water with mild detergent. Dry in shade to protect the natural block dyes.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "Soft Blush", hex: "#F2D5C4", images: ["images/anarkali_blush_1.jpg", "images/anarkali_blush_2.jpg", "images/anarkali_blush_3.jpg"] },
      { name: "Ivory White", hex: "#FAF5EC", images: ["images/anarkali_ivory_1.jpg", "images/anarkali_ivory_2.jpg", "images/anarkali_ivory_3.jpg"] }
    ],
    fabrics: ["Cambric Cotton", "Linen Blend"],
    reviews: [
      { author: "Trupti P.", rating: 5, date: "2026-05-20", comment: "Extremely comfortable for hot weather. The flare (kali) is wide and gives an amazing royal look. The print is very crisp and beautiful." }
    ]
  },
  {
    id: "shahnaz-maroon-lehenga",
    name: "Shahnaz Zardozi Velvet Lehenga",
    price: 24500,
    originalPrice: 29999,
    category: "Lehengas",
    tags: ["Festive Edit", "Limited Edition", "Lehengas", "Zardozi"],
    badge: "Limited Edition",
    rating: 4.9,
    reviewsCount: 8,
    shortDescription: "A highly regal, grand festive velvet lehenga intricately decorated with dabka, nakshi, and zardozi embroidery. Perfect for modern brides and bridesmaid seeking heritage royalty.",
    fabric: "Premium Micro-Velvet base, satin lining, soft georgette blouse, and heavy bordered organza dupatta.",
    care: "Strictly dry clean only. Store in muslin wrap with cedar balls.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Rich Maroon", hex: "#7B1F2E", images: ["images/lehenga_maroon_1.jpg", "images/lehenga_maroon_2.jpg", "images/lehenga_maroon_3.jpg"] }
    ],
    fabrics: ["Premium Micro-Velvet", "Heritage Silk"],
    reviews: [
      { author: "Kavita S.", rating: 5, date: "2026-05-05", comment: "Feels like royalty! The embroidery is heavily detailed and has a solid weight. Hemlata double checked my custom measurements perfectly. Truly standard boutique craft." }
    ]
  }
];

// Blog Lookbooks
const BLOG_POSTS = [
  {
    slug: "festive-styling-guide-2026",
    title: "The Ultimate Guide to Styling Traditional Wear for Summer Festivals",
    date: "May 28, 2026",
    author: "Hemlata",
    excerpt: "Discover the secrets of keeping it breezy yet royal this wedding season. From styling light sheer organza dupattas to layering intricate gold accessories...",
    image: "images/blog_festive.jpg",
    content: `<p>Festivals and weddings in India are rich, soulful celebrations. However, under the warm summer sun, wearing heavy silks can sometimes feel overwhelming. In this lookbook, we share our handpicked styling secrets to maintain absolute grace and elegance while remaining perfectly comfortable.</p>
    <h3>1. The Power of Translucent Dupattas</h3>
    <p>Instead of dense brocades, opt for a light, sheer silk organza or chiffon dupatta adorned with delicate Gota Patti borders. Our <em>Avadh Dupatta</em> paired with a simple raw silk kurta set instantly elevates your look without adding weight.</p>
    <h3>2. Pastel Power: The Blush & Gold Combination</h3>
    <p>This season, rich maroon is finding a soft, fresh companion in soft blush pink. A blush pink viscose georgette lehenga with light mirror work captures natural sunlight gorgeously during day ceremonies, and transitions to warm indoor lights seamlessly at night.</p>
    <h3>3. Minimalism in Zari</h3>
    <p>Look for embroideries centered around borders or necklines rather than all-over heavy patches. Delicate Chanderi kurtas with handblock lining are wonderful examples of style meeting pure comfort.</p>`
  },
  {
    slug: "textile-care-101-silk-organza",
    title: "Caring for Handwoven Textiles: Preservation Secrets for Zari & Silks",
    date: "April 15, 2026",
    author: "Zenjal Loom Masters",
    excerpt: "Handmade Indian textiles are heirloom pieces that carry stories. Learn how to wash, fold, store and iron your Chanderi, Katan Silk, and delicate block-prints...",
    image: "images/blog_care.jpg",
    content: `<p>Your wardrobe collection at Zenjal represents days of manual handloom weaving, careful embroidery, and dye block printing. With a tiny bit of extra care, you can preserve the brilliance of these handcrafted fibers for generations.</p>
    <h3>1. Never Perfume the Zari Directly</h3>
    <p>Chemicals inside perfumes and body sprays contain alcohols that oxidise gold and silver zari threads, turning them dark grey or black. Always spray perfume on your skin or inner lining layers, never directly onto the metal surfaces.</p>
    <h3>2. Fold, Don't Hang Silk Sarees</h3>
    <p>Hanging heavy silk sarees on metal hangers causes the threads in the crease line to stretch and eventually break, leading to permanent cuts in the fabric. Fold them gently in white muslin squares and store them flat.</p>
    <h3>3. Mild Baby Shampoos are Your Best Friend</h3>
    <p>For hand-washable cotton block prints and light chiffon dupattas, never use harsh chemical detergents. Use cold water and a dilute drops of baby shampoo. Dry strictly in shade, as direct tropical sunlight bleaches out natural handblock dyes.</p>`
  }
];
