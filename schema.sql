CREATE TABLE IF NOT EXISTS

location(
    id SERIAL NOT NULL,
    search_query VARCHAR(256),
    formatted_query VARCHAR(256),
    latitude  NUMERIC(10, 7),
    longitude NUMERIC(10, 7)
);