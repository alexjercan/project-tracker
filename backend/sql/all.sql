create table users
(
    user_id    number(10),
    username   varchar2(60),
    password   varchar2(1024),
    first_name varchar2(60),
    last_name  varchar2(60),
    email      varchar2(60)
);

create unique index users_user_id_pk on users (user_id);

alter table users
    add (
        constraint users_user_id_pk primary key (user_id)
        );

create table projects
(
    project_id    number(10),
    owner_id      number(10),
    project_name  varchar2(60),
    description   varchar2(1024),
    started       date,
    deadline      date,
    last_modified date
);

create unique index projects_project_id_pk on projects (project_id);

alter table projects
    add (
        constraint projects_project_id_pk primary key (project_id),
        constraint projects_owner_id_fk foreign key (owner_id) references users (user_id)
        );

create table contributors
(
    contributor_id number(10),
    user_id        number(10),
    project_id     number(10)
);

create unique index contributors_contributor_id_pk on contributors (contributor_id);

alter table contributors
    add (
        constraint contributors_contributor_id_pk primary key (contributor_id),
        constraint contributors_user_id_fk foreign key (user_id) references users (user_id),
        constraint contributors_project_id_fk foreign key (project_id) references projects (project_id)
        );

create table comments
(
    comment_id  number(10),
    user_id     number(10),
    project_id  number(10),
    description varchar2(1024),
    timestamp   date
);

create unique index comments_comment_id_pk on comments (comment_id);

alter table comments
    add (
        constraint comments_comment_id_pk primary key (comment_id),
        constraint comments_user_id_fk foreign key (user_id) references users (user_id),
        constraint comments_project_id_fk foreign key (project_id) references projects (project_id)
        );

------ AUTOMATED PK -------

create sequence users_sequence;

create or replace trigger users_on_insert
    before insert
    on users
    for each row
begin
    select users_sequence.nextval
    into :NEW.user_id
    from dual;
end;
/

create sequence projects_sequence;

create or replace trigger projects_on_insert
    before insert
    on projects
    for each row
begin
    select projects_sequence.nextval
    into :NEW.project_id
    from dual;
end;
/

create sequence contributors_sequence;

create or replace trigger contributors_on_insert
    before insert
    on contributors
    for each row
begin
    select contributors_sequence.nextval
    into :NEW.contributor_id
    from dual;
end;
/

create sequence comments_sequence;

create or replace trigger comments_on_insert
    before insert
    on comments
    for each row
begin
    select contributors_sequence.nextval
    into :NEW.comment_id
    from dual;
end;

------- UTIL FUNCTIONS -------

create or replace function getUserId(p_username in string) return number
    is
    v_user_id users.user_id%type;
begin
    select user_id
    into v_user_id
    from users
    where p_username = username;

    return v_user_id;
end;

create or replace function getProjectId(p_owner_username in string, p_project_name in string) return number
    is
    v_owner_id   users.user_id%type;
    v_project_id projects.project_id%type;
begin
    v_owner_id := getUserId(p_owner_username);

    select project_id
    into v_project_id
    from projects
    where p_project_name = project_name
      and v_owner_id = owner_id;

    return v_project_id;
end;


create or replace function doesContributorExistFunc(p_project_name in string, p_owner_username in string,
                                                    p_username in string) return number
    is
    result_count number := 0;
    v_user_id    users.user_id%type;
    v_project_id projects.project_id%type;
    v_owner_id   users.user_id%type;
begin
    v_user_id := getUserId(p_username);
    v_owner_id := getUserId(p_owner_username);
    v_project_id := getProjectId(p_owner_username, p_project_name);

    select count(*)
    into result_count
    from contributors
    where v_project_id = project_id
      and v_user_id = user_id
    group by project_id, user_id;

    if result_count = 0 then
        return 0;
    else
        return 1;
    end if;
exception
    when others then
        return 0;
end;


------- PROCEDURES --------

create or replace procedure insertUser(p_username in string, p_password in string, p_error out number)
    is
