create table consolidated_cup_a as
select * from consolidated_cup_a_basic_parameters
union
select * from consolidated_cup_a_controls
union
select * from consolidated_cup_a_protection
union
select * from consolidated_cup_a_facilitation
union
select * from consolidated_cup_a_cooperation;





