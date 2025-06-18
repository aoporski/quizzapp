up:
	docker-compose up -d

down:
	docker-compose down

down-volumes:
	docker-compose down -v

build:
	docker-compose build

rebuild:
	docker-compose down -v && docker-compose build && docker-compose up -d

logs:
	docker-compose logs -f

keycloak-export:
	docker exec quizzapp-keycloak-1 /opt/keycloak/bin/kc.sh export \
		--dir /opt/keycloak/data/export \
		--realm master \
		--users realm_file
		
keycloak-backup: keycloak-export
	docker cp quizzapp-keycloak-1:/opt/keycloak/data/export ./keycloak/export

keycloak-import:
	docker exec quizzapp-keycloak-1 /opt/keycloak/bin/kc.sh import \
		--dir /opt/keycloak/data/export \
		--realm master \
		--override true
keycloak-export-quiz:
	docker exec quizzapp-keycloak-1 /opt/keycloak/bin/kc.sh export \
		--dir /opt/keycloak/data/export \
		--realm quizzapp \
		--users realm_file
		
keycloak-backup-quiz: keycloak-export
	docker cp quizzapp-keycloak-1:/opt/keycloak/data/export ./keycloak/export

keycloak-import-quiz:
	docker exec quizzapp-keycloak-1 /opt/keycloak/bin/kc.sh import \
		--dir /opt/keycloak/data/export \
		--realm quizzapp \
		--override true
		
psql:
	docker exec -it quizzapp-postgres psql -U admin -d user_service_db

mongo:
	docker exec -it quizzapp-mongo mongosh

setup-buildx:
	docker buildx create --name multiarch --use --bootstrap || true
	docker buildx inspect --bootstrap

# ===== Budowanie i pushowanie obrazów do Docker Hub =====

buildx-user:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		-t aoporski/user-service:latest \
		--push ./user_service

buildx-quiz:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		-t aoporski/quiz-service:latest \
		--push ./quiz_service

buildx-session:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		-t aoporski/session-service:latest \
		--push ./session_service

buildx-gateway:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		-t aoporski/gateway-service:latest \
		--push ./gateway_service

buildx-frontend:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		-t aoporski/frontend:latest \
		--push ./frontend

# ===== Wszystko naraz =====

buildx-all: buildx-user buildx-quiz buildx-session buildx-gateway buildx-frontend