create table users
(
    user_id  number(10),
    username varchar2(60),
    password varchar2(1024)
);

create unique index user_id_pk on users (user_id);

alter table users
    add (
        constraint user_id_pk primary key (user_id)
        );

create table projects
(
    project_id   number(10),
    owner_id     number(10),
    project_name varchar2(60)
);

create unique index project_id_pk on projects (project_id);

alter table projects
    add (
        constraint project_id_pk primary key (project_id),
        constraint project_owner_id_fk foreign key (owner_id) references users (user_id)
        );

create table contributors
(
    project_id number(10),
    user_id    number(10)
);

create unique index contributors_id_pk on contributors (project_id, user_id);

alter table contributors
    add (
        constraint contributors_id_pk primary key (project_id, user_id),
        constraint contributors_project_id_fk foreign key (project_id) references projects (project_id),
        constraint contributors_user_id_fk foreign key (user_id) references users (user_id)
        );

create table profiles
(
    user_id    number(10),
    first_name varchar2(30),
    last_name  varchar2(30),
    email      varchar2(30)
);

create unique index profiles_user_id_pk on profiles (user_id);

alter table profiles
    add (
        constraint profiles_user_id_pk primary key (user_id),
        constraint profiles_user_id_fk foreign key (user_id) references users (user_id)
        );

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

create or replace procedure insertUser(p_username in string, p_password in string, p_user_id out number,
                                       p_error out number)
    is
begin
    begin
        insert into users(username, password)
        values (p_username, p_password);

        p_user_id := users_sequence.currval;

        insert into profiles(user_id)
        values (p_user_id);

        p_error := 0;
    exception
        when others then
            p_error := 1;
    end;
end;
/

create or replace procedure getUser(p_username in string, p_user_id out number, p_password out string,
                                    p_error out number)
    is
begin
    begin
        select user_id, password
        into p_user_id, p_password
        from users
        where username = p_username;
        p_error := 0;
    exception
        when others then
            p_password := null;
            p_error := 1;
    end;
end;
/

create or replace procedure insertProject(p_project_name in string, p_owner_id in number, p_project_id out number,
                                          p_error out number)
    is
begin
    begin
        insert into projects(project_name, owner_id)
        values (p_project_name, p_owner_id);

        p_project_id := projects_sequence.currval;

        insert into contributors(project_id, user_id)
        values (p_project_id, p_owner_id);

        p_error := 0;
    exception
        when others then
            p_error := 1;
    end;
end;
/

create or replace procedure getProject(p_project_name in string, p_user_id in number, p_project_id out number,
                                       p_error out number)
    is
begin
    begin
        select project_id
        into p_project_id
        from projects
        where project_name = p_project_name
          and owner_id = p_user_id;
        p_error := 0;
    exception
        when others then
            p_project_id := null;
            p_error := 1;
    end;
end;
/

create or replace procedure getProjects(p_user_id in number, p_cursor out sys_refcursor, p_error out number)
    is
begin
    open p_cursor for
        select p.project_id, p.project_name
        from projects p
        where p_user_id = p.owner_id;
    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure getContributedProjects(p_user_id in number, p_cursor out sys_refcursor, p_error out number)
    is
begin
    open p_cursor for
        select project_id, p.owner_id, p.project_name
        from projects p
                 natural join contributors c
        where p_user_id = c.user_id;
    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure editProfile(p_user_id in number, p_first_name in string, p_last_name in string,
                                        p_email in string, p_error out number)
    is
begin
    update profiles
    set first_name=p_first_name,
        last_name=p_last_name,
        email=p_email
    where p_user_id = user_id;

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

create or replace procedure getProfile(p_user_id in number, p_first_name out string, p_last_name out string,
                                       p_email out string, p_error out number)
    is
begin
    select first_name, last_name, email
    into p_first_name, p_last_name, p_email
    from profiles
    where p_user_id = user_id;

    p_error := 0;
exception
    when others then
        p_error := 1;
end;
/

commit;


