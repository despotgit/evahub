create table consolidated_cup_q as
select * from consolidated_cup_q_basic_parameters
union
select * from consolidated_cup_q_controls;





