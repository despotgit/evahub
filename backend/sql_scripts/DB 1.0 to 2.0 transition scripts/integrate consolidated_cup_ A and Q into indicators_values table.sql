drop table indicators_values;

create table indicators_values as select * from consolidated_cup_q;

insert into `CUP`.`indicators_values`
(`year`,
`Unit`,
`Q1`,
`Q2`,
`Q3`,
`Q4`,
`indicator_id`,
`country_code`,
`value`)
select
a.year, a.Unit, '', '', '', '', a.indicator_id, a.country_code, a.value
from consolidated_cup_a a;

