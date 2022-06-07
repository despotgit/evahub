drop table if exists consolidated_cup_q_basic_parameters;
create table consolidated_cup_q_basic_parameters as
select 2015 as year, t.* from Consolidated_CUP_Q_2015_Basic_Parameters t
union select 2016 as year, t.* from Consolidated_CUP_Q_2016_Basic_Parameters t
union select 2017 as year, t.* from Consolidated_CUP_Q_2017_Basic_Parameters t
union select 2018 as year, t.* from Consolidated_CUP_Q_2018_Basic_Parameters t;


drop table if exists consolidated_cup_q_controls;
create table consolidated_cup_q_controls as
select 2015 as year, t.* from Consolidated_CUP_Q_2015_Controls t
union select 2016 as year, t.* from Consolidated_CUP_Q_2016_Controls t
union select 2017 as year, t.* from Consolidated_CUP_Q_2017_Controls t
union select 2018 as year, t.* from Consolidated_CUP_Q_2018_Controls t;


select * from consolidated_cup_q_basic_parameters;

select * from consolidated_cup_q_controls;


