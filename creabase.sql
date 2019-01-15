CREATE DATABASE IF NOT EXISTS projet_calendrier_ufc;

-- ============================================================
--   Nom de la base   :  projet_calendrier_ufc                    
--   Nom de SGBD      :  MYSQL                   
--   Date de création :  11/11/2018                              
-- ============================================================

USE projet_calendrier_ufc;

-- ============================================================
--   Table : USERS                                             
-- ============================================================

create table USERS
(
numUser INT(4) PRIMARY KEY NOT NULL,
pwUser VARCHAR(20) NOT NULL,
nameUser VARCHAR(30) NOT NULL;
);

-- ============================================================
--   Table : CALENDAR                                             
-- ============================================================

create table CALENDAR
(
idCalendar INT(4) PRIMARY KEY NOT NULL,
owner INT(4) NOT NULL,
dateCreation date NOT NULL,
constraint fk_calendar foreign key (owner) references USERS(numUser)
);

-- ============================================================
--   Table : LINK                                             
-- ============================================================

create table LINK
(
calendar INT(4) not null,
USERS INT(4) not null,
constraint fk_link_calendar foreign key (calendar) references CALENDAR(idCalendar),
constraint fk_link_USERS foreign key (USERS) references USERS(numUser)
);

-- ============================================================
--   Table : LINK                                             
-- ============================================================

insert into USERS values
     (1,'abc', 'jean');
insert into USERS values
     (2,'abc', 'pierre');
insert into USERS values
     (3,'abc', 'paul');
insert into USERS values
     (4,'abc', 'jacques');
insert into USERS values
     (5,'abc', 'nicole');
	 
	 
insert into CALENDAR values
	 (1, 2, '22/05/03');
insert into CALENDAR values
	 (2, 2, '22/05/03');
insert into CALENDAR values
	 (3, 2, '22/05/03');
insert into CALENDAR values
	 (4, 2, '22/05/03');
create table CALENDAR
(
idCalendar INT(4) PRIMARY KEY NOT NULL,
owner INT(4) NOT NULL,
dateCreation date NOT NULL,
constraint fk_calendar foreign key (owner) references USERS(numUser)
);