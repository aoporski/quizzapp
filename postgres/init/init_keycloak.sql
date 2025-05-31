CREATE DATABASE keycloak_db;
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin') THEN
    CREATE USER admin WITH PASSWORD 'secret';
  ELSE
    ALTER USER admin WITH PASSWORD 'secret';
  END IF;
END
$$;
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO admin;