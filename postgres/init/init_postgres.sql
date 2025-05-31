DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin') THEN
    CREATE USER admin WITH PASSWORD 'secret';
  ELSE
    ALTER USER admin WITH PASSWORD 'secret';
  END IF;
END
$$ LANGUAGE plpgsql;