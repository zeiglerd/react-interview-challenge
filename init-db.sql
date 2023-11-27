-- CREATE TABLE
DROP TABLE IF EXISTS todo;
CREATE TABLE todo (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description VARCHAR,
    completed BOOLEAN NOT NULL
);

-- LOAD DATAS
INSERT INTO todo(id, title, completed)
VALUES
    (1, 'Do Laundry', false),
    (2, 'Make Dinner', false),
    (3, 'Exercise', false),
    (4, 'Take out Trash', false),
    (5, 'Drive Bob to Airport', false);