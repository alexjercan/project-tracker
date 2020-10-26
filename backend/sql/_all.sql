create table users
(
    username   varchar2(60),
    password   varchar2(1024),
    first_name varchar2(60),
    last_name  varchar2(60),
    email      varchar2(60)
);

create unique index users_username_pk on users (username);

alter table users
    add (
        constraint users_username_pk primary key (username)
        );

create table projects
(
    owner_username varchar2(60),
    project_name   varchar2(60),
    description    varchar2(1024),
    started        date,
    deadline       date,
    last_modified  date
);

create unique index projects_project_id_pk on projects (owner_username, project_name);

alter table projects
    add (
        constraint projects_project_id_pk primary key (owner_username, project_name),
        constraint projects_owner_id_fk foreign key (owner_username) references users (username)
        );

create table contributors
(
    username       varchar2(60),
    owner_username varchar2(60),
    project_name   varchar2(60)
);

create unique index contributors_id_pk on contributors (username, owner_username, project_name);

alter table contributors
    add (
        constraint contributors_contributor_id_pk primary key (username, owner_username, project_name),
        constraint contributors_username_fk foreign key (username) references users (username),
        constraint contributors_project_id_fk foreign key (owner_username, project_name) references projects (owner_username, project_name)
        );

create or replace procedure insertUser(p_username in string, p_password in string, p_error out number)
    is
begin
    begin
        insert into users(username, password)
        values (p_username, p_password);

        p_error := 0;
    exception
        when others then
            p_error := 1;
    end;
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
    begin
        select password into p_password from users where username = p_username;
        p_error := 0;
    exception
        when others then
            p_password := null;
            p_error := 1;
    end;
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
begin
    begin
        insert into projects(project_name, owner_username)
        values (p_project_name, p_owner_username);

        insert into contributors(username, owner_username, project_name)
        values (owner_username, owner_username, project_name);

        p_error := 0;
    exception
        when others then
            p_error := 1;
    end;
end;
/

create or replace procedure editRepository(p_username in string, p_owner_username in string, p_project_name in string,
                                           p_description in string, p_deadline in string, p_error out number)
    is
begin
    update projects
    set description=p_description,
        deadline=TO_DATE(p_deadline, 'DD-MM-YYYY HH:MI A.M.'),
        last_modified=sysdate
    where p_owner_username = owner_username
      and p_project_name = project_name
      and p_username in (select username
                         from contributors c
                         where p_owner_username = c.owner_username
                           and p_project_name = c.project_name);

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure doesProjectExists(p_project_name in string, p_owner_username in string, p_error out number)
    is
    result_count number := 0;
begin
    select count(*)
    into result_count
    from projects
    where p_project_name = project_name
      and p_owner_username = owner_username
    group by project_name, owner_username;

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
begin
    open p_cursor for
        select project_name, owner_username
        from projects p
                 natural join contributors c
                 natural join users u
        where p_username = username;

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure getRepository(p_username in string, p_owner_username in string, p_project_name in string,
                                          p_description out string, p_started out string, p_deadline out string,
                                          p_last_modified out string, p_error out number)
    is
begin
    select description,
           TO_CHAR(started, 'DD-MM-YYYY HH:MI A.M.'),
           TO_CHAR(deadline, 'DD-MM-YYYY HH:MI A.M.'),
           TO_CHAR(last_modified, 'DD-MM-YYYY HH:MI A.M.')
    into p_description, p_started, p_deadline, p_last_modified
    from projects
             natural join contributors
    where p_owner_username = owner_username
      and p_project_name = project_name
      and p_username = username;

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/
