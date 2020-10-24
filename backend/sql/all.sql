CREATE TABLE users (
    user_id  NUMBER(10),
    username VARCHAR2(60),
    password VARCHAR2(1024)
);

CREATE UNIQUE INDEX user_id_pk ON users (user_id);

ALTER TABLE users ADD (
    CONSTRAINT user_id_pk PRIMARY KEY (user_id)
);

CREATE TABLE projects (
    project_id  NUMBER(10),
    owner_id NUMBER(10),
    project_name VARCHAR2(60)
);

CREATE UNIQUE INDEX project_id_pk ON projects (project_id);

ALTER TABLE projects ADD (
    CONSTRAINT project_id_pk PRIMARY KEY (project_id),
    CONSTRAINT project_owner_id_fk FOREIGN KEY(owner_id) REFERENCES users(user_id)
);

CREATE TABLE contributors (
    project_id  NUMBER(10),
    user_id NUMBER(10)
);

CREATE UNIQUE INDEX contributors_id_pk ON contributors (project_id, user_id);

ALTER TABLE contributors ADD (
    CONSTRAINT contributors_id_pk PRIMARY KEY (project_id, user_id),
    CONSTRAINT contributors_project_id_fk FOREIGN KEY(project_id) REFERENCES projects(project_id),
    CONSTRAINT contributors_user_id_fk FOREIGN KEY(user_id) REFERENCES users(user_id)
);

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

CREATE OR REPLACE PROCEDURE insertUser(p_username IN STRING, p_password IN STRING, p_user_id OUT NUMBER, p_error OUT NUMBER)
IS
BEGIN
    BEGIN
        INSERT INTO users(username, password)
        VALUES (p_username, p_password);

        p_user_id := users_sequence.currval;
        p_error := 0;
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

CREATE OR REPLACE PROCEDURE insertProject(p_project_name IN STRING, p_owner_id IN NUMBER, p_project_id OUT NUMBER, p_error OUT NUMBER)
IS
BEGIN
    BEGIN
        INSERT INTO projects(project_name, owner_id)
        VALUES (p_project_name, p_owner_id);

        p_project_id := projects_sequence.currval;

        INSERT INTO contributors(project_id, user_id)
        VALUES (p_project_id, p_owner_id);

        p_error := 0;
    EXCEPTION
        WHEN OTHERS THEN
        p_error := 1;
    END;
END;
/

CREATE OR REPLACE PROCEDURE getProject(p_project_name IN STRING, p_user_id IN NUMBER, p_project_id OUT NUMBER, p_error OUT NUMBER)
IS
BEGIN
    BEGIN
        SELECT project_id
        INTO p_project_id
        FROM projects
        WHERE project_name = p_project_name
              AND owner_id = p_user_id;
        p_error := 0;
    EXCEPTION
        WHEN OTHERS THEN
        p_project_id := NULL;
        p_error := 1;
    END;
END;
/

CREATE OR REPLACE PROCEDURE getProjects(p_user_id IN NUMBER, p_cursor OUT SYS_REFCURSOR, p_error OUT NUMBER)
IS 
BEGIN
    OPEN p_cursor FOR 
        SELECT p.project_id, p.owner_id, p.project_name
        FROM projects p
        WHERE p_user_id = p.owner_id;
    p_error := 0;    
EXCEPTION
    WHEN OTHERS THEN
    p_error := 1;        
END;
/

CREATE OR REPLACE PROCEDURE getContributedProjects(p_user_id IN NUMBER, p_cursor OUT SYS_REFCURSOR, p_error OUT NUMBER)
IS 
BEGIN
    OPEN p_cursor FOR 
        SELECT project_id, p.owner_id, p.project_name
        FROM projects p
            NATURAL JOIN contributors c
        WHERE p_user_id = c.user_id;
    p_error := 0;    
EXCEPTION
    WHEN OTHERS THEN
    p_error := 1;        
END;
/

COMMIT;


