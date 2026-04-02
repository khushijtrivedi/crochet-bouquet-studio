dev-client:
	cd client && pnpm dev

dev-server:
	cd server && source venv/bin/activate && uvicorn main:app --reload
