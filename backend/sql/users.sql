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
        WHEN OTHERS THEN
        p_password := NULL;
        p_error := 1;
    END;
END;
/

CREATE TABLE projects
(
    project_id  NUMBER(10) NOT NULL,
    owner_id NUMBER(10) NOT NULL,
    project_name VARCHAR2(60)
);

CREATE UNIQUE INDEX project_id_pk ON projects (project_id);

ALTER TABLE projects
    ADD (CONSTRAINT project_id_pk PRIMARY KEY (project_id));

CREATE SEQUENCE projects_sequence;

CREATE OR REPLACE TRIGGER projects_on_insert
  BEFORE INSERT ON projects
  FOR EACH ROW
BEGIN
  SELECT projects_sequence.nextval
  INTO :new.project_id
  FROM dual;
END;
/

CREATE OR REPLACE PROCEDURE insertProject(p_project_name IN STRING, p_owner_id IN NUMBER, p_project_id OUT NUMBER, p_error OUT NUMBER)
IS
BEGIN
    BEGIN
        INSERT INTO projects(project_name, owner_id)
        VALUES (p_project_name, p_owner_id);

        p_project_id := projects_sequence.currval;
        p_error := 0;
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
        p_error := 1;
    END;
END;
/

CREATE OR REPLACE PROCEDURE getProject(p_project_name IN STRING, p_owner_id OUT NUMBER, p_project_id OUT NUMBER, p_error OUT NUMBER)
IS
BEGIN
    BEGIN
        SELECT owner_id, project_id
        INTO p_owner_id, p_project_id
        FROM projects
        WHERE project_name = p_project_name;
        p_error := 0;
    EXCEPTION
        WHEN OTHERS THEN
        p_owner_id := NULL;
        p_project_id := NULL;
        p_error := 1;
    END;
END;
/

COMMIT;