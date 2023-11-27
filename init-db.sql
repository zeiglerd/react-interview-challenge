-- CREATE TABLE
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description VARCHAR,
    completed BOOLEAN NOT NULL
);

-- LOAD DATAS
INSERT INTO todo(title, completed)
VALUES
    ('Do Laundry', false),
    ('Make Dinner', false),
    ('Exercise', false),
    ('Take out Trash', false),
    ('Drive Bob to Airport', false);