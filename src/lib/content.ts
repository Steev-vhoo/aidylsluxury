// Static site copy from the Aidyl's Luxury Website Content Pack (v5, 22 Nov 2026).
// Items marked DRAFT need Lydia's approval before launch.

export type Social = {
  platform: "instagram" | "tiktok" | "facebook" | "linkedin" | "threads" | "whatsapp";
  label: string;
  href: string;
  badge?: string;
};

export const site = {
  name: "Aidyl's Luxury",
  legalName: "Aidyl's Luxury Enterprise",
  tagline: "Elegance in Every Detail",
  phones: ["020 837 6516", "059 659 2229"],
  whatsapp: "+233 20 837 6516",
  whatsappLink: "https://wa.me/233208376516",
  email: "aidylenterprise@gmail.com",
  address: "Tantra, Accra, Ghana",
  hours: "Monday to Sunday, 8am to 7pm",
  socials: [
    { platform: "instagram", label: "Instagram @aidyls_luxury", href: "https://www.instagram.com/aidyls_luxury" },
    { platform: "instagram", label: "Instagram @events_by_aidyls_luxury (events)", href: "https://www.instagram.com/events_by_aidyls_luxury", badge: "Ev" },
    { platform: "tiktok", label: "TikTok @aidyls_luxury", href: "https://www.tiktok.com/@aidyls_luxury" },
    { platform: "facebook", label: "Facebook: Aidyl's Luxury Enterprise", href: "https://www.facebook.com/" },
    { platform: "linkedin", label: "LinkedIn: Aidyl's Luxury Events", href: "https://www.linkedin.com/" },
    { platform: "threads", label: "Threads @aidyls_luxury", href: "https://www.threads.net/@aidyls_luxury" },
    { platform: "whatsapp", label: "WhatsApp +233 20 837 6516", href: "https://wa.me/233208376516" },
  ] as Social[],
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export const stats = [
  { num: "50+", label: "Events delivered", note: "Conferences, launches, weddings and parties" },
  { num: "20+", label: "Corporate and NGO clients", note: "Organisations served across Accra" },
  { num: "3+", label: "Years in business", note: "Founded November 2023" },
  { num: "200+", label: "Gift packages delivered", note: "Personal and corporate orders" },
];

export type Client = { name: string; logo?: { src: string; width: number; height: number; bg: string } };

// Logos used with the client's permission (see content pack, section 12)
export const clients: Client[] = [
  { name: "Leadavalley Academy", logo: { src: "/clients/leadavalley.png", width: 171, height: 49, bg: "#FFFFFF" } },
  { name: "Rotaract Club of Accra Technical University", logo: { src: "/clients/rotaract-atu.png", width: 236, height: 64, bg: "#D62F6B" } },
  { name: "Opal Pixel Org" },
];

export const pillars = [
  { title: "Events", text: "Planning and coordination, set-ups and décor, balloon décor, event and floral backdrops, surprise planning." },
  { title: "Rentals", text: "Tents and structures, seating, tables, tableware and décor items for any guest count." },
  { title: "Styling", text: "Fabric works and draping, and interior styling for events, homes and offices." },
  { title: "Gifting and Branding", text: "Gift items, packages and hampers, corporate souvenirs, props and gift wrapping." },
];

export const occasions = [
  "Corporate events", "Conferences", "Weddings", "Engagements", "Anniversaries", "Birthdays", "Parties",
  "Bridal showers", "Baby showers", "Christenings", "Proposals", "Surprises",
];

export type Service = {
  id: string;
  title: string;
  short: string;
  text: string;
  points: string[];
  cta: { label: string; href: string };
};

export const services: Service[] = [
  {
    id: "events",
    title: "Event Planning and Coordination",
    short: "End-to-end planning, set-ups, surprise planning and on-the-day coordination.",
    text: "End-to-end planning and on-the-day coordination for corporate events, conferences, weddings, birthdays and every celebration in between.",
    points: ["Event planning and coordination", "Event set-ups", "Surprise and proposal planning", "On-the-day coordination team"],
    cta: { label: "Book an Event", href: "/book" },
  },
  {
    id: "decor",
    title: "Décor, Balloons and Backdrops",
    short: "Event set-ups and décor, balloon décor, event and floral backdrops.",
    text: "Set-ups and décor that make your event unforgettable, from balloon installations to statement backdrops.",
    points: ["Event set-ups and décor", "Balloon décor: garlands from 7 ft to 24 ft, arches, entrance installations, balloon walls", "Event backdrops", "Floral backdrops"],
    cta: { label: "Book Balloon Décor", href: "/book/balloons" },
  },
  {
    id: "rentals",
    title: "Furniture and Equipment Rentals",
    short: "Tents, canopies, chairs, tables, tableware and décor items.",
    text: "Everything you need to host in style, delivered, set up and collected.",
    points: [
      "Tents and structures: canopies, marquees, cheese tents, pergola, cabana",
      "Seating: chairs, bridal chairs, kids’ chairs, chair covers",
      "Tables: long and round, bridal, kids’, cocktail tables with covers",
      "Tableware: underplates, plates and bowls, glasses, cutlery",
      "Décor: floral centerpieces, flower stands and vases, cake stands, grass carpets",
    ],
    cta: { label: "Book Rentals", href: "/rentals" },
  },
  {
    id: "styling",
    title: "Styling",
    short: "Fabric works and draping, and interior styling.",
    text: "Fabric and interior styling that transforms venues, homes and offices.",
    points: ["Fabric works and draping", "Interior styling for homes and offices", "Christmas décor for events, homes and corporate offices"],
    cta: { label: "Request a Quote", href: "/book" },
  },
  {
    id: "gifting",
    title: "Gifting and Branding",
    short: "Gift packages and hampers, corporate souvenirs, props and gift wrapping.",
    text: "Thoughtful gifts and branded items for personal and corporate occasions. Packages can be customised.",
    points: ["Gift items, packages and hampers", "Branding and corporate souvenirs", "Event props and customisations", "Engagement and gift wrapping"],
    cta: { label: "Shop Gifts", href: "/shop" },
  },
  {
    id: "pm",
    title: "Project Management Consulting",
    short: "PMP-certified support for organisations and teams.",
    text: "Professional project management support from a PMP-certified project manager, for individuals, organisations and NGOs.",
    points: ["Project planning and scheduling", "Stakeholder and risk management", "Training and coaching"],
    cta: { label: "Book a Consultation", href: "/book?route=pm" },
  },
];

export const vendors = ["Catering", "Cake", "DJ", "MC", "Photography", "Videography", "Local drinks bar set-up", "360 photobooth", "Popcorn machine"];

export const rentalGroups: Record<string, string[]> = {
  "Tents and Structures": ["Canopies", "Marquee canopies", "Cheese tents", "Pergola", "Cabana", "Backdrops", "Barricades", "Picture stand", "Trolley"],
  Seating: ["Chairs", "Bridal chairs", "Kids’ chairs", "Chair covers"],
  Tables: ["Long and round tables", "Bridal tables", "Kids’ tables", "Cocktail tables with covers", "Cover cloths and napkins"],
  Tableware: ["Underplates", "Plates and bowls", "Water and wine glasses", "Cutlery"],
  Décor: ["Floral centerpieces", "Flower stands", "Flower vases", "Cake stands", "Grass carpets"],
};

export const testimonials = [
  {
    quote:
      "Aidyl’s Luxury delivered an exceptional setup for our book launch. From the entrance balloon installation to the bespoke floral book-signing backdrop, every detail was executed with elegance and precision. Truly amazing work!",
    name: "Mr. Nicholas Dornyo",
    context: "Book launch · Leadavalley Academy",
  },
  {
    quote:
      "Your relentless effort in decorating our venue made our environment so beautiful, and we are deeply grateful for everything you did. God richly bless you! Baby Anaya says thank you. We love you!",
    name: "Mr & Mrs Adjeyi Semenryo",
    context: "Baby christening décor",
  },
  { quote: "The birthday décor was beautiful, and the birthday girl loved it!", name: "Ms Efua Gloria", context: "Surprise birthday décor" },
  { quote: "He loved every single item, and all of them are of good quality. Well done. I’m really grateful.", name: "Mrs. Beauty Koomson", context: "Father’s Day gift" },
];

export const about = {
  // DRAFT: awaiting Lydia's approval
  story: [
    "Aidyl’s Luxury was born from a genuine passion for creating beautiful moments. What started as a love for organising events, paying attention to the little details, and turning ordinary spaces into memorable experiences gradually became a purpose-driven business. We believe every celebration deserves to feel special, elegant, and thoughtfully put together.",
    "Our love for gifting also shaped the heart of our brand. We enjoy helping people express appreciation, love, and celebration through carefully curated luxury gifts and beautifully packaged hampers. From intimate personal gifts to corporate hampers and branded souvenirs, we create packages that feel meaningful, polished, and memorable.",
    "As a certified project manager, our founder saw a natural connection between project management and event management. Every event requires clear planning, coordination, timelines, budgeting, communication, and careful execution. At Aidyl’s Luxury, we apply this professional approach to ensure every detail is properly managed, from the first idea to the final set-up.",
    "Today, Aidyl’s Luxury brings together creativity, elegance, structure, and heartfelt service. Whether we are planning an event, styling a space, creating a gift package, or providing branded souvenirs, our goal remains the same: to bring your vision to life with care, excellence, and elegance in every detail.",
  ],
  mission: "At Aidyl’s Luxury, we create elegant, memorable events and offer quality lifestyle solutions that reflect style, comfort and excellence.",
  vision: "To become the leading provider of elegant event experiences and luxury lifestyle solutions that leave lasting impressions.",
  promise: "Every event is planned like a project: on time, on budget, and beautifully executed.",
  whoWeAre:
    "At Aidyl’s Luxury, we bring your events to life with elegance. We specialise in planning and executing unforgettable events, from intimate celebrations to large-scale corporate occasions. With a focus on detail, creativity and flawless coordination, we tailor every experience to reflect your unique vision. From décor and vendor coordination to souvenirs, gift packages and event rentals, we handle every aspect to ensure a seamless and luxurious experience, every time.",
  whatWeDo: [
    { t: "Event Management and Coordination", d: "Planning and executing all types of events: corporate, weddings, parties, baby showers, funerals and more." },
    { t: "Gift Items and Packaging", d: "Curated gifts for occasions." },
    { t: "Branded Souvenirs", d: "Custom souvenirs for events and corporate branding." },
    { t: "Event Styling and Décor", d: "Creative themes, floral arrangements and ambiance creation." },
    { t: "Interior Design Services", d: "Styling for homes, offices and event spaces." },
    { t: "Furniture and Equipment Rentals", d: "Chairs, tables, backdrops, lighting, props and more." },
  ],
  // DRAFT
  bio: "A PMP-certified project manager with an MBA in Project Management from GIMPA, Lydia runs every event like a well-managed project. She also offers project management consulting to individuals, organisations and NGOs.",
};

export const howWeWork = [
  { n: "01", t: "Plan", d: "We scope your goals, budget and timeline like a project." },
  { n: "02", t: "Design", d: "Concepts, themes and décor plans for your approval." },
  { n: "03", t: "Deliver", d: "Vendors, rentals, set-up and on-the-day coordination." },
  { n: "04", t: "Delight", d: "Gifts and finishing touches your guests remember." },
];

export const corporateEvents = [
  "Conference or Summit", "Workshop or Training", "Panel or Forum", "Launch (product, brand or book)", "Awards Night",
  "Networking Event", "Stakeholder or Diplomatic Meeting", "Corporate Dinner", "Company Anniversary",
  "Festive Season Celebration", "Retreat or Team Building", "Exhibition or Trade Fair", "Fundraiser or Gala", "Other",
];

export const personalEvents = [
  "Proposal", "Engagement or Traditional Marriage", "Wedding", "Bridal Shower", "Baby Shower", "Naming Ceremony",
  "Baby Christening", "Kids’ Party", "Birthday", "Surprise Party", "Room Décor", "Welcome Party", "Graduation",
  "Anniversary", "Housewarming", "Retirement Party", "Brunch", "Dinner", "Thanksgiving", "Festive Season Celebration",
  "Décor for Photography Shoot", "Memorial Service", "Other",
];

export const budgetRanges = ["Under 2,000", "2,000 to 5,000", "5,000 to 10,000", "10,000 to 20,000", "Above 20,000", "Prefer to discuss"];

export const bookingSteps = [
  "You submit the form and we contact you within 24 hours.",
  "If you’d like to proceed, we send an invoice and an event summary.",
  "A 50% non-refundable deposit reserves your date.",
  "The balance is due one week before the event.",
];

// DRAFT: have a Ghanaian lawyer review before publishing
export const terms = [
  {
    h: "Events, décor and balloons",
    items: [
      "The 50% deposit is a booking fee. It reserves your date, which we hold for you and no other client, and covers planning and preparation. It is not refunded if you cancel.",
      "Date changes are allowed if requested at least 1 month before the event and the new date is available. The deposit carries over if the new date is within 3 months. Changes requested later are not guaranteed, and if the date cannot be moved, the booking is treated as a cancellation.",
      "If we have to cancel or reschedule, we refund everything you have paid or move your booking to a date you choose.",
      "If an event cannot go ahead for reasons beyond anyone’s control, the booking moves to a new date within 1 month and the deposit transfers.",
    ],
  },
  {
    h: "Rentals",
    items: [
      "Rentals are paid in full when you book, and your dates are reserved for you and not offered to other clients.",
      "Rentals cannot be cancelled or refunded.",
      "A date change is possible if requested at least 1 month before the rental start and the items are available.",
      "If we cannot supply your items, we refund you in full.",
    ],
  },
  {
    h: "Gifts, flowers, hampers and souvenirs",
    items: [
      "Paid in full at checkout.",
      "Ready-stock items cannot be cancelled or refunded once ordered.",
      "Branded or custom-made items cannot be cancelled or refunded once production starts.",
    ],
  },
];

export const balloonSizes = ["7 ft", "8 ft", "12 ft", "16 ft", "20 ft", "24 ft"];

export const balloonColours: [string, string][] = [
  ["White", "#FFFFFF"], ["Black", "#111111"], ["Grey", "#9CA3AF"], ["Gold (chrome)", "#D4AF37"], ["Silver (chrome)", "#C0C0C0"],
  ["Rose Gold (chrome)", "#B76E79"], ["Yellow", "#F6D32D"], ["Sand", "#D8C3A0"], ["Mocha", "#8B6B4E"], ["Chocolate", "#5A3A22"],
  ["Blush", "#F4C2C2"], ["Orange", "#F28C28"], ["Coral", "#F88379"], ["Pink", "#F5A0C0"], ["Rose", "#E05780"],
  ["Wild Berry", "#8E2F5E"], ["Red", "#D62828"], ["Burgundy", "#800020"], ["Lilac", "#C8A2C8"], ["Violet", "#7F3FBF"],
  ["Pastel Blue", "#AEC6CF"], ["Pale Blue", "#BFDDF2"], ["Caribbean Blue", "#1CA9C9"], ["Royal Blue", "#2B50C8"],
  ["Navy Blue", "#1F2A5A"], ["Teal", "#138085"], ["Mint Green", "#A8E6CF"], ["Lime Green", "#9ACD32"],
  ["Spring Green", "#3CB371"], ["Green", "#2E7D32"], ["Double-stuffed (custom colours)", "multi"],
];

export const balloonNotes = [
  "Garland prices are plus delivery and installation. Transport is not included.",
  "Keep balloons out of direct sunlight on warm or hot days to reduce popping.",
  "Balloon strike service (popping and disposal) is available for an extra fee. Otherwise all garlands remain yours.",
  "Balloon bookings follow our event terms: 50% non-refundable deposit, balance due one week before.",
];

export const referralSources = ["Instagram", "TikTok", "Facebook", "WhatsApp", "Referral", "Google", "Other"];

export const faqs = [
  { q: "How do I book an event or décor service?", a: "Fill in the booking form. We will contact you, and if you would like to proceed we send an invoice and an event summary." },
  { q: "How much deposit do I pay?", a: "A 50% non-refundable deposit reserves your date. The balance is due one week before your event." },
  { q: "What payment methods do you accept?", a: "Mobile Money and card through Paystack. Rentals, shop items and hampers are paid in full at checkout." },
  { q: "Can I cancel or reschedule?", a: "Our 50% deposit is non-refundable, and rentals and ready-stock items are non-refundable once ordered. You can change your event date once if you ask at least 1 month ahead and the new date is available, and your deposit carries over for up to 3 months. See our full terms on the booking page." },
  { q: "How soon will you reply to my request?", a: "Within 24 hours." },
  { q: "Can you arrange a caterer, DJ, MC or photographer?", a: "Yes. We source and manage trusted vendors for you, including catering, cake, DJ, MC, photography, videography, local drinks bar, 360 photobooth and popcorn machine." },
  { q: "Do you work outside Accra?", a: "Yes. Tell us your location on the booking form." },
  { q: "Can I rent items without booking full event planning?", a: "Yes. Choose your items, dates and delivery option, and pay online." },
  { q: "What happens if a rented item is damaged or lost?", a: "The client pays the full cost of the item." },
  { q: "What is the minimum order for hampers?", a: "3 hampers. Packages can be customised and branded; branded gift cards and bulk orders are welcome." },
  { q: "Do you deliver gifts and flowers?", a: "Yes, in Accra and beyond. Delivery cost depends on your area and the quantity. Same-day delivery is possible, but larger orders can take more than 24 hours, and we will contact you to confirm." },
  { q: "Can you brand items with my logo?", a: "Yes, for souvenirs, hampers and other items, from 2 items and above. Send your logo, the item and the quantity through the enquiry form, and we will send you a quote." },
  { q: "Do you remove the balloons after my event?", a: "A balloon strike service (popping and disposal) is available for an additional fee. Otherwise, all balloon garlands remain yours." },
  { q: "Do you charge for a consultation?", a: "Yes. The fee depends on the project. Once you book, we contact you for details and arrangements." },
];

export const portfolioAlbums = ["Corporate", "Weddings", "NGO", "Private parties", "Décor details"];
