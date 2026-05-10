export type Deal = {
  n: string;
  p: string;
  h: string;
  b: string;
  pr: string;
  c: string;
  d: string;
  hr: string;
  desc: string;
  s: string;
  sc: number;
  tr: number;
};

export type Category = {
  k: string;
  l: string;
  i: string;
  cl: string;
};

export const CATS: Category[] = [
  { k: "All", l: "All Deals", i: "🗽", cl: "#f59e0b" },
  { k: "Dollar Eats", l: "Dollar Eats", i: "💵", cl: "#22c55e" },
  { k: "Cheap Eats", l: "Under $15", i: "🍜", cl: "#10b981" },
  { k: "$1 Oyster Deals", l: "$1 Oysters", i: "🦪", cl: "#0ea5e9" },
  { k: "Taco Tuesday", l: "Tacos", i: "🌮", cl: "#f97316" },
  { k: "Wing Wednesday", l: "Wings", i: "🍗", cl: "#ef4444" },
  { k: "Burger Deals", l: "Burgers", i: "🍔", cl: "#a855f7" },
  { k: "Happy Hour Food", l: "Happy Hour", i: "🍻", cl: "#eab308" },
  { k: "Bottomless Brunch", l: "Brunch", i: "🥂", cl: "#ec4899" },
  { k: "Hot Restaurant Value", l: "Hot Spots", i: "🔥", cl: "#fb923c" },
  { k: "Luxury Loophole", l: "Luxury Hacks", i: "✨", cl: "#c084fc" },
  { k: "Street Food & Markets", l: "Street Food", i: "🛒", cl: "#14b8a6" },
  { k: "Pizza Slice Value", l: "Pizza", i: "🍕", cl: "#f43f5e" },
  { k: "Fast Food Value", l: "Fast Food", i: "🍟", cl: "#f87171" },
  { k: "Prix Fixe Lunch", l: "Prix Fixe", i: "🍽️", cl: "#8b5cf6" },
  { k: "Seasonal", l: "Seasonal", i: "📅", cl: "#6366f1" },
];

