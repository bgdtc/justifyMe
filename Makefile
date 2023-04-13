.PHONY: start
.DEFAULT_GOAL := install

TERRAFORM_DIR=./terraform

install:
	@yarn

test:
	@yarn test

start:
	@echo "Démarrage du backend de l'api..."
	@yarn start

build:
	@echo "Build..."
	@tsc

deploy:
	@echo "Deploying API to aws"
	@serverless deploy

refresh:
	make install deploy

tf-init:
	cd ./terraform && terraform init

tf-plan:
	cd ./terraform && terraform plan

tf-apply:
	cd ./terraform && terraform apply