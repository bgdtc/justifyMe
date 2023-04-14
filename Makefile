.PHONY: start
.DEFAULT_GOAL := install

TERRAFORM_DIR=./terraform
AWS_PROFILE=default

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
	AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) cd ./terraform && terraform init

tf-plan:
	AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) cd ./terraform && terraform plan

tf-apply:
	AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) cd ./terraform && terraform apply