export const DEALS: Deal[] = [
  // ─── DOLLAR EATS ───
  { n: "Dollar Slice Pizza", p: "2 Bros / 99¢ Fresh / Percy's", h: "Citywide", b: "Manhattan", pr: "$1–$1.50", c: "Dollar Eats", d: "Every Day", hr: "All day", desc: "NYC's unbeatable floor price. Plain cheese slice at dozens of no-frills counters across Manhattan.", s: "2-bros-pizza-cheap-slice", sc: 9, tr: 7 },
  { n: "Fried Dumplings (4 for $1.50)", p: "Vanessa's Dumpling House", h: "Chinatown / E. Village / Williamsburg", b: "Manhattan", pr: "$1.50", c: "Dollar Eats", d: "Every Day", hr: "All day", desc: "Pork with chive or cabbage. Pan-fried golden. Three locations. Cash-friendly.", s: "vanessas-dumpling-house-value", sc: 8, tr: 8 },
  { n: "Peanut Noodles + Dumplings", p: "Shu Jiao Fu Zhou", h: "Chinatown (295 Grand St)", b: "Manhattan", pr: "$3.50", c: "Dollar Eats", d: "Every Day", hr: "All day", desc: "Creamy peanut noodles under $4. Pork & chive dumplings 6 for ~$3. Chinatown legend. Cash only.", s: "shu-jiao-fu-zhou-chinatown-cheap-eats", sc: 10, tr: 8 },
  { n: "10 Steamed Dumplings", p: "Lam Zhou Handpull Noodle", h: "Chinatown (Bowery)", b: "Manhattan", pr: "$3", c: "Dollar Eats", d: "Every Day", hr: "All day", desc: "10 steamed pork dumplings for $3. Hand-pulled noodle soups also dirt cheap. Cash only.", s: "lam-zhou-dumplings", sc: 9, tr: 7 },
  { n: "BBQ Pork Bun", p: "Mei Lai Wah Bakery", h: "Chinatown (64 Bayard St)", b: "Manhattan", pr: "$1.50", c: "Dollar Eats", d: "Every Day", hr: "7am–7pm", desc: "Legendary bakery. Fluffy BBQ pork buns under $2. Always a line, always worth it.", s: "mei-lai-wah-pork-buns", sc: 8, tr: 9 },
  { n: "Scallion Pancake + Soybean Milk", p: "Zhu Ji Dumpling", h: "Flushing", b: "Queens", pr: "$3", c: "Dollar Eats", d: "Every Day", hr: "All day", desc: "Breakfast in Flushing for $3: crispy scallion pancake + fresh soybean milk.", s: "zhu-ji-flushing", sc: 9, tr: 7 },
  { n: "Steamed Buns", p: "Golden Steamer", h: "Chinatown (210 Grand St)", b: "Manhattan", pr: "~$2", c: "Dollar Eats", d: "Every Day", hr: "All day", desc: "Chinatown bakery with dirt-cheap steamed buns and snacks. Perfect under-$5 fuel.", s: "golden-steamer-chinatown-cheap-snacks", sc: 9, tr: 7 },
  { n: "Signature Rice Roll", p: "Yi Ji Shi Mo", h: "Chinatown", b: "Manhattan", pr: "~$8", c: "Dollar Eats", d: "Every Day", hr: "Breakfast/Lunch", desc: "Low-priced rice roll breakfast/lunch staple. One of the best under-$10 meals in Chinatown.", s: "yi-ji-shi-mo-rice-roll", sc: 9, tr: 7 },
  { n: "BEC (Bacon Egg & Cheese)", p: "Any bodega / deli", h: "Citywide", b: "Citywide", pr: "$4–$6", c: "Dollar Eats", d: "Every Day", hr: "Morning", desc: "The NYC breakfast staple on a roll. SPK (salt pepper ketchup). Every corner has one.", s: "bec-bodega", sc: 8, tr: 9 },
  { n: "Empanadas (street cart)", p: "Various bodegas / carts", h: "Citywide", b: "Citywide", pr: "$2–$3", c: "Dollar Eats", d: "Every Day", hr: "All day", desc: "Flaky stuffed pastries from carts, bodegas, and Hispanic groceries. Meat, cheese, or veggie.", s: "empanadas-street", sc: 8, tr: 7 },
  { n: "Pan-Fried Soup Dumplings", p: "Liu Liu Sheng Jian", h: "Flushing (New World Mall)", b: "Queens", pr: "$5–$6", c: "Dollar Eats", d: "Every Day", hr: "9am–9:30pm", desc: "Crispy-bottom sheng jian bao with hot broth inside. Watch the giant pans bubble.", s: "liu-liu-sheng-jian", sc: 9, tr: 7 },
  { n: "Roast Pork Over Rice", p: "Wah Fung No. 1 Fast Food", h: "Chinatown (79 Chrystie St)", b: "Manhattan", pr: "~$5", c: "Dollar Eats", d: "Every Day", hr: "Lunch", desc: "Extremely low-cost roast meat rice boxes. Long line, massive portions, incredible value.", s: "wah-fung-no-1-chinatown-value", sc: 9, tr: 9 },

  // ─── CHEAP EATS ───
  { n: "Recession Special (2 Franks + Drink)", p: "Gray's Papaya", h: "Upper West Side (2090 Broadway)", b: "Manhattan", pr: "$6.95", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Two franks + medium tropical drink for $6.95 including tax. A NYC institution since 1973.", s: "grays-papaya-uws-cheap-eats", sc: 8, tr: 9 },
  { n: "Spicy Cumin Lamb Noodles", p: "Xi'an Famous Foods", h: "Multiple locations", b: "Citywide", pr: "$10–$14", c: "Cheap Eats", d: "Every Day", hr: "11am–8:30pm", desc: "Hand-pulled noodles in spicy cumin lamb sauce. Started in a Flushing food court, now an empire.", s: "xian-famous-foods-nyc-value", sc: 8, tr: 10 },
  { n: "Falafel Sandwich", p: "Mamoun's Falafel", h: "Greenwich Village (119 MacDougal)", b: "Manhattan", pr: "$7–$9", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "50+ years of authentic falafel, shawarma, and kebabs. The OG of Greenwich Village cheap eats.", s: "mamouns-falafel-greenwich-village", sc: 8, tr: 9 },
  { n: "Chicken/Gyro Platter", p: "The Halal Guys", h: "Midtown (53rd & 6th)", b: "Manhattan", pr: "$9–$11", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "The original halal cart. Massive platters of chicken or gyro over rice. Lines around the block.", s: "halal-guys-midtown-value", sc: 7, tr: 10 },
  { n: "Adobada Tacos (2–3 = a meal)", p: "Los Tacos No. 1", h: "Chelsea Market / Times Square", b: "Manhattan", pr: "$4–$5/taco", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Best tacos in NYC. Homemade tortillas, real marinated pork. 2–3 tacos is a full meal under $15.", s: "los-tacos-no-1-value", sc: 8, tr: 10 },
  { n: "Birria Tacos + Consommé", p: "Birria Landia", h: "Jackson Heights / Multiple", b: "Queens", pr: "$10–$14", c: "Cheap Eats", d: "Every Day", hr: "Varies", desc: "Cult food truck/cart. Slow-cooked meat tacos with consommé for dipping. Went viral for a reason.", s: "birria-landia-nyc-value", sc: 8, tr: 9 },
  { n: "Wontons w/ Hot Sauce (#6)", p: "White Bear", h: "Flushing", b: "Queens", pr: "$6–$8", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Tiny takeout window. Order #6: 12 pork wontons in chili oil. Impossibly soft.", s: "white-bear-flushing", sc: 9, tr: 7 },
  { n: "Al Pastor Burrito", p: "Nene's Deli Taqueria", h: "Bushwick / Park Slope", b: "Brooklyn", pr: "~$14", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Strong under-$15 burrito and quesabirria value. Multiple Brooklyn locations.", s: "nenes-deli-taqueria-burrito-value", sc: 8, tr: 8 },
  { n: "Banh Mi", p: "Banh Mi Saigon", h: "Chinatown (198 Grand St)", b: "Manhattan", pr: "~$10", c: "Cheap Eats", d: "Every Day", hr: "Lunch", desc: "Classic Chinatown banh mi. Crispy baguette, pickled daikon, cilantro, your choice of protein.", s: "banh-mi-saigon-chinatown-value", sc: 8, tr: 8 },
  { n: "Pierogis (24-hour)", p: "Veselka", h: "East Village (144 2nd Ave)", b: "Manhattan", pr: "$9 for 4", c: "Cheap Eats", d: "Every Day", hr: "24 hours", desc: "Open since 1954. Boiled or fried pierogis with sautéed onions and sour cream. Open 24 hours.", s: "veselka-east-village-value", sc: 6, tr: 9 },
  { n: "Empanadas (dozen varieties)", p: "Empanada Mama", h: "Hell's Kitchen / Multiple", b: "Manhattan", pr: "$3–$5 each", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Cuban, shredded chicken, pernil, chorizo — dozens of fillings. Portable, filling, cheap.", s: "empanada-mama", sc: 8, tr: 7 },
  { n: "Ethiopian Lunch Special", p: "Bunna Cafe", h: "Bushwick", b: "Brooklyn", pr: "$13–$15", c: "Cheap Eats", d: "Every Day", hr: "Lunch", desc: "All plant-based Ethiopian. Choose 4 items: chickpeas, lentils, beets, string beans. Communal injera.", s: "bunna-cafe-bushwick", sc: 8, tr: 7 },
  { n: "Hand-Pulled Noodle Soups", p: "Tasty Hand-Pulled Noodles", h: "Chinatown", b: "Manhattan", pr: "~$12", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Large noodle portions at accessible prices. Watch them stretch the dough in front of you.", s: "tasty-hand-pulled-noodles-value", sc: 8, tr: 7 },
  { n: "Caribbean Seafood", p: "Calle 191 Pescaderia", h: "Washington Heights", b: "Manhattan", pr: "$10–$14", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Hidden gem seafood market + outdoor café. Crab Meat Creole, Shrimp Mofongo. All under $15.", s: "calle-191-heights", sc: 8, tr: 6 },
  { n: "Food Court Feast (30+ vendors)", p: "New World Mall Food Court", h: "Flushing", b: "Queens", pr: "$6–$14", c: "Cheap Eats", d: "Every Day", hr: "9am–9:30pm", desc: "30+ stalls: dry pot, noodles, soup dumplings, roast duck. Bring cash.", s: "new-world-mall-flushing", sc: 9, tr: 8 },
  { n: "Potstickers + Braised Pork Rice", p: "A-Pou's Taste", h: "East Williamsburg", b: "Brooklyn", pr: "~$12.50", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Two-item value combo around $12.50 total. Taiwanese comfort food in East Williamsburg.", s: "apous-taste-east-williamsburg-value", sc: 9, tr: 7 },
  { n: "Beef Jhol Momo + Sel Roti", p: "Nepali Bhanchha Ghar", h: "Jackson Heights", b: "Queens", pr: "~$14", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Strong value combo under $15. Nepali momos with rich gravy plus fried bread.", s: "nepali-bhanchha-ghar-jackson-heights-value", sc: 9, tr: 8 },
  { n: "$14 Lunch Special (dim sum)", p: "Dim Sum Palace", h: "Midtown / Times Square", b: "Manhattan", pr: "$14", c: "Cheap Eats", d: "Every Day", hr: "Lunch", desc: "Lunch special reportedly includes rice and soup. Solid Midtown cheap lunch option.", s: "dim-sum-palace-midtown-lunch-special", sc: 8, tr: 7 },
  { n: "Pasta Bowls Under $15", p: "Maestro Pasta", h: "FiDi", b: "Manhattan", pr: "<$15", c: "Cheap Eats", d: "Every Day", hr: "Lunch", desc: "Fast casual pasta bowls and half-bowls (from ~$6). Great FiDi office lunch.", s: "maestro-pasta-fidi-cheap-lunch", sc: 9, tr: 6 },
  { n: "Vegetarian Plate / Samosas", p: "Punjabi Deli", h: "Lower East Side (114 E 1st St)", b: "Manhattan", pr: "~$8", c: "Cheap Eats", d: "Every Day", hr: "All day / Late", desc: "Classic taxi-driver vegetarian value spot. Open late. Samosas, dal, veggie plates.", s: "punjabi-deli-les-cheap-eats", sc: 9, tr: 8 },
  { n: "Diablada Broster", p: "Bolivian Llama Party", h: "Sunnyside", b: "Queens", pr: "~$13.50", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Bolivian fried chicken with spicy sauce. Outstanding Queens under-$15 value.", s: "bolivian-llama-party-sunnyside-value", sc: 8, tr: 7 },
  { n: "Halal Platter", p: "Kwik Meal", h: "Midtown (100 W 45th St)", b: "Manhattan", pr: "$10–$15", c: "Cheap Eats", d: "Every Day", hr: "Lunch/Dinner", desc: "Legendary Midtown halal restaurant. Massive portions, great lamb.", s: "kwik-meal-midtown-halal-value", sc: 8, tr: 7 },
  { n: "Smash Burger", p: "7th Street Burger", h: "Multiple locations", b: "Citywide", pr: "~$7+", c: "Cheap Eats", d: "Every Day", hr: "All day / Late", desc: "Fast casual smash burgers with many locations. Strong late-night value.", s: "7th-street-burger-value", sc: 8, tr: 9 },
  { n: "Kati Rolls (Late Night)", p: "Kolachi", h: "East Village", b: "Manhattan", pr: "~$15–$16", c: "Cheap Eats", d: "Every Day", hr: "Late Night", desc: "Two kati rolls for ~$15–$16. Indian/Pakistani late-night value in the East Village.", s: "kolachi-east-village-late-night", sc: 8, tr: 7 },
  { n: "Fried Chicken / Wrap", p: "Bobwhite Counter", h: "East Village", b: "Manhattan", pr: "<$15", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Reliable under-$15 fried chicken and buffalo chicken wrap. Great near-NYU spot.", s: "bobwhite-counter-east-village-value", sc: 7, tr: 8 },
  { n: "Rotisserie Chicken Meal", p: "Caravan Chicken", h: "Astoria", b: "Queens", pr: "<$20", c: "Cheap Eats", d: "Every Day", hr: "All day", desc: "Peruvian-style rotisserie chicken. Strong family/portion value under $20.", s: "caravan-chicken-astoria-value", sc: 8, tr: 7 },

  // ─── OYSTER DEALS ───
  { n: "$2 Oysters + HH Snacks", p: "Mermaid Oyster Bar", h: "Times Square (127 W 43rd St)", b: "Manhattan", pr: "$2/ea", c: "$1 Oyster Deals", d: "Daily", hr: "4pm–5:30pm (Mon all night)", desc: "Chef's choice oysters $2. Monday HH runs ALL NIGHT. Great pre-theater stop.", s: "mermaid-oyster-bar-times-square-happy-hour", sc: 9, tr: 8 },
  { n: "$2–$3.50 Oysters", p: "Crave Fishbar", h: "UWS / Midtown East", b: "Manhattan", pr: "$2–$3.50/ea", c: "$1 Oyster Deals", d: "Daily/varies", hr: "Happy Hour", desc: "Assorted oysters $2–$3.50 range plus discounted food/drinks. Multiple locations.", s: "crave-fishbar-oyster-happy-hour", sc: 8, tr: 8 },
  { n: "$25 Dozen Oysters", p: "Grand Army", h: "Boerum Hill (336 State St)", b: "Brooklyn", pr: "$25/dozen", c: "$1 Oyster Deals", d: "Wed–Sun", hr: "4–6pm (Sat 2–4pm)", desc: "Dozen oysters for $25 plus discounted wine/beer. Clean Brooklyn deal.", s: "grand-army-boerum-hill-oyster-happy-hour", sc: 8, tr: 7 },
  { n: "$9 Half-Dozen + $6 Hot Dog", p: "OTB", h: "Williamsburg (141 Broadway)", b: "Brooklyn", pr: "$9/half-doz", c: "$1 Oyster Deals", d: "Weekdays", hr: "4–6pm", desc: "Oysters and bar food HH. Pool tables, Lone Stars, strong cool-but-cheap positioning.", s: "otb-williamsburg-oyster-happy-hour", sc: 9, tr: 7 },
  { n: "$1.50 Oysters", p: "Due West", h: "West Village (189 W 10th St)", b: "Manhattan", pr: "$1.50/ea", c: "$1 Oyster Deals", d: "Varies", hr: "Happy Hour", desc: "West Village oyster HH. Cozy neighborhood spot.", s: "due-west-west-village-oyster-happy-hour", sc: 8, tr: 7 },
  { n: "$1 Oysters", p: "John Doe", h: "NoMad", b: "Manhattan", pr: "$1/ea", c: "$1 Oyster Deals", d: "Daily/varies", hr: "Happy Hour", desc: "$1 oyster happy hour in NoMad. Call to verify current days/times.", s: "john-doe-nomad-oyster-happy-hour", sc: 8, tr: 5 },
  { n: "$15 Dozen + $7 Sliders", p: "The Summit Bar", h: "East Village (133 Ave C)", b: "Manhattan", pr: "$15/dozen", c: "$1 Oyster Deals", d: "Daily", hr: "5–8pm", desc: "Daily HH with raw East Coast oysters and pulled pork sliders.", s: "the-summit-bar-east-village-happy-hour", sc: 9, tr: 6 },
  { n: "Waterfront Oyster HH", p: "Grand Banks", h: "Tribeca (Pier 25)", b: "Manhattan", pr: "Varies", c: "$1 Oyster Deals", d: "Seasonal", hr: "Varies", desc: "Waterfront oyster/bar specials vary seasonally. Iconic boat bar on the Hudson.", s: "grand-banks-nyc-oyster-happy-hour", sc: 7, tr: 8 },
  { n: "Boat Oyster HH", p: "Pilot", h: "Brooklyn Heights (Pier 6)", b: "Brooklyn", pr: "Varies", c: "$1 Oyster Deals", d: "Seasonal", hr: "Varies", desc: "Boat restaurant with seasonal seafood specials. Great summer deal candidate.", s: "pilot-brooklyn-oyster-happy-hour", sc: 7, tr: 8 },
  { n: "$1 Oysters All Day", p: "Upstate", h: "East Village", b: "Manhattan", pr: "$1/ea", c: "$1 Oyster Deals", d: "Every Day", hr: "Open–7pm", desc: "$1 oysters daily, max 12/guest. Cocktails $14, wine $10. Romantic date spot.", s: "upstate-east-village", sc: 9, tr: 7 },
  { n: "$1.50 Oysters + $1.50 Clams", p: "Dock's Oyster Bar", h: "Midtown (40th & Broadway)", b: "Manhattan", pr: "$1.50/ea", c: "$1 Oyster Deals", d: "Every Day", hr: "3–7pm (bar)", desc: "$1.50 oyster du jour + clams, $3 beef slider, $6 drafts, $8 fish tacos.", s: "docks-oyster-bar", sc: 9, tr: 7 },
  { n: "$1 Oysters (Waterfront)", p: "Brooklyn Crab", h: "Red Hook", b: "Brooklyn", pr: "$1/ea", c: "$1 Oyster Deals", d: "Mon–Fri", hr: "Before 6pm", desc: "$1 oysters at a 3-floor waterfront bar with cornhole and beachside vibes.", s: "brooklyn-crab-red-hook", sc: 9, tr: 7 },

  // ─── TACO DEALS ───
  { n: "$1 Rooftop Tacos (Saturday)", p: "The Ready Rooftop", h: "East Village (112 E 11th St)", b: "Manhattan", pr: "$1/taco", c: "Taco Tuesday", d: "Saturday", hr: "12–3pm", desc: "$1 tacos on a rooftop in the East Village. High viral potential. Saturday only.", s: "the-ready-rooftop-dollar-tacos", sc: 10, tr: 9 },
  { n: "$5 Tacos + $10 Cocktails", p: "Frijoleros", h: "Greenpoint", b: "Brooklyn", pr: "$5/taco", c: "Taco Tuesday", d: "Weekdays", hr: "Until 6pm", desc: "Weekday HH with tacos and classic cocktails at one of Brooklyn's hottest new Mexican spots.", s: "frijoleros-greenpoint-happy-hour", sc: 8, tr: 8 },
  { n: "Endless Tacos + Free Marg", p: "Mad Dog & Beans", h: "Midtown (5 E. 38th St)", b: "Manhattan", pr: "$19.95 AYCE", c: "Taco Tuesday", d: "Tuesday", hr: "6–9pm", desc: "Bottomless tacos 6–9pm with a FREE frozen margarita. All you can eat for $19.95.", s: "mad-dog-beans-taco-tuesday", sc: 7, tr: 6 },
  { n: "$2 Tacos", p: "Eastpoint", h: "East Village (25 Ave B)", b: "Manhattan", pr: "$2/taco", c: "Taco Tuesday", d: "Tuesday", hr: "All day", desc: "$2 tacos every Tuesday. No gimmicks, just cheap tacos in the East Village.", s: "eastpoint-taco-tuesday", sc: 8, tr: 7 },
  { n: "2 Tacos for $5–$6", p: "East End Bar & Grill", h: "UES (1664 1st Ave)", b: "Manhattan", pr: "$5 for 2", c: "Taco Tuesday", d: "Tuesday", hr: "All day", desc: "Beef or chicken 2/$5. Fish, shrimp, carne asada, al pastor, pulled pork 2/$6.", s: "east-end-bar-tacos", sc: 8, tr: 6 },
  { n: "$3 Tacos + $5 Margaritas", p: "All-Stars Bar & Grill", h: "Hell's Kitchen (327 W. 57th)", b: "Manhattan", pr: "$3/taco", c: "Taco Tuesday", d: "Tuesday", hr: "All day", desc: "$3 chicken or beef tacos, $5 margaritas every Tuesday.", s: "all-stars-taco-tuesday", sc: 7, tr: 6 },
  { n: "$5 Tacos + $7 Margs + Live Music", p: "Mason Jar NYC", h: "Midtown", b: "Manhattan", pr: "$5/taco", c: "Taco Tuesday", d: "Tuesday", hr: "All day (dine-in)", desc: "$5 tacos (beef, pork, fish, chicken), $7 margs, live music at 6pm.", s: "mason-jar-taco-tuesday", sc: 7, tr: 6 },
  { n: "$20 AYCE Tacos (Tue + Wed)", p: "Barrio Taqueria", h: "Queens", b: "Queens", pr: "$20 AYCE", c: "Taco Tuesday", d: "Tue & Wed", hr: "All day (1hr limit)", desc: "$20 unlimited tacos: al pastor, tinga, mushroom, chicken, chorizo. 1-hour limit.", s: "barrio-taqueria-ayce", sc: 8, tr: 8 },
  { n: "$2 Birria Tacos", p: "Colima Taqueria", h: "Bronx (608 E 187th St)", b: "Bronx", pr: "$2/taco", c: "Taco Tuesday", d: "Tuesday", hr: "12–6pm", desc: "$2 birria tacos every Tuesday noon to 6pm. Bronx gem.", s: "colima-taqueria-birria", sc: 9, tr: 8 },

  // ─── WING WEDNESDAY ───
  { n: "50¢ Wings (7pm–midnight)", p: "Various NYC bars", h: "Multiple", b: "Manhattan", pr: "$0.50/wing", c: "Wing Wednesday", d: "Wednesday", hr: "7pm–midnight", desc: "50-cent wings from 7pm to midnight at multiple Manhattan bars.", s: "fifty-cent-wings", sc: 8, tr: 7 },
  { n: "Half-Price Wings", p: "UES bars", h: "Upper East Side", b: "Manhattan", pr: "50% off", c: "Wing Wednesday", d: "Wednesday", hr: "Varies", desc: "Half-price wings across UES. Some top finishers in citywide Lord of the Wings challenge.", s: "ues-half-price-wings", sc: 8, tr: 7 },
  { n: "10¢ Wings", p: "Select bars", h: "Various", b: "Manhattan", pr: "$0.10/wing", c: "Wing Wednesday", d: "Wednesday", hr: "Varies", desc: "Yes, dime wings still exist at a few NYC bars.", s: "dime-wings", sc: 9, tr: 6 },
  { n: "20 Wings for $10 (Carryout)", p: "Pizza Hut", h: "Multiple", b: "Citywide", pr: "$10/20", c: "Wing Wednesday", d: "Wednesday", hr: "All day", desc: "20 lil' wings for $10. Carryout only, limit 6 orders.", s: "pizza-hut-wings", sc: 7, tr: 6 },

  // ─── BURGER DEALS ───
  { n: "2-for-1 Cheeseburgers", p: "Mason Jar NYC", h: "Midtown", b: "Manhattan", pr: "BOGO", c: "Burger Deals", d: "Wednesday", hr: "All day", desc: "BOGO Double Bacon Cheeseburgers all day Wednesday. Beverage purchase required.", s: "mason-jar-bogo-burger", sc: 8, tr: 6 },
  { n: "$20 Burger + Beer", p: "Golden HOF", h: "Midtown (16 W 48th St)", b: "Manhattan", pr: "$20 combo", c: "Burger Deals", d: "Daily", hr: "3–6pm", desc: "Burger + beer combo plus $10 cocktails and $6 beers during HH. Great Midtown office deal.", s: "golden-hof-midtown-burger-beer-deal", sc: 8, tr: 8 },
  { n: "$3.99 Whopper Wednesday", p: "Burger King", h: "Multiple", b: "Citywide", pr: "$3.99", c: "Burger Deals", d: "Wednesday", hr: "All day (app)", desc: "$3.99 Whopper (regular or Impossible) via the BK app every Wednesday.", s: "bk-whopper-wednesday", sc: 7, tr: 7 },
  { n: "Half-Price Cheeseburgers", p: "Sonic", h: "Various", b: "Citywide", pr: "50% off", c: "Burger Deals", d: "Tuesday", hr: "After 5pm", desc: "Half-price cheeseburgers every Tuesday evening at Sonic.", s: "sonic-half-price", sc: 7, tr: 6 },

  // ─── HAPPY HOUR ───
  { n: "$15 Pasta + $10 Drinks", p: "Popina", h: "Columbia Waterfront (127 Columbia St)", b: "Brooklyn", pr: "$15 pasta", c: "Happy Hour Food", d: "Mon–Thu", hr: "Happy Hour", desc: "Happy hour pasta and drinks at a respected Brooklyn restaurant. Also: no-corkage Wednesday.", s: "popina-brooklyn-happy-hour-pasta", sc: 9, tr: 9 },
  { n: "Martini Hour + Snacks ($8–$20)", p: "Koloman", h: "NoMad (16 W 29th St)", b: "Manhattan", pr: "$12 cocktails", c: "Happy Hour Food", d: "Tue–Sun", hr: "4–7pm", desc: "Upscale NoMad Austrian/French restaurant with martini hour and lower-priced bar snacks.", s: "koloman-nomad-martini-hour", sc: 8, tr: 9 },
  { n: "$7 Bites + $5 Prosecco", p: "PHD Terrace", h: "Midtown (210 W 55th St)", b: "Manhattan", pr: "$5–$7", c: "Happy Hour Food", d: "Tue–Fri", hr: "5–7pm", desc: "Published happy hour with $7 bites and $5 prosecco on a Midtown rooftop. Strong SEO for rooftop value.", s: "phd-terrace-rooftop-happy-hour", sc: 8, tr: 8 },
  { n: "Half-Off Signature Cocktails", p: "Red Rooster", h: "Harlem (310 Lenox Ave)", b: "Manhattan", pr: "50% off", c: "Happy Hour Food", d: "Mon–Thu", hr: "5–7pm", desc: "Harlem hotspot with half-off cocktails on weekdays. Marcus Samuelsson's flagship.", s: "red-rooster-harlem-happy-hour", sc: 7, tr: 8 },
  { n: "Cocktails + Raw Bar", p: "The Dynamo Room", h: "Penn Station (2 Penn Plaza)", b: "Manhattan", pr: "$13.95 cocktails", c: "Happy Hour Food", d: "Varies", hr: "Happy Hour", desc: "Steakhouse-adjacent bar near MSG with discounted cocktails and raw bar. Great pre-event.", s: "dynamo-room-msg-happy-hour", sc: 7, tr: 8 },
  { n: "$15.95 Fajita Night + Free Marg", p: "Mad Dog & Beans", h: "Midtown (5 E. 38th St)", b: "Manhattan", pr: "$15.95", c: "Happy Hour Food", d: "Wednesday", hr: "6–9pm", desc: "Your choice of fajita + one FREE frozen margarita for $15.95.", s: "mad-dog-fajita-night", sc: 7, tr: 6 },
  { n: "$5 Margaritas ALL DAY", p: "Mexican bars", h: "Multiple", b: "Manhattan", pr: "$5", c: "Happy Hour Food", d: "Wednesday", hr: "All day", desc: "$5 margaritas all day and all night at the bar. Acoustic live music 7–10pm.", s: "five-dollar-margs", sc: 8, tr: 7 },
  { n: "Standard NYC HH ($4–$6)", p: "Dozens of bars", h: "Citywide", b: "Manhattan", pr: "$4–$6", c: "Happy Hour Food", d: "Mon–Fri", hr: "4–7pm", desc: "$4 domestic bottles, $5 craft drafts, $6 wells/wine. The NYC baseline.", s: "standard-nyc-happy-hour", sc: 6, tr: 8 },

  // ─── BOTTOMLESS BRUNCH ───
  { n: "$14 Bottomless Rosé Mimosas", p: "Various (per SecretNYC)", h: "Multiple", b: "Manhattan", pr: "$14", c: "Bottomless Brunch", d: "Sat–Sun", hr: "Brunch", desc: "$14 bottomless rosé mimosas, classic mimosas, or sangria with food. Cheapest bottomless in NYC.", s: "fourteen-dollar-bottomless", sc: 9, tr: 8 },
  { n: "$19.95 Bottomless + Live Music", p: "Beatstro", h: "Multiple", b: "Manhattan", pr: "$19.95", c: "Bottomless Brunch", d: "Sat–Sun", hr: "90 min", desc: "$19.95 for 90 min unlimited sangria/mimosas with live music. Chicken & waffles, rum cake french toast.", s: "beatstro-bottomless", sc: 8, tr: 7 },
  { n: "$25 Bottomless (90 min)", p: "Sweet Afton / Bonnie's", h: "Astoria / Multiple", b: "Queens", pr: "$25", c: "Bottomless Brunch", d: "Sat–Sun", hr: "90 min", desc: "$25 for 90 min unlimited mimosas, bloody marys, sangria, or beer with entrée.", s: "sweet-afton-bottomless", sc: 8, tr: 7 },
  { n: "$32 Prix Fixe + Bottomless", p: "Ainslie", h: "Bowery", b: "Manhattan", pr: "$32", c: "Bottomless Brunch", d: "Sat–Sun", hr: "90 min", desc: "$32 for 1.5 hours unlimited brunch cocktails with any entrée. Three-floor venue.", s: "ainslie-bottomless", sc: 8, tr: 7 },
  { n: "$39.50 Steak Frites + Bottomless", p: "Medium Rare", h: "Multiple", b: "Manhattan", pr: "$39.50", c: "Bottomless Brunch", d: "Sat–Sun", hr: "Brunch", desc: "Steak frites ($34.95 at dinner) — at brunch add bottomless for $5 more.", s: "medium-rare-bottomless", sc: 7, tr: 7 },
  { n: "$40 Wood-Fired Pizza + Bottomless", p: "Carroll Place", h: "Greenwich Village", b: "Manhattan", pr: "$40", c: "Bottomless Brunch", d: "Sat–Sun", hr: "90 min", desc: "$40 for 90 min Mimosas/Bloody Marys/Sangria with entrée. Wood-fired oven.", s: "carroll-place-bottomless", sc: 7, tr: 7 },
  { n: "$40 Endless Tacos + Margs", p: "Taco Vision", h: "Midtown East", b: "Manhattan", pr: "$40", c: "Bottomless Brunch", d: "Sat–Sun", hr: "Brunch", desc: "Endless tacos + bottomless margaritas/mimosas. Bi-level with Margarita Garden patio.", s: "taco-vision-bottomless", sc: 7, tr: 7 },

  // ─── FAST FOOD ───
  { n: "$5 Cravings Box", p: "Taco Bell", h: "Multiple", b: "Citywide", pr: "$5", c: "Fast Food Value", d: "Every Day", hr: "All day", desc: "Beefy 5-Layer Burrito + Taco + Twists + drink. App $7 box = Crunchwrap + Burrito + Baja Blast.", s: "taco-bell-box", sc: 7, tr: 8 },
  { n: "Free Chicken Shack Sunday", p: "Shake Shack", h: "Multiple", b: "Citywide", pr: "FREE", c: "Fast Food Value", d: "Sunday", hr: "All day", desc: "Free chicken sandwich Sundays w/$10 min. Code: CHICKENSUNDAY. Through June 2026.", s: "shake-shack-free-sunday", sc: 8, tr: 8 },
  { n: "$9.99 Bottomless Apps", p: "Buffalo Wild Wings", h: "Multiple", b: "Citywide", pr: "$9.99", c: "Fast Food Value", d: "Every Day", hr: "All day", desc: "$9.99 Mix & Match Bottomless Appetizers. Through June 2026.", s: "bww-bottomless-apps", sc: 7, tr: 7 },
  { n: "Under $3 Menu", p: "McDonald's", h: "Multiple", b: "Citywide", pr: "$3–$6", c: "Fast Food Value", d: "Every Day", hr: "All day", desc: "McValue Under $3 menu + $4 breakfast. Manhattan = ~$6. Free medium fries Fridays via app.", s: "mcdonalds-mcvalue", sc: 6, tr: 8 },

  // ─── PRIX FIXE ───
  { n: "$29 Three-Course Steakhouse", p: "Gallagher's Steakhouse", h: "Midtown (228 W 52nd St)", b: "Manhattan", pr: "$29", c: "Prix Fixe Lunch", d: "Mon–Fri", hr: "Until 4pm", desc: "Three-course prix fixe at a classic steakhouse for $29. One of the best lunch deals in the city.", s: "gallaghers-prix-fixe", sc: 9, tr: 7 },
  { n: "$30 French Bistro Lunch", p: "Café D'Alsace", h: "Yorkville (2nd & 88th)", b: "Manhattan", pr: "$30", c: "Prix Fixe Lunch", d: "Mon–Fri", hr: "11:30am–3:30pm", desc: "Three-course French lunch that changes daily. Friday = Moules Frites au Curry.", s: "cafe-dalsace-prix-fixe", sc: 8, tr: 6 },
  { n: "$36.50 Three-Course Greek", p: "Avra (Rockefeller Center)", h: "Midtown", b: "Manhattan", pr: "$36.50", c: "Prix Fixe Lunch", d: "Every Day", hr: "11:30am–4pm", desc: "Three-course Greek prix fixe. Amazing outdoor seating at Rock Center.", s: "avra-prix-fixe", sc: 8, tr: 7 },
  { n: "$45 Power Lunch (Steak)", p: "STK", h: "Multiple", b: "Manhattan", pr: "$45", c: "Prix Fixe Lunch", d: "Mon–Fri", hr: "Lunch", desc: "2.5-course Power Lunch with filet mignon, tuna tartare tacos, chicken, or pasta.", s: "stk-power-lunch", sc: 7, tr: 7 },

  // ─── HOT RESTAURANT VALUE ───
  { n: "Indian Fried Chicken Sando", p: "Rowdy Rooster", h: "East Village", b: "Manhattan", pr: "<$15", c: "Hot Restaurant Value", d: "Every Day", hr: "All day", desc: "Hot casual restaurant from the Dhamaka team with accessible items. Indian-spiced fried chicken.", s: "rowdy-rooster-east-village-value", sc: 7, tr: 9 },
  { n: "High-Quality Tacos", p: "Taqueria Ramirez", h: "Greenpoint", b: "Brooklyn", pr: "~$5/taco", c: "Hot Restaurant Value", d: "Every Day", hr: "All day", desc: "One of NYC's hottest taco spots with accessible à la carte pricing relative to demand.", s: "taqueria-ramirez-greenpoint-value", sc: 7, tr: 10 },
  { n: "Veggie Burger / Gelato", p: "Superiority Burger", h: "East Village", b: "Manhattan", pr: "<$15", c: "Hot Restaurant Value", d: "Every Day", hr: "All day", desc: "Hot vegetarian spot with some of the most affordable items on any trendy menu. Cult following.", s: "superiority-burger-east-village-value", sc: 6, tr: 10 },
  { n: "Udon Bowls", p: "Raku", h: "East Village / SoHo", b: "Manhattan", pr: "<$20", c: "Hot Restaurant Value", d: "Every Day", hr: "All day", desc: "High-quality udon where selective ordering stays under $20. Not a deal — just great value.", s: "raku-nyc-udon-value", sc: 6, tr: 9 },
  { n: "Smash Burger", p: "Hamburger America", h: "SoHo", b: "Manhattan", pr: "<$15", c: "Hot Restaurant Value", d: "Every Day", hr: "All day", desc: "Hot new burger spot with accessible per-item pricing. Classic smash style.", s: "hamburger-america-soho-value", sc: 7, tr: 10 },
  { n: "Retro Lunch Counter", p: "S&P Lunch", h: "Flatiron (174 5th Ave)", b: "Manhattan", pr: "<$15", c: "Hot Restaurant Value", d: "Every Day", hr: "Breakfast/Lunch", desc: "Trendy retro lunch counter with classic sandwiches at reasonable prices.", s: "sp-lunch-flatiron-value", sc: 6, tr: 9 },

  // ─── LUXURY LOOPHOLE ───
  { n: "Aperitivo / Cocktail Value", p: "Dante", h: "Greenwich Village", b: "Manhattan", pr: "Varies", c: "Luxury Loophole", d: "Varies", hr: "Aperitivo hours", desc: "World-famous cocktail bar. Not always a deal, but aperitivo-style drinks at a bucket-list bar.", s: "dante-nyc-aperitivo-happy-hour", sc: 6, tr: 10 },
  { n: "French Brasserie Late-Night", p: "L'Express", h: "Gramercy (249 Park Ave S)", b: "Manhattan", pr: "<$25", c: "Luxury Loophole", d: "Every Day", hr: "All day / Late", desc: "Classic French brasserie that's surprisingly affordable for what you get. Open late.", s: "lexpress-gramercy-value", sc: 6, tr: 7 },

  // ─── STREET FOOD ───
  { n: "$6-Capped Food Items (Sat market)", p: "Queens Night Market", h: "Flushing Meadows-Corona Park", b: "Queens", pr: "$6/item", c: "Street Food & Markets", d: "Saturday (seasonal)", hr: "4pm–midnight", desc: "Seasonal Saturday market with 80+ vendors and capped affordable pricing. Must-visit event.", s: "queens-night-market-six-dollar-food", sc: 10, tr: 9 },
  { n: "Chicken Over Rice", p: "Adel's Famous Halal Food", h: "Midtown (49th & 6th Ave)", b: "Manhattan", pr: "$8–$12", c: "Street Food & Markets", d: "Every Day", hr: "Evening / Late Night", desc: "Cult halal cart with massive portions. Long lines = good sign.", s: "adels-famous-halal-food-value", sc: 8, tr: 10 },
  { n: "Falafel/Shawarma Platter", p: "King of Falafel & Shawarma", h: "Astoria", b: "Queens", pr: "$8–$12", c: "Street Food & Markets", d: "Every Day", hr: "All day", desc: "Queens street food staple. Enormous portions of shawarma and falafel.", s: "king-of-falafel-astoria-value", sc: 8, tr: 8 },
  { n: "Waterfront Bar Food", p: "Frying Pan", h: "Chelsea (Pier 66)", b: "Manhattan", pr: "Varies", c: "Street Food & Markets", d: "Seasonal", hr: "Afternoon–Night", desc: "Not always a deal, but strong casual waterfront value. Burgers, clam chowder, beers on a lightship.", s: "frying-pan-chelsea-waterfront-food-deals", sc: 6, tr: 8 },
  { n: "Cheap Lunch Food Hall", p: "Urbanspace Vanderbilt", h: "Midtown East (230 Park Ave)", b: "Manhattan", pr: "$10–$15", c: "Street Food & Markets", d: "Weekdays", hr: "Lunch", desc: "Food hall with multiple fast-casual vendors. Strong Midtown office lunch rotation.", s: "urbanspace-vanderbilt-cheap-lunch", sc: 6, tr: 7 },
  { n: "Budget Food Hall Route", p: "Essex Market", h: "Lower East Side (88 Essex St)", b: "Manhattan", pr: "$8–$15", c: "Street Food & Markets", d: "Every Day", hr: "All day", desc: "Multiple affordable vendors: Puebla tacos, dumplings, pizza, Shopsin's. Good LES hub.", s: "essex-market-cheap-eats", sc: 7, tr: 7 },

  // ─── PIZZA ───
  { n: "Classic NYC Slice", p: "Joe's Pizza", h: "Multiple locations", b: "Manhattan", pr: "~$3.50/slice", c: "Pizza Slice Value", d: "Every Day", hr: "All day", desc: "Iconic slice remains a relatively cheap NYC meal. Tourist-approved, local-validated.", s: "joes-pizza-nyc-slice-value", sc: 7, tr: 10 },
  { n: "High-Quality Artisan Slice", p: "Scarr's Pizza", h: "Lower East Side", b: "Manhattan", pr: "~$4.50/slice", c: "Pizza Slice Value", d: "Every Day", hr: "All day", desc: "Hot slice shop with hand-milled flour. Worth the premium over dollar slice.", s: "scarrs-pizza-les-value", sc: 7, tr: 10 },
  { n: "Burrata Slice", p: "L'Industrie Pizzeria", h: "Williamsburg / West Village", b: "Brooklyn", pr: "~$5/slice", c: "Pizza Slice Value", d: "Every Day", hr: "All day", desc: "Cult-favorite slice shop. The burrata slice is the move. Strong value-to-quality ratio.", s: "lindustrie-pizzeria-value", sc: 7, tr: 10 },
  { n: "Pepperoni Square Slice", p: "Prince Street Pizza", h: "Nolita", b: "Manhattan", pr: "~$5/slice", c: "Pizza Slice Value", d: "Every Day", hr: "All day", desc: "Tourist-heavy but the spicy pepperoni square is worth one visit. Expect a line.", s: "prince-street-pizza-slice-value", sc: 6, tr: 9 },

  // ─── SEASONAL ───
  { n: "Restaurant Week Summer 2026", p: "600+ restaurants", h: "All 5 boroughs", b: "Citywide", pr: "$30/$45/$60", c: "Seasonal", d: "Jul–Aug 2026", hr: "Lunch & Dinner", desc: "Bi-annual city program. Prix fixe at $30/$45/$60. 600+ restaurants. Excludes Saturdays.", s: "restaurant-week-summer-2026", sc: 8, tr: 9 },
  { n: "Savor NYC (Year-Round)", p: "Various", h: "Citywide", b: "Citywide", pr: "Varies", c: "Seasonal", d: "Year-round", hr: "Varies", desc: "NYC Tourism's year-round dining discovery program between Restaurant Week seasons.", s: "savor-nyc", sc: 6, tr: 7 },
];
