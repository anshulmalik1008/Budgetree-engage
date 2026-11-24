# Budgetree Engage

Employee engagement workspace built with Next.js App Router, React and Tailwind CSS v4. The primary sidebar holds seven sections. Each section has its own compact navigation. On smaller screens, both menus become horizontal scrollable strips.

## Run in VS Code

Open this folder with **File → Open Folder**. Use Node.js 20.9+ (Node.js 22 or 24 recommended). In the VS Code terminal:

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Build and deploy

Run `npm run build` to generate the static site in `out/`. On Vercel, import your GitHub or Bitbucket repository and use the Next.js preset. If the repository contains unrelated folders, set the Vercel root directory to the folder containing this package.json. Keep `node_modules/`, `.next/`, and `out/` out of Git.

## Project structure

- `app/` contains the layouts, Tailwind theme and App Router pages.
- `components/workspace.jsx` implements the workspace and demo interactions.
- `lib/workspace.js` holds navigation, sample records and SOP content.

SOP library, People policies and Help centre are under Resources. The portal uses sample data and local browser storage. Recognition, surveys, gifting, redemption and budget changes are demo workflows. Production use requires authentication, permissions, shared backend storage, approved HR content and live reward fulfillment.

## Version 1.1

Expanded dashboard with quick access, post breakdown and celebrations. Module pages have their own overview and related links. Rewards has eight demo items with category filtering, and the SOP library includes onboarding, offboarding, recognition, redemption, celebrations and survey launch procedures.

## Version 1.2

The main navigation contains Dashboard, Employees, Attendance & Leave, Payroll & Performance, Engagement, Rewards and Resources. Each section opens its own smaller navigation. All 31 individually named pages in the reference screenshot are represented across these sections, along with the existing survey, rewards and workspace tools.

Employee, attendance and payroll screens use sample records. Where available, status changes are saved in the browser. Copilot AI opens a workspace guide with preset answers and links.

## Version 1.3

Adds section-specific gradients, a rewards balance panel, icon-led dashboard metrics and richer feed posts. Sample Townhall and Frontend Platform entries are adapted from the reference Siripay Engage demo. HR records and reward prices are illustrative. This version does not connect to a live data service.
# Budgetree-engage
