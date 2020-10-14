CREATE TABLE users
(
    user_id  NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
    username VARCHAR2(60),
    password VARCHAR2(60)
);

CREATE UNIQUE INDEX user_id_pk ON users (user_id);

ALTER TABLE users
    ADD (CONSTRAINT user_id_pk PRIMARY KEY (user_id));

COMMIT;