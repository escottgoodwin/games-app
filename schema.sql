-- schema.sql
-- Since we might run the import many times we'll drop if exists
-- DROP DATABASE IF EXISTS sports;

SELECT 'CREATE DATABASE sports'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sports')\gexec

\c sports;

CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  home_team VARCHAR,
  away_team VARCHAR,
  home_team_id VARCHAR,
  away_team_id VARCHAR,
  home_score VARCHAR,
  away_score VARCHAR,
  game_id VARCHAR,
  game_date DATE
);

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  team_id VARCHAR,
  team_name VARCHAR
);
