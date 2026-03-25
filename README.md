# DENTO SMART(TM) Web Dashboard (React)

Frontend showcase for the DENTO SMART(TM) platform. This repository contains the React + TypeScript + Vite implementation of the clinical monitoring dashboard used to visualize pediatric dental anxiety data.

This README is derived from the project overview, UI/UX guideline, and frontend architecture docs in the main monorepo.

## Product Overview

DENTO SMART(TM) is a digital monitoring platform designed to measure and analyze dental anxiety in pediatric patients during dental procedures. The web dashboard provides real-time monitoring, research analytics, and reporting workflows for clinicians and researchers.

Primary objectives:

- Real-time physiological monitoring during procedures
- Research-grade data collection and analysis
- Session-based monitoring per patient
- Device management for IoT monitoring hardware
- Structured clinical and research reporting

## Core Domains

- Live Monitoring: streaming sensor charts and session controls
- Patient Sessions: session history, metadata, and summaries
- Research Analytics: correlations, distributions, and trends
- Reporting: filtered reports and exports
- Device Management: device status and administration
- Calibration: sensor testing and diagnostics
- Patient Management: create and maintain patient records

## Tech Stack

- React 19 + TypeScript
- Vite
- TailwindCSS
- React Router
- Recharts

## Architecture Notes

- Layered frontend design: presentation, components, modules, services, data
- Pages are route-level compositions only; business logic lives in modules/services
- Shared UI components are centralized and reused across pages
- Real-time data is intended to flow via WebSocket and state stores

Recommended state/data stack (per architecture spec):

- React Query for server state
- Zustand for client/UI state

## Project Structure

```
apps/web-react/
  public/
  src/
    assets/
    components/
    hooks/
    layouts/
    modules/
    pages/
      auth/
      dashboard/
      devices/
      patients/
    services/
    stores/
    types/
    utils/
```

## Routes (Current)

Auth:

- /login
- /register
- /forgot-password
- /reset-password

Dashboard:

- /dashboard/live-monitoring
- /dashboard/patient-sessions
- /dashboard/research-analytics
- /dashboard/reporting
- /dashboard/device-management
- /dashboard/calibration

Patients:

- /patients
- /patients/new
- /patients/:id

Devices:

- /devices
- /devices/new

## Local Development

Requirements:

- Node.js 18+ (recommended)

Install and run:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Vercel Deployment (Showcase)

This repo is prepared for a frontend-only showcase (no backend). The app is a client-side SPA, so Vercel rewrites are configured to route all paths to index.html.

Deploy steps:

1. Import this GitHub repo into Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.

If you add backend APIs later, update environment variables and service URLs in the service layer.

## UI/UX Guidelines Summary

- Consistent layout across pages: sidebar, top navbar, main content
- Data-centric dashboards with charts and stat cards
- Clean hierarchy and minimal cognitive load
- Medical monitoring visual style with accessible contrast

## License

Proprietary. All rights reserved.

CI test marker (frontend).
