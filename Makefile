.PHONY: start
.DEFAULT_GOAL := install

install:
	@yarn
test:
	@yarn test

start:
	@echo "Démarrage du backend de l'api..."
	@yarn start

build:
	@echo "Build..."

deploy:
	@serverless deploy

refresh:
	make install deploy