select * from indicators_values where !value > 0;

# Delete indicators with empty indicator code
delete from indicators where no_of_indicator is null;

# Delete some strange indicators wrongly inserted
select * from indicators where no_of_indicator like '|%' 
or no_of_indicator like '%value%' or no_of_indicator like '%utorisation%' or no_of_indicator like '%nswer%' or no_of_indicator like '%urrency%'
or no_of_indicator like '%ringemen%' or no_of_indicator like '%perator%' or no_of_indicator like '%ovement%' or no_of_indicator like '%fte%'
or no_of_indicator like '%EUR%' or no_of_indicator like '%equest%' or no_of_indicator like '%kg%' or no_of_indicator like '%SAD%' or no_of_indicator like '%pcs%' or no_of_indicator like '%reply%'
or no_of_indicator like '%man-day%' or no_of_indicator like '%scale%' escape '|';
delete from indicators where no_of_indicator = '%';
delete from indicators_values where indicator_id in (select indicator_id from indicators where no_of_indicator = '');
delete from indicators where no_of_indicator = '';

# Delete indicators values with empty indicator code
select iv.* from indicators_values iv join indicators i on (i.indicator_id = iv.indicator_id) where no_of_indicator is null;
drop table if exists to_delete;
create table to_delete as select indicator_value_id from indicators_values iv join indicators i on (i.indicator_id = iv.indicator_id) where no_of_indicator is null;
delete from indicators_values where indicator_value_id in (select indicator_value_id from to_delete);

# Delete indicators_values with null indicator_id
delete from indicators_values where indicator_id is null;

# Delete indicators_values with empty year
delete from indicators_values where year = '' or year = ' ';

# Check trailing spaces in indicator value
select * from indicators_values where value like '% ' or value like ' %';

# Check values with strange numbers, quasi numbers. Manual work required, case-to-case basis
select iv.* from indicators_values iv where value like '%,%' and value not like '%for%';

# Clean hanging indicators_values
delete from indicators_values where indicator_id not in (select indicator_id from indicators) limit 100000;

select * from indicators_values where indicator_id in (select indicator_id from indicators where no_of_indicator like '%eclaratio%');

# Clean duplicate indicators values:
drop table if exists to_delete;
            
create table to_delete as
select iv1.indicator_value_id as id_for_deletion from indicators_values iv1 join indicators i1 on (i1.indicator_id = iv1.indicator_id)
where 1=1
and exists (select * from indicators_values eiv 
			where 1=1
			and eiv.year = iv1.year 
			and eiv.country_code = iv1.country_code
			and eiv.indicator_id = iv1.indicator_id 
			and eiv.indicator_value_id > iv1.indicator_value_id);

# Index the values to be deleted! Very important for speed of query execution
alter table `to_delete` ADD INDEX id_for_deletion (id_for_deletion);

select * from indicators_values iv join indicators i on(i.indicator_id = iv.indicator_id)
where iv.indicator_value_id in(select id_for_deletion from to_delete) 
order by i.indicator_id asc,
iv.year asc, iv.country_code limit 1000000;

delete from indicators_values where indicator_value_id in(select id_for_deletion from to_delete);

# Check double indicators
select indicator_id from indicators i1
where exists (select * 
              from indicators i2 
              where i2.no_of_indicator = i1.no_of_indicator and i2.indicator_id > i1.indicator_id);

drop table if exists to_delete;

create table to_delete as
select indicator_id from indicators i1
where exists (select * 
              from indicators i2 
              where i2.no_of_indicator = i1.no_of_indicator and i2.indicator_id > i1.indicator_id);

select * from to_delete;

delete from indicators_values 
where indicator_id in (select td.indicator_id from to_delete td);              

delete from indicators where indicator_id in (select td.indicator_id from to_delete td);