begin
    insert into users(username, password)
    values (p_username, p_password);

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure editProfile(p_username in string, p_first_name in string, p_last_name in string,
                                        p_email in string, p_error out number)
    is
begin
    update users
    set first_name=p_first_name,
        last_name=p_last_name,
        email=p_email
    where p_username = username;

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure getPassword(p_username in string, p_password out string, p_error out number)
    is
begin
    select password into p_password from users where username = p_username;
    p_error := 0;
exception
    when others then
        p_password := null;
        p_error := 1;
end;
/

create or replace procedure getProfile(p_username in string, p_first_name out string, p_last_name out string,
                                       p_email out string, p_error out number)
    is
begin
    select first_name, last_name, email
    into p_first_name, p_last_name, p_email
    from users
    where p_username = username;

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure insertProject(p_project_name in string, p_owner_username in string, p_error out number)
    is
    v_owner_id   users.user_id%type;
    v_project_id projects.project_id%type;
begin
    v_owner_id := getUserId(p_owner_username);

    insert into projects(project_name, owner_id, started, last_modified)
    values (p_project_name, v_owner_id, sysdate, sysdate);

    v_project_id := projects_sequence.currval;

    insert into contributors(user_id, project_id)
    values (v_owner_id, v_project_id);

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure editRepository(p_username in string, p_owner_username in string, p_project_name in string,
                                           p_description in string, p_deadline in string, p_started out string,
                                           p_last_modified out string, p_error out number)
    is
    v_user_id    users.user_id%type;
    v_owner_id   users.user_id%type;
    v_project_id projects.project_id%type;
begin
    v_user_id := getUserId(p_username);
    v_owner_id := getUserId(p_owner_username);
    v_project_id := getProjectId(p_owner_username, p_project_name);

    update projects
    set description=p_description,
        deadline=TO_DATE(p_deadline, 'DD-MM-YYYY HH:MI A.M.'),
        last_modified=sysdate
    where v_project_id = project_id
      and v_user_id in (select user_id
                        from contributors c
                        where project_id = v_project_id);

    select TO_CHAR(started, 'DD-MM-YYYY HH:MI A.M.'), TO_CHAR(last_modified, 'DD-MM-YYYY HH:MI A.M.')
    into p_started, p_last_modified
    from projects
    where v_project_id = project_id
      and v_user_id in (select user_id
                        from contributors c
                        where project_id = v_project_id);

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure doesProjectExists(p_project_name in string, p_owner_username in string, p_error out number)
    is
    result_count number := 0;
    v_owner_id   users.user_id%type;
begin
    v_owner_id := getUserId(p_owner_username);

    select count(*)
    into result_count
    from projects
    where p_project_name = project_name
      and v_owner_id = owner_id
    group by project_name, owner_id;

    if result_count = 0 then
        p_error := 0;
    else
        p_error := 1;
    end if;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure getProjects(p_username in string, p_cursor out sys_refcursor, p_error out number)
    is
    v_user_id users.user_id%type;
begin
    v_user_id := getUserId(p_username);

    open p_cursor for
        select p.project_name, o.username
        from projects p
                 join users o on p.owner_id = o.user_id
                 join contributors c on p.project_id = c.project_id
        where c.user_id = v_user_id;

    p_error := 0;
exception
    when others then
        open p_cursor for select null from dual;
        p_error := 1;
end;
/

create or replace procedure getRepository(p_username in string, p_owner_username in string, p_project_name in string,
                                          p_description out string, p_started out string, p_deadline out string,
                                          p_last_modified out string, p_error out number)
    is
    v_user_id    users.user_id%type;
    v_owner_id   users.user_id%type;
    v_project_id projects.project_id%type;
