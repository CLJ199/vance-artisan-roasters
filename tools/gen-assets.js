const fs = require('fs');
const path = require('path');
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const w = (name, svg) => fs.writeFileSync(path.join(out, name), svg.trim() + '\n');

const GRAIN = `<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .9  0 0 0 0 .8  0 0 0 .12 0"/></filter>`;
const FONT = `font-family="Archivo, Arial, sans-serif"`;
const BODY = `font-family="Inter, Arial, sans-serif"`;

// ---------- emblem ----------
function emblem(fg, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="22" fill="none" stroke="${fg}" stroke-width="2"/>
  <ellipse cx="24" cy="29" rx="9" ry="12" transform="rotate(-18 24 29)" fill="${fg}"/>
  <path d="M20 40c4-4 5-9 3-13" stroke="${bg}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M26 8c-5 4-3 8-1 10 1-3 4-4 4-8 3 3 4 7 2 10 4-2 5-8-5-12z" fill="#C85A32"/>
</svg>`;
}
w('emblem-light.svg', emblem('#FDFBF7', '#1C1613'));   // for dark backgrounds
w('emblem-dark.svg', emblem('#1C1613', '#FDFBF7'));    // for light backgrounds
w('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#1C1613"/><g transform="translate(4 4) scale(.83)">${emblem('#FDFBF7', '#1C1613').replace(/<\/?svg[^>]*>/g, '')}</g></svg>`);

