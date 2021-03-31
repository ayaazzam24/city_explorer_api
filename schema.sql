CREATE TABLE IF NOT EXISTS

location(
    id SERIAL NOT NULL,
    search_query VARCHAR(256),
    formatted_query VARCHAR(255),
    latitude  VARCHAR(255),
    longitude VARCHAR(255)
);