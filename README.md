# Crochet Bouquet Studio

A web app to build custom crochet bouquets and preview them using an AI-assisted pipeline.

---

## Features

### Frontend
- Flower selection (cards)
- Color selection
- Quantity / variants
- Bouquet display (summary)
- Language switch (English / Hindi)
- Dark / light theme

### Backend
- API route: `/generate`
- Request schema (type, color, quantity)
- Service layer
- Image mapping (flower → image path)
- Basic composition flow (in progress)

---

## Completed

- Frontend page (cards, selection, state)
- Color + quantity handling
- Bouquet display
- Language + theme setup
- Frontend sends request to backend
- Backend endpoint created
- Route, schema, service structure
- Image mapping setup (flower → image)

---

## Pending

- Image composition logic
- AI integration
- Full pipeline (compose → AI → response)
- Error handling

---

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: FastAPI, Pydantic
- AI (planned): Stable Diffusion (Hugging Face)