// ---------- bags ----------
const coffees = [
  { file: 'bag-athi-river.svg', name: ['ATHI RIVER', 'SINGLE ORIGIN'], roast: 'LIGHT ROAST', level: 1, notes: 'Jasmine · Citrus · Honey', band: '#E2B04A' },
  { file: 'bag-antioquia.svg', name: ['ANTIOQUIA', 'RESERVE'], roast: 'MEDIUM ROAST', level: 2, notes: 'Dark Chocolate · Almond · Caramel', band: '#C85A32' },
  { file: 'bag-highland.svg', name: ['HIGHLAND', 'ESPRESSO BLEND'], roast: 'DARK ROAST', level: 3, notes: 'Molasses · Cocoa Nib · Cedar', band: '#5A3A28' },
];
coffees.forEach(c => {
  const dots = [1, 2, 3].map(n => `<rect x="${262 + (n - 1) * 26}" y="540" width="20" height="8" rx="4" fill="${n <= c.level ? '#C85A32' : '#D9CFC0'}"/>`).join('');
  w(c.file, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 760" role="img" aria-label="${c.name.join(' ')} coffee bag">
  <defs>
    ${GRAIN}
    <linearGradient id="kraft" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#B8935F"/><stop offset=".35" stop-color="#CFAE7E"/><stop offset=".7" stop-color="#C6A474"/><stop offset="1" stop-color="#AD8856"/>
    </linearGradient>
  </defs>
  <ellipse cx="300" cy="722" rx="200" ry="20" fill="#1C1613" opacity=".22"/>
  <path d="M110 120H490L516 190V690A24 24 0 0 1 492 714H108A24 24 0 0 1 84 690V190Z" fill="url(#kraft)"/>
  <path d="M110 120H490L516 190V690A24 24 0 0 1 492 714H108A24 24 0 0 1 84 690V190Z" filter="url(#grain)" opacity=".7"/>
  <!-- folded top -->
  <path d="M104 62H496V132H104Z" fill="#A98558"/>
  <path d="M104 62H496V76H104Z" fill="#8F6E45" opacity=".55"/>
  <rect x="104" y="110" width="392" height="12" fill="#7d6140" opacity=".5"/>
  <rect x="130" y="82" width="340" height="12" rx="6" fill="#1C1613" opacity=".85"/>
  <!-- label -->
  <rect x="140" y="230" width="320" height="400" rx="12" fill="#FDFBF7"/>
  <rect x="140" y="230" width="320" height="16" rx="8" fill="${c.band}"/>
  <g transform="translate(276 270) scale(.95)">
    <circle cx="24" cy="24" r="22" fill="none" stroke="#1C1613" stroke-width="2"/>
    <ellipse cx="24" cy="29" rx="9" ry="12" transform="rotate(-18 24 29)" fill="#1C1613"/>
    <path d="M20 40c4-4 5-9 3-13" stroke="#FDFBF7" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M26 8c-5 4-3 8-1 10 1-3 4-4 4-8 3 3 4 7 2 10 4-2 5-8-5-12z" fill="#C85A32"/>
  </g>
  <text x="300" y="352" text-anchor="middle" ${FONT} font-weight="800" font-size="13" letter-spacing="4" fill="#8C827A">VANCE ARTISAN</text>
  <text x="300" y="400" text-anchor="middle" ${FONT} font-weight="800" font-size="38" fill="#1C1613">${c.name[0]}</text>
  <text x="300" y="434" text-anchor="middle" ${FONT} font-weight="700" font-size="20" letter-spacing="2" fill="#C85A32">${c.name[1]}</text>
  <rect x="190" y="458" width="220" height="2" fill="#E4DBCF"/>
  <text x="300" y="498" text-anchor="middle" ${BODY} font-weight="600" font-size="14" letter-spacing="3" fill="#1C1613">${c.roast}</text>
  ${dots}
  <text x="300" y="584" text-anchor="middle" ${BODY} font-size="14" fill="#6a5f57">${c.notes}</text>
  <text x="300" y="614" text-anchor="middle" ${BODY} font-size="12" letter-spacing="2" fill="#8C827A">250 g · WHOLE BEAN</text>
</svg>`);
});

// ---------- instagram tiles ----------
const bean = (x, y, r = 0, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><ellipse rx="17" ry="25" fill="#6B4630"/><path d="M0 -22C-6 -8 6 8 0 22" stroke="#33200f" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
const tile = (name, label, inner, bg) => w(name, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${label}">
  <defs>${GRAIN}</defs>
  <rect width="400" height="400" fill="${bg}"/>
  ${inner}
  <rect width="400" height="400" filter="url(#grain)" opacity=".5"/>
</svg>`);

tile('insta-1-roast-day.svg', 'Roast day', `
  <circle cx="200" cy="215" r="150" fill="#FDFBF7" opacity=".08"/>
  <path d="M200 70c-46 40-30 82-8 102 10-30 40-42 40-82 34 30 46 74 20 112 44-20 56-86-52-132z" fill="#FDFBF7" opacity=".95"/>
  <path d="M200 120c-20 20-12 42 0 54 6-16 20-22 20-42 14 14 16 36 4 52" fill="#E8B94A" opacity=".9"/>
  <path d="M60 330Q200 240 340 330V400H60Z" fill="#3a2518"/>
  ${[[110,350,20],[170,336,-30],[230,342,50],[290,352,-10],[140,376,80],[250,378,-60],[200,360,10],[320,380,30],[80,380,-40]].map(b => bean(b[0], b[1], b[2], 1)).join('')}
`, '#C85A32');

tile('insta-2-market.svg', 'Saturday market stall', `
  <rect y="290" width="400" height="110" fill="#8B5A3A"/>
  <rect y="290" width="400" height="6" fill="#3f2616" opacity=".4"/>
  ${Array.from({ length: 8 }).map((_, i) => `<path d="M${i * 50} 70h50v90a25 25 0 0 1-50 0z" fill="${i % 2 ? '#FDFBF7' : '#C85A32'}"/>`).join('')}
  <rect y="56" width="400" height="22" fill="#1C1613"/>
  <rect x="60" y="180" width="8" height="110" fill="#1C1613"/><rect x="332" y="180" width="8" height="110" fill="#1C1613"/>
  ${[90, 170, 250].map((x, i) => `<g transform="translate(${x} 214)"><path d="M0 8H62l6 12V76H-6V20Z" fill="#C9A77C"/><rect x="8" y="30" width="46" height="30" rx="3" fill="#FDFBF7"/><rect x="8" y="30" width="46" height="5" fill="${['#E2B04A','#C85A32','#5A3A28'][i]}"/></g>`).join('')}
  <circle cx="340" cy="360" r="16" fill="#FDFBF7" opacity=".9"/>
`, '#2A211C');

tile('insta-3-fresh-bags.svg', 'Fresh bags', `
  <ellipse cx="200" cy="345" rx="170" ry="16" fill="#000" opacity=".3"/>
  ${[[70, 150, '#E2B04A'], [150, 120, '#C85A32'], [230, 150, '#5A3A28']].map(([x, y, c]) => `
  <g transform="translate(${x} ${y})">
    <path d="M0 20H100l10 24V210a10 10 0 0 1-10 10H0a10 10 0 0 1-10-10V44Z" fill="#C9A77C"/>
    <rect x="-2" y="4" width="104" height="22" fill="#A98558"/>
    <rect x="12" y="76" width="76" height="86" rx="5" fill="#FDFBF7"/>
    <rect x="12" y="76" width="76" height="8" rx="4" fill="${c}"/>
    <circle cx="50" cy="112" r="12" fill="${c}"/>
    <rect x="26" y="136" width="48" height="5" rx="2.5" fill="#1C1613"/>
    <rect x="34" y="148" width="32" height="4" rx="2" fill="#8C827A"/>
  </g>`).join('')}
`, '#3A2D25');

tile('insta-4-pour-over.svg', 'Pour-over brew guide', `
  <circle cx="200" cy="200" r="150" fill="#D6C7B2"/>
  <path d="M110 150H290L250 250H150Z" fill="#FDFBF7"/>
  <rect x="100" y="140" width="200" height="16" rx="8" fill="#F0E6D6"/>
  <ellipse cx="200" cy="148" rx="86" ry="9" fill="#3d2415"/>
  <path d="M130 250h140v20q0 40-70 40t-70-40z" fill="#FDFBF7" opacity=".55" stroke="#FDFBF7"/>
  <path d="M132 292h136v8q0 36-68 36t-68-36z" fill="#2a1810"/>
  <path d="M330 40C290 80 240 100 204 144" stroke="#C85A32" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M330 40C290 80 240 100 204 144" stroke="#FDFBF7" stroke-width="2" fill="none" stroke-dasharray="2 12" stroke-linecap="round"/>
`, '#E9DFD0');

tile('insta-5-drum.svg', 'Behind the roast', `
  <circle cx="200" cy="200" r="150" fill="#2A211C"/>
  <circle cx="200" cy="200" r="150" fill="none" stroke="#C85A32" stroke-width="16"/>
  <circle cx="200" cy="200" r="130" fill="#120d0b"/>
  ${[[150,230,20],[200,248,-30],[250,230,60],[170,185,80],[230,190,-20],[200,208,40],[130,200,-60],[270,200,10],[180,150,30],[225,150,-45]].map(b => bean(b[0], b[1], b[2], 1.25)).join('')}
  <path d="M90 140A130 130 0 0 1 160 80" stroke="#FDFBF7" stroke-width="7" fill="none" opacity=".2" stroke-linecap="round"/>
`, '#1C1613');

tile('insta-6-latte.svg', 'Café partner flat white', `
  <rect width="400" height="400" fill="#8B5A3A"/>
  <g stroke="#3f2616" stroke-width="2" opacity=".3" fill="none"><path d="M0 90c130-14 270 14 400 0M0 200c130 14 270-14 400 0M0 310c130-14 270 14 400 0"/></g>
  <ellipse cx="205" cy="212" rx="150" ry="146" fill="#000" opacity=".25"/>
  <circle cx="200" cy="205" r="148" fill="#F0E6D6"/>
  <circle cx="200" cy="205" r="104" fill="#FDFBF7"/>
  <circle cx="200" cy="205" r="86" fill="#7a4a2d"/>
  <path d="M200 160c-26-22-60 2-40 30 10 14 40 40 40 40s30-26 40-40c20-28-14-52-40-30z" fill="#F0E6D6"/>
  <path d="M200 176v52" stroke="#7a4a2d" stroke-width="4" stroke-linecap="round"/>
  <path d="M310 190a24 24 0 0 1 0 42" stroke="#FDFBF7" stroke-width="12" fill="none" stroke-linecap="round" transform="translate(40 -4)"/>
`, '#8B5A3A');

console.log('generated', fs.readdirSync(out).length, 'files in', out);
