CREATE TABLE users
(
    user_id  NUMBER(10) NOT NULL,
    username VARCHAR2(60),
    password VARCHAR2(1024)
);

CREATE UNIQUE INDEX user_id_pk ON users (user_id);

ALTER TABLE users
    ADD (CONSTRAINT user_id_pk PRIMARY KEY (user_id));

CREATE SEQUENCE users_sequence;

CREATE OR REPLACE TRIGGER users_on_insert
  BEFORE INSERT ON users
  FOR EACH ROW
BEGIN
  SELECT users_sequence.nextval
  INTO :new.user_id
  FROM dual;
END;
/

CREATE OR REPLACE PROCEDURE insertUser(p_username IN STRING, p_password IN STRING, p_user_id OUT NUMBER, p_error OUT NUMBER)
IS
BEGIN
    BEGIN
        INSERT INTO users(username, password)
        VALUES (p_username, p_password);

        p_user_id := users_sequence.currval;
        p_error := 0;
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
        p_error := 1;
    END;
END;
/

CREATE OR REPLACE PROCEDURE getUser(p_username IN STRING, p_user_id OUT NUMBER, p_password OUT STRING, p_error OUT NUMBER)
IS
BEGIN
    BEGIN
        SELECT user_id, password
        INTO p_user_id, p_password
        FROM users
        WHERE username = p_username;
        p_error := 0;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
        p_password := NULL;
        p_error := 1;
    END;
END;
/

COMMIT;