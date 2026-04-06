# Crochet Bouquet Studio

A web app to create custom crochet flower bouquets, customize them, and preview them using AI-generated images.

---

## Features (Frontend)

- Browse a collection of crochet flowers  
- Customize each flower with:
  - Color selection  
  - Quantity selection  
- Add and remove flowers from a bouquet  
- Live bouquet summary with a notepad-style interface  
- Dark and light mode toggle  
- Language switching (English and Hindi)  
- Improved UI with interactive components  

---

## Current Functionality

- Bouquet state management implemented (add, remove, update flowers)  
- Dynamic filtering by flower categories  
- Real-time UI updates based on user selections  
- Image assets integrated and displayed correctly  
- Frontend API layer prepared for bouquet generation  

---

## Tech Stack

- Frontend: Next.js (App Router)  
- State Management: React Hooks  
- Styling: Tailwind CSS  
- Backend (planned): FastAPI  
- AI (planned): Stable Diffusion (via Hugging Face)  

---

## Current Status

### Completed

- Frontend UI and interaction logic  
- Flower selection, customization, and display  
- Theme switching (dark and light)  
- Language toggle (English and Hindi)  
- API integration layer on frontend  

### In Progress

- Backend API implementation  
- AI bouquet generation integration  

---

## Getting Started

### Frontend

```bash
cd client
pnpm dev 

OR
make dev-client