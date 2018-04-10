setup:
	cd frontend && make setup
	cd backend && make setup
	npm install -g newman

postman:
	newman run Postman.json	
