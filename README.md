# proto-upcycling-frontend

Circular economy MVP: search, filter, and reserve reusable items from recycling centers, Repair Cafés, and second-hand shops.

---

## Requirements

Act as a senior front-end software engineer and UI/UX designer.

I need you to build a complete, fully functional web app MVP for the open-source project **"proto-upcycling-frontend"**.

The application is a circular economy platform that aggregates materials, spare parts, and items sourced from municipal civic amenity sites (*deixalleries*), "Millor que Nou" networks, second-hand shops (such as Humana or bookshops), social enterprises, and Repair Cafés, enabling users to search, filter, view details, and place a reservation request.

---

### TECHNICAL & ARCHITECTURAL REQUIREMENTS

1. **Technologies:** Semantic HTML5, modern CSS (Flexbox/Grid, clean and responsive layout, Tailwind-like styling or clean custom CSS), and modern Vanilla JavaScript (ES6+).
2. **Architecture:** 100% Client-side (no backend or external database).
3. **Persistence & Data:**
   - Define an initial set of mock data (JavaScript object array or JSON) with a minimum of 8–10 realistic items.
   - Use `localStorage` to persist reservation states (if a user reserves an item, its status switches to "Reserved" and cannot be reserved again during the session).
4. **Interface Language:** Catalan (keep UI labels, categories, and item descriptions in Catalan as specified below).

---

### ITEM DATA SCHEMA

Each item in the dataset must contain at least:

- `id`: Unique identifier (string/number).
- `titol`: Clear item title (e.g., "Taula d'escriptori de fusta massissa", "Font d'alimentació PC 500W", "Rellotge de paret mecànic per a peces", "Lot de 15 llibres tècnics").
- `categoria`: 'Mobiliari', 'Electrònica i Recanvis', 'Eines i Taller', 'Tèxtil i Llar', 'Cultura'.
- `origen_tipus`: 'Deixalleria Municipal', 'Millor que Nou', 'Repair Cafè', 'Botiga Segona Mà', 'Empresa / Excedent B2B'.
- `origen_nom`: Specific facility name (e.g., "Punt Verd Tabuenca", "Repair Cafè Gràcia", "Solidança").
- `ubicacio`: District or municipality (e.g., "Barcelona - Sants", "L'Hospitalet de Llobregat", "Badalona").
- `estat_conservacio`: 'Funcional', 'Necessita reparació', 'Només peces / Desballestament'.
- `preu`: 0 € (free) or a symbolic price / recovery fee (e.g., 5 €, 12 €).
- `imatge_url`: Coherent placeholder image URL (via Unsplash with parameters or inline SVG).
- `co2_estalviat_kg`: Estimated environmental metric of $kg$ of $CO_2$ saved by reusing it.
- `disponible`: Boolean (`true` / `false`).

---

### REQUIRED FEATURES & VIEWS

#### 1. Header & Hero Section

- App title ("Reviu | proto-upcycling-frontend") with a tagline about circular economy and waste reduction.
- **Community Impact Tracker:** A prominent live counter at the top displaying:
  - Total items recovered/reserved.
  - Total aggregate $kg$ of $CO_2$ saved.
- Quick link or button to filter by "Necessiten reparació (Repair Cafè)".

#### 2. Search Bar & Interactive Filters

- Live free-text search input (search by title, description, or origin).
- Filter by **Category** (`categoria`).
- Filter by **Origin Type** (`origen_tipus` - Civic Amenity Site, Repair Café, Social Shop, etc.).
- Filter by **Condition** (`estat_conservacio` - Functional vs. Parts only).
- Toggle switch to view only free items (0 €).

#### 3. Product Catalog Grid

- Clean, visual product cards for each item.
- Visible badges for origin, condition, and estimated $kg$ of $CO_2$ saved.
- Action button: "Veure detalls / Reservar". If already reserved, the button must be disabled with the label "Ja Reservat".

#### 4. Details Modal & Simple Reservation Flow

- Clicking an item opens an accessible modal dialog featuring:
  - Detailed information, provenance, and pickup instructions.
  - Short reservation confirmation form:
    - Input field for the user's Full Name.
    - Input field for Email Address.
    - Dropdown/picker for the estimated pickup date/slot (within the next 3 business days).
    - Disclaimer note: "Si no reculls l'article en 72 hores, tornarà a estar disponible per a la comunitat".
  - Upon submission:
    - Display a success screen/message with a simulated alphanumeric **Reservation Code** (e.g., `REC-84920`).
    - The item status in the catalog immediately updates to "Reserved".
    - The global impact counter updates the total $kg$ of $CO_2$ saved.

#### 5. Footer

- Mention alignment with the **EU Right to Repair Directive** and **UN SDGs 12, 11, and 13**.
- Link to the open-source GitHub repository.

---

### STYLING & UX GUIDELINES

- **Aesthetics:** Minimalist, clean, eco-friendly yet technical (soft neutral background, deep emerald greens for sustainability accents, and contrasting call-to-action colors).
- **Usability:** Smooth transitions, immediate UI feedback on filter adjustments and modal interactions, and a fully responsive, mobile-first design.

Deliver the complete, production-ready code, ready to run directly without any build steps or third-party dependencies.

---

## How to Run

No build step or backend is required. Open `index.html` in a browser, or serve the folder with a static server (e.g. `python3 -m http.server`).

---

## Structure

- `index.html`: semantic structure for the page and modal.
- `css/styles.css`: responsive (mobile-first) styles with color tokens in `:root`.
- `js/data.js`: mock item data (`ITEMS`).
- `js/app.js`: search, filters, rendering, reservation modal, and persistence in `localStorage`.

Reservations are stored in the browser and expire after 72 hours.

---

## License

MIT; see `LICENSE`.
