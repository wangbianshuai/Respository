create table t_d_Entity
(
Id varchar(36) not  null primary key,
Name varchar(50) not null,
Primary_Key varchar(50),
Is_Get tinyint default 1,
Is_Post tinyint default 1,
Is_Put tinyint default 1,
Is_Delete tinyint default 1
);