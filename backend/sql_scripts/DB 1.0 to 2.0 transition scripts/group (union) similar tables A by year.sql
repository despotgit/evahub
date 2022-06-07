drop table if exists consolidated_cup_a_basic_parameters;
create table consolidated_cup_a_basic_parameters as
select 2014 as year, t.* from Consolidated_CUP_A_2014_Basic_Parameters t
union select 2015 as year, t.* from Consolidated_CUP_A_2015_Basic_Parameters t
union select 2016 as year, t.* from Consolidated_CUP_A_2016_Basic_Parameters t
union select 2017 as year, t.* from Consolidated_CUP_A_2017_Basic_Parameters t
union select 2018 as year, t.* from Consolidated_CUP_A_2018_Basic_Parameters t;

drop table if exists consolidated_cup_a_protection;
create table consolidated_cup_a_protection as
select 2014 as year, t.* from Consolidated_CUP_A_2014_Protection t
union select 2015 as year, t.* from Consolidated_CUP_A_2015_Protection t
union select 2016 as year, t.* from Consolidated_CUP_A_2016_Protection t
union select 2017 as year, t.* from Consolidated_CUP_A_2017_Protection t
union select 2018 as year, t.* from Consolidated_CUP_A_2018_Protection t;

drop table if exists consolidated_cup_a_controls;
create table consolidated_cup_a_controls as
select 2014 as year, t.* from Consolidated_CUP_A_2014_Controls t
union select 2015 as year, t.* from Consolidated_CUP_A_2015_Controls t
union select 2016 as year, t.* from Consolidated_CUP_A_2016_Controls t
union select 2017 as year, t.* from Consolidated_CUP_A_2017_Controls t
union select 2018 as year, t.* from Consolidated_CUP_A_2018_Controls t;

drop table if exists consolidated_cup_a_cooperation;
create table consolidated_cup_a_cooperation as
select 2014 as year, t.* from Consolidated_CUP_A_2014_Cooperation t
union select 2015 as year, t.* from Consolidated_CUP_A_2015_Cooperation t
union select 2016 as year, t.* from Consolidated_CUP_A_2016_Cooperation t
union select 2017 as year, t.* from Consolidated_CUP_A_2017_Cooperation t
union select 2018 as year, t.* from Consolidated_CUP_A_2018_Cooperation t;

#alter table Consolidated_CUP_A_2014_Facilitation change `None3` `None4` DECIMAL(2,1);
#alter table Consolidated_CUP_A_2014_Facilitation change `None2` `None3` DECIMAL(13,12);
#alter table Consolidated_CUP_A_2014_Facilitation add column `None2` VARCHAR(30) AFTER None1;

#alter table Consolidated_CUP_A_2015_Facilitation change `None3` `None4` DECIMAL(2,1);
#alter table Consolidated_CUP_A_2015_Facilitation change `None2` `None3` DECIMAL(13,12);
#alter table Consolidated_CUP_A_2015_Facilitation add column `None2` VARCHAR(30) AFTER None1;

drop table if exists consolidated_cup_a_facilitation;
create table consolidated_cup_a_facilitation as
select 2014 as year, t.* from Consolidated_CUP_A_2014_Facilitation t
union select 2015 as year, t.* from Consolidated_CUP_A_2015_Facilitation t
union select 2016 as year, t.* from Consolidated_CUP_A_2016_Facilitation t
union select 2017 as year, t.* from Consolidated_CUP_A_2017_Facilitation t
union select 2018 as year, t.* from Consolidated_CUP_A_2018_Facilitation t;

select * from Consolidated_CUP_A_2014_Controls;

select * from Consolidated_CUP_A_2015_Controls;

select * from Consolidated_CUP_A_2016_Controls;

select * from Consolidated_CUP_A_2017_Controls;

select * from Consolidated_CUP_A_2018_Controls;

#select * from Consolidated_CUP_A_2014_Facilitation
#union select * from Consolidated_CUP_A_2016_Facilitation;

