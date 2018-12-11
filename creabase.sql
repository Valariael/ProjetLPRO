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
pwUser VARCHAR(20) not null
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

