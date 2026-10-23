/*
 * Dades simulades (mock) de l'MVP.
 * Substituïbles per una font real (API o JSON) sense canviar la lògica de app.js.
 */

const CATEGORIES = ['Mobiliari', 'Electrònica i Recanvis', 'Eines i Taller', 'Tèxtil i Llar', 'Cultura'];
const ORIGIN_TYPES = ['Deixalleria Municipal', 'Millor que Nou', 'Repair Cafè', 'Botiga Segona Mà', 'Empresa / Excedent B2B'];
const STATES = ['Funcional', 'Necessita reparació', 'Només peces / Desballestament'];

// Històric simulat de la comunitat, que se suma a les reserves reals del navegador.
const IMPACTE_BASE = { objectes: 1284, co2_kg: 9730 };

const CATEGORY_COLORS = {
  'Mobiliari': '#8a6a4f',
  'Electrònica i Recanvis': '#3d6fa3',
  'Eines i Taller': '#6b6f76',
  'Tèxtil i Llar': '#a2567a',
  'Cultura': '#b08a2e'
};

// Imatge placeholder en SVG inline (data URI): cap dependència externa.
function placeholderImage(categoria, text) {
  const color = CATEGORY_COLORS[categoria];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${color}" stop-opacity="0.95"/>
        <stop offset="1" stop-color="${color}" stop-opacity="0.55"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#g)"/>
    <circle cx="200" cy="120" r="56" fill="#ffffff" fill-opacity="0.18"/>
    <text x="200" y="250" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="#ffffff" text-anchor="middle">${text}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const ITEMS = [
  {
    id: 'OBJ-001',
    titol: "Taula d'escriptori de fusta massissa",
    descripcio: "Taula de roure massís amb dos calaixos. Superfície en bon estat, amb algunes marques d'ús lleugeres.",
    categoria: 'Mobiliari',
    origen_tipus: 'Deixalleria Municipal',
    origen_nom: 'Punt Verd Tabuenca',
    ubicacio: 'Barcelona - Sants',
    estat_conservacio: 'Funcional',
    preu: 0,
    imatge_url: placeholderImage('Mobiliari', 'Taula de fusta'),
    co2_estalviat_kg: 45,
    disponible: true,
    instruccions: 'Zona de reutilització del Punt Verd, de dilluns a divendres de 9:00 a 14:00. Porteu un vehicle amb espai per a la taula.'
  },
  {
    id: 'OBJ-002',
    titol: "Font d'alimentació PC 500W",
    descripcio: 'Font d’alimentació ATX de 500 W. El ventilador fa soroll i cal revisar els condensadors abans d’utilitzar-la.',
    categoria: 'Electrònica i Recanvis',
    origen_tipus: 'Repair Cafè',
    origen_nom: 'Repair Cafè Gràcia',
    ubicacio: 'Barcelona - Gràcia',
    estat_conservacio: 'Necessita reparació',
    preu: 5,
    imatge_url: placeholderImage('Electrònica i Recanvis', 'Font 500W'),
    co2_estalviat_kg: 3.5,
    disponible: true,
    instruccions: 'Recollida al taller del Repair Cafè els dimarts de 18:00 a 20:00. Els voluntaris la revisaran abans de lliurar-la.'
  },
  {
    id: 'OBJ-003',
    titol: 'Rellotge de paret mecànic per a peces',
    descripcio: 'Mecanisme de rellotge de paret de corda. No funciona, però el moviment intern i la carcassa són aprofitables.',
    categoria: 'Eines i Taller',
    origen_tipus: 'Millor que Nou',
    origen_nom: "Millor que Nou L'Hospitalet",
    ubicacio: "L'Hospitalet de Llobregat",
    estat_conservacio: 'Només peces / Desballestament',
    preu: 0,
    imatge_url: placeholderImage('Eines i Taller', 'Rellotge'),
    co2_estalviat_kg: 6.5,
    disponible: true,
    instruccions: 'Cal concertar la recollida amb la xarxa abans de desplaçar-vos. La xarxa us confirmarà l’hora per correu.'
  },
  {
    id: 'OBJ-004',
    titol: 'Lot de 15 llibres tècnics',
    descripcio: "Manuals d'enginyeria, electrònica i programació dels anys 2000. Pàgines en bon estat i sense subratllats.",
    categoria: 'Cultura',
    origen_tipus: 'Botiga Segona Mà',
    origen_nom: 'Llibreria Segona Mà Sant Antoni',
    ubicacio: 'Barcelona - Eixample',
    estat_conservacio: 'Funcional',
    preu: 3,
    imatge_url: placeholderImage('Cultura', '15 llibres'),
    co2_estalviat_kg: 12,
    disponible: true,
    instruccions: 'Disponible al mostrador de la botiga, de 10:00 a 20:00. Pagament en efectiu o amb targeta.'
  },
  {
    id: 'OBJ-005',
    titol: "Caixa d'eines de mecànica (80 peces)",
    descripcio: 'Joc complet de cargols, claus i tornavisos. Falta una clau d’estrella de la mida petita.',
    categoria: 'Eines i Taller',
    origen_tipus: 'Deixalleria Municipal',
    origen_nom: 'Punt Verd Sant Adrià',
    ubicacio: 'Sant Adrià de Besòs',
    estat_conservacio: 'Funcional',
    preu: 5,
    imatge_url: placeholderImage('Eines i Taller', 'Caixa d’eines'),
    co2_estalviat_kg: 9,
    disponible: true,
    instruccions: 'Zona de reutilització del Punt Verd, de dilluns a dissabte de 8:00 a 15:00. Cal identificar-vos al punt.'
  },
  {
    id: 'OBJ-006',
    titol: 'Cadires de comedor de roure (x2)',
    descripcio: 'Parell de cadires de roure amb seient de boqueria. Un dels respatllers està fluix i cal reforçar-lo.',
    categoria: 'Mobiliari',
    origen_tipus: 'Millor que Nou',
    origen_nom: 'Millor que Nou Badalona',
    ubicacio: 'Badalona',
    estat_conservacio: 'Necessita reparació',
    preu: 12,
    imatge_url: placeholderImage('Mobiliari', 'Cadires'),
    co2_estalviat_kg: 28,
    disponible: true,
    instruccions: 'Recollida amb cita prèvia a la botiga de la xarxa. Porteu un vehicle amb capacitat per a dues cadires.'
  },
  {
    id: 'OBJ-007',
    titol: "Jaqueta d'hivern de llana",
    descripcio: 'Jaqueta de llana gruixuda, talla M. Estat impecable, sense botons solts ni forats.',
    categoria: 'Tèxtil i Llar',
    origen_tipus: 'Botiga Segona Mà',
    origen_nom: 'Botiga Segona Mà Poble-sec',
    ubicacio: 'Barcelona - Sants-Montjuïc',
    estat_conservacio: 'Funcional',
    preu: 5,
    imatge_url: placeholderImage('Tèxtil i Llar', 'Jaqueta'),
    co2_estalviat_kg: 6,
    disponible: true,
    instruccions: 'Penjada a la secció de roba d’home. Podeu provar-la a la botiga abans de confirmar la compra.'
  },
  {
    id: 'OBJ-008',
    titol: 'Manta de llana i cotó (excedent)',
    descripcio: "Manta d'excedent de producció, sense ús, amb un petit defecte d'empaquetat. Es reserva per unitat.",
    categoria: 'Tèxtil i Llar',
    origen_tipus: 'Empresa / Excedent B2B',
    origen_nom: 'Excedent Tèxtil Cooperativa',
    ubicacio: 'Cornellà de Llobregat',
    estat_conservacio: 'Funcional',
    preu: 0,
    imatge_url: placeholderImage('Tèxtil i Llar', 'Manta'),
    co2_estalviat_kg: 4.5,
    disponible: true,
    instruccions: 'Recollida al magatzem de la cooperativa, de dilluns a divendres de 9:00 a 13:00. Cal portar DNI.'
  },
  {
    id: 'OBJ-009',
    titol: 'Monitor LCD de 24 polzades',
    descripcio: 'Monitor de 24" amb la pantalla en bon estat, però sense senyal de vídeo. Probablement cal canviar el condensador.',
    categoria: 'Electrònica i Recanvis',
    origen_tipus: 'Repair Cafè',
    origen_nom: 'Repair Cafè Sant Andreu',
    ubicacio: 'Barcelona - Sant Andreu',
    estat_conservacio: 'Necessita reparació',
    preu: 8,
    imatge_url: placeholderImage('Electrònica i Recanvis', 'Monitor 24"'),
    co2_estalviat_kg: 22,
    disponible: true,
    instruccions: 'Recollida al taller els dijous de 17:30 a 19:30. Els voluntaris faran un diagnòstic inicial.'
  },
  {
    id: 'OBJ-010',
    titol: 'Bicicleta urbana de 28 polzades',
    descripcio: 'Bicicleta de ciutat amb cadena nova i frens que cal ajustar. Els pneumàtics són correctes.',
    categoria: 'Eines i Taller',
    origen_tipus: 'Millor que Nou',
    origen_nom: 'Millor que Nou Nou Barris',
    ubicacio: 'Barcelona - Nou Barris',
    estat_conservacio: 'Necessita reparació',
    preu: 12,
    imatge_url: placeholderImage('Eines i Taller', 'Bicicleta'),
    co2_estalviat_kg: 35,
    disponible: true,
    instruccions: 'Cal concertar la recollida amb la xarxa. Es pot passar a recollir en bicicleta o amb transport públic.'
  },
  {
    id: 'OBJ-011',
    titol: 'Impressora làser per a peces',
    descripcio: 'Impressora làser sense tòner ni capçal. Útil per a motors pas a pas, tapes i mecanismes de paper.',
    categoria: 'Electrònica i Recanvis',
    origen_tipus: 'Deixalleria Municipal',
    origen_nom: 'Punt Verd Sant Joan Despí',
    ubicacio: 'Sant Joan Despí',
    estat_conservacio: 'Només peces / Desballestament',
    preu: 0,
    imatge_url: placeholderImage('Electrònica i Recanvis', 'Impressora'),
    co2_estalviat_kg: 14,
    disponible: true,
    instruccions: 'Zona de reutilització del Punt Verd, de dilluns a divendres de 9:00 a 14:00. Cal portar-la desmuntada si és possible.'
  },
  {
    id: 'OBJ-012',
    titol: 'Estanteria metàl·lica modular',
    descripcio: "Estanteria d'acer de cinc nivells, desmuntable. Lot d'excedent d'un magatzem de distribució.",
    categoria: 'Mobiliari',
    origen_tipus: 'Empresa / Excedent B2B',
    origen_nom: 'Magatzem Excedent Vallès',
    ubicacio: 'Terrassa',
    estat_conservacio: 'Funcional',
    preu: 0,
    imatge_url: placeholderImage('Mobiliari', 'Estanteria'),
    co2_estalviat_kg: 18,
    disponible: false,
    instruccions: 'Recollida amb vehicle de càrrega. Actualment reservada per una altra entitat.'
  },
  {
    id: 'OBJ-013',
    titol: 'Ràdio de vàlvules',
    descripcio: 'Ràdio de sobretaula dels anys 60. Funciona en silenci, però l’altaveu i el cable d’alimentació necessiten revisió.',
    categoria: 'Electrònica i Recanvis',
    origen_tipus: 'Repair Cafè',
    origen_nom: 'Repair Cafè Poblenou',
    ubicacio: 'Barcelona - Sant Martí',
    estat_conservacio: 'Necessita reparació',
    preu: 5,
    imatge_url: placeholderImage('Electrònica i Recanvis', 'Ràdio'),
    co2_estalviat_kg: 4,
    disponible: true,
    instruccions: 'Recollida al taller els dissabtes de 10:00 a 13:00. Porteu la ràdio embalada per evitar cops.'
  }
];
