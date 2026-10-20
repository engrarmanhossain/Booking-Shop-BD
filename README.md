# Booking Shop BD | বাড়ি ও প্রপার্টি বুকিং পোর্টাল 🏠

A modern, fast, and feature-rich **House Rental Dashboard & Property Portal** built specifically for **Mirsarai Upazila, Chattogram, Bangladesh** — tailored for local landlords, bachelor job-holders, families, and executives working at the **Bangabandhu Sheikh Mujib Shilpa Nagar (BEZA / Mirsarai Economic Zone)**.

---

## 🌟 Key Features

### 1. 📋 Property Listing Management (Full CRUD)
- **Add & Edit Listings**: Full listing creation with validation (Property title in EN/BN, precise Mirsarai locality, rent in ৳ BDT, advance deposit, service charges, bedrooms, bathrooms, balconies, square feet, floor level, and house rules).
- **Preset Photo Selector**: Choose from curated high-quality architectural photos or paste custom image URLs.
- **Instant Status Toggle**: Switch between **Available (খালি)**, **Booked (বুকিং)**, and **Rented (ভাড়া সম্পন্ন)** in a single click from both Card and Table views.
- **Verification Badges**: Highlight verified local landlords.

### 2. 🔍 Advanced Mirsarai-Specific Filters & Search
- **Locality Filter**: Filter by Mirsarai's municipal and union hubs:
  - Baraiyarhat Pouroshobha (বারইয়ারহাট পৌরসভা)
  - Mirsarai Sadar Pouroshobha (মীরসরাই সদর পৌরসভা)
  - Zorarganj Bazar (জোরারগঞ্জ বাজার)
  - Bangabandhu Economic Zone / BEZA (বঙ্গবন্ধু শিল্পনগর / অর্থনৈতিক অঞ্চল)
  - Abu Torab Bazar / Mayani (আবু তোরাব বাজার)
  - Mithachhara Bazar (মিঠাচছড়া বাজার)
  - Karerhat (করেরহাট)
  - Saherkhali & Moghadia (সাহেরখালী ও মঘাদিয়া)
  - Hinguli (হিঙ্গুলী)
- **Property Types**: Apartment / Flat, Independent House, Bachelor Mess / Room, Sublet, and Commercial / Office Space.
- **Tenant Preferences**: Family Only, Bachelor (Male), Bachelor (Female / Students), Industrial Zone Executives & Engineers, or Flexible.
- **Price Range & Bedrooms**: Min/Max rent sliders and bedroom count filter.
- **Amenities Filter**: Filter by 24/7 Deep Tube-well Water, IPS/Generator backup, Cylinder/Pipeline Gas, Car/Bike Parking, Elevator/Lift, CCTV Guard, Wi-Fi, and South-facing Balcony.

### 3. 📊 Rental Market Analytics (Recharts Visualizations)
- **Average Rent by Locality**: Visual bar chart comparing rental prices across Baraiyarhat, Sadar, BEZA Belt, and other unions.
- **Property Type Distribution**: Donut chart displaying proportion of flats, houses, mess rooms, and commercial units.
- **Occupancy Rate**: Visual indicator showing current vacant vs occupied properties.
- **Tenant Audience Targeting**: Horizontal bar chart tracking family vs bachelor vs executive demand.
- **Market Insights**: Automated takeaways highlighting economic zone impacts on Mirsarai housing demand.

### 4. 👥 Tenant Inquiry & Lead Pipeline Tracker
- Track potential renters: Name, Phone, Profession/Employer, Desired Move-in Date, Budget, and Notes.
- **Pipeline Statuses**: `New Inquiry` ➔ `Contacted` ➔ `Viewing Scheduled` ➔ `Negotiating` ➔ `Rented / Closed` ➔ `Cancelled`.
- **One-Click Communication**: Direct Phone Call (`tel:`) and direct WhatsApp message with pre-populated Bengali/English text.

### 5. 🌐 Bilingual Support (বাংলা 🇧🇩 & English 🇬🇧)
- One-click toggle between Bengali (বাংলা) and English.
- Localized currency display (৳ BDT with Bengali numerals option).
- All labels, forms, badges, alerts, and market takeaways switch instantly.

### 6. 📱 Public Tenant View (Renter Portal Mode)
- Switch seamlessly between the **Landlord Management Dashboard** and the **Public Tenant Portal**.
- Public mode hides administrative controls (edit/delete) and allows renters to browse, filter, and send booking inquiries directly.

### 7. 💾 LocalStorage Persistence & Export
- All data is auto-saved in your browser's `localStorage` so changes persist on refresh.
- **Export Data**: Download your complete property catalog and leads as JSON.
- **Reset to Defaults**: Restore rich sample Mirsarai data anytime.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *Hind Siliguri* for crisp Bengali rendering)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to explore the dashboard.

### 2. Build for Production
```bash
npm run build
```
The optimized production bundle will be created in the `dist/` directory.

### 3. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
To-Let Mirsarai/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Header, tab navigation, language switcher & actions
│   │   ├── StatsCards.jsx           # Top metric cards & quick-filter chips
│   │   ├── FilterBar.jsx            # Multi-parameter filter & search system
│   │   ├── ListingCard.jsx          # Real estate card with badges, price & CTAs
│   │   ├── TableView.jsx            # Management data table with quick status toggle
│   │   ├── AnalyticsDashboard.jsx   # Market charts (Recharts) & BEZA takeaways
│   │   ├── LeadsManager.jsx         # Tenant inquiry pipeline & WhatsApp integration
│   │   ├── NewLeadModal.jsx         # Add inquiry / lead modal form
│   │   ├── ListingModal.jsx         # Add & edit property modal with photo presets
│   │   ├── ListingDetailModal.jsx   # Full detailed property modal & financial breakdown
│   │   ├── PublicPortalView.jsx     # Tenant-facing view (0% brokerage)
│   │   └── Footer.jsx               # Local Mirsarai hubs, info & community links
│   ├── context/
│   │   └── LanguageContext.jsx      # Bengali/English localization provider & currency formatter
│   ├── data/
│   │   ├── translations.js          # Bilingual dictionary (EN & BN)
│   │   └── mirsaraiData.js          # Mirsarai localities, amenities, preset photos & sample data
│   ├── App.jsx                      # Main app controller & state orchestration
│   ├── index.css                    # Tailwind CSS v4 styling & typography
│   └── main.jsx                     # React DOM entry point
├── index.html                       # HTML shell with Google Fonts & metadata
├── package.json
└── vite.config.js                   # Vite configuration with Tailwind CSS v4 plugin
```