begin
    v_user_id := getUserId(p_username);
    v_owner_id := getUserId(p_owner_username);
    v_project_id := getProjectId(p_owner_username, p_project_name);

    select description,
           TO_CHAR(started, 'DD-MM-YYYY HH:MI A.M.'),
           TO_CHAR(deadline, 'DD-MM-YYYY HH:MI A.M.'),
           TO_CHAR(last_modified, 'DD-MM-YYYY HH:MI A.M.')
    into p_description, p_started, p_deadline, p_last_modified
    from projects
    where project_id = v_project_id
      and v_user_id in (select user_id
                        from contributors c
                        where project_id = v_project_id);

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure insertContributor(p_project_name in string, p_owner_username in string,
                                              p_contributor_username in string, p_error out number)
    is
    v_user_id    users.user_id%type;
    v_project_id projects.project_id%type;
    v_owner_id   users.user_id%type;
begin
    v_user_id := getUserId(p_contributor_username);
    v_owner_id := getUserId(p_owner_username);
    v_project_id := getProjectId(p_owner_username, p_project_name);

    insert into contributors(user_id, project_id)
    values (v_user_id, v_project_id);

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure doesContributorExists(p_project_name in string, p_owner_username in string,
                                                  p_contributor_username in string, p_error out number)
    is
    result_count number := 0;
    v_user_id    users.user_id%type;
    v_project_id projects.project_id%type;
    v_owner_id   users.user_id%type;
begin
    v_user_id := getUserId(p_contributor_username);
    v_owner_id := getUserId(p_owner_username);
    v_project_id := getProjectId(p_owner_username, p_project_name);

    select count(*)
    into result_count
    from contributors
    where v_project_id = project_id
      and v_user_id = user_id
    group by project_id, user_id;

    if result_count = 0 then
        p_error := 0;
    else
        p_error := 1;
    end if;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure getContributors(p_owner_username in string, p_project_name in string,
                                            p_cursor out sys_refcursor, p_error out number)
    is
    v_project_id projects.project_id%type;
    v_owner_id   users.user_id%type;
begin
    v_owner_id := getUserId(p_owner_username);
    v_project_id := getProjectId(p_owner_username, p_project_name);

    open p_cursor for
        select project_name, username
        from contributors
                 natural join users
                 natural join projects
        where v_project_id = project_id;

    p_error := 0;
exception
    when others then
        open p_cursor for select null from dual;
        p_error := 1;
end;
/

create or replace procedure insertComment(p_owner_username in string, p_project_name in string, p_username in string,
                                          p_description in string, p_timestamp out string, p_error out number)
    is
    v_user_id    users.user_id%type;
    v_owner_id   users.user_id%type;
    v_project_id projects.project_id%type;
    v_timestamp  comments.timestamp%type;
    v_exists     number;
begin
    v_user_id := getUserId(p_username);
    v_owner_id := getUserId(p_owner_username);
    v_project_id := getProjectId(p_owner_username, p_project_name);

    v_exists := doesContributorExistFunc(p_project_name, p_owner_username, p_username);

    select sysdate
    into v_timestamp
    from dual;

    if v_exists = 1 then
        insert into comments(user_id, project_id, description, timestamp)
        values (v_user_id, v_project_id, p_description, v_timestamp);

        p_timestamp := TO_CHAR(v_timestamp, 'DD-MM-YYYY HH:MI A.M.');

        p_error := 0;
    else
        p_error := 1;
    end if;
exception
    when others then
        p_error := 1;
end;

create or replace procedure getComments(p_username in string, p_owner_username in string, p_project_name in string,
                                        p_cursor out sys_refcursor, p_error out number)
    is
    v_project_id projects.project_id%type;
    v_owner_id   users.user_id%type;
    v_exists     number;
begin
    v_owner_id := getUserId(p_owner_username);
    v_project_id := getProjectId(p_owner_username, p_project_name);
    v_exists := doesContributorExistFunc(p_project_name, p_owner_username, p_username);

    open p_cursor for
        select username, description, timestamp
        from users
                 natural join comments
        where v_project_id = project_id
          and v_exists = 1;

    if v_exists = 1 then
        p_error := 0;
    else
        p_error := 1;
    end if;
exception
    when others then
        open p_cursor for select null from dual;
        p_error := 1;
end;