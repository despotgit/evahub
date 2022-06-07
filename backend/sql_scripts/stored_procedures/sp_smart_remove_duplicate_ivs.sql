drop procedure if exists sp_smart_remove_duplicate_ivs;

set sql_mode = '';

DELIMITER $$
CREATE PROCEDURE `sp_smart_remove_duplicate_ivs`
(in no varchar(200),
 in removeInvalidRawValues boolean)
BEGIN

# Prepare
select indicator_id from indicators where no_of_indicator = no limit 1 into @id;

# raw:
# (new definition) origin field = 'raw' 
# (former definition) the one for which exists also an indicator value with higher id
#
# calculated:
# (new definition) origin field = 'calculated'
# (former definition) the one for which exists also an indicator value with lower id 
#
# o) empty the id list
# a) enlist values for which a newer valid numeric calculated value exists,
# b) enlist non valid numeric raw values for which any newer calculated value exists,  
#    (this delete is optional, to be removed in case we would in future want to keep NK, - and similar values),
# c) enlist calculated values which are 'not computable' but a valid raw numeric value for it exists,
# g) enlist calculated values for that indicator, for which newer calculated value exists
# d) delete the values from the above list
# e) if the raw value for the computed indicator is the only one, and is invalid, set it to not computable too.
# f) remove the temporary table smart_to_delete

# o)
drop table if exists smart_to_delete;
create table smart_to_delete as select indicator_value_id as id_for_deletion from indicators_values limit 1;
delete from smart_to_delete;

# a)
insert into smart_to_delete 
select iv1.indicator_value_id from indicators_values iv1
join indicators_values iv2 
on (@id = iv1.indicator_id and @id = iv2.indicator_id and iv1.country_code = iv2.country_code and iv1.year = iv2.year)
where iv2.indicator_value_id > iv1.indicator_value_id 
and iv2.origin = 'calculated'
and iv2.value REGEXP '^[0-9]*[.]?[0-9]+$';

# b)
if(removeInvalidRawValues) then
insert into smart_to_delete 
select iv1.indicator_value_id from indicators_values iv1
join indicators_values iv2 
on (@id = iv1.indicator_id and @id = iv2.indicator_id and iv1.country_code = iv2.country_code and iv1.year = iv2.year)
where iv2.indicator_value_id > iv1.indicator_value_id 
and iv2.origin='calculated' 
and not iv1.value REGEXP '^[0-9]*[.]?[0-9]+$';
end if;

# c)
insert into smart_to_delete 
select iv2.indicator_value_id from indicators i
join indicators_values iv1 on (i.indicator_id = iv1.indicator_id)
join indicators_values iv2 on (i.indicator_id = iv2.indicator_id 
and iv1.country_code = iv2.country_code and iv1.year = iv2.year)
where 1=1
and i.indicator_id = @id
and iv2.indicator_value_id > iv1.indicator_value_id
and iv1.value REGEXP '^[0-9]*[.]?[0-9]+$'
and iv1.origin = 'raw' 
and iv2.value = 'not computable';

# g)
insert into smart_to_delete 
select iv1.indicator_value_id from indicators i
join indicators_values iv1 on (i.indicator_id = iv1.indicator_id)
join indicators_values iv2 on (i.indicator_id = iv2.indicator_id 
and iv1.country_code = iv2.country_code and iv1.year = iv2.year)
where 1=1
and i.indicator_id = @id
and iv2.indicator_value_id > iv1.indicator_value_id
and iv1.origin = 'calculated' 
and iv2.origin = 'calculated';


# d)
delete from indicators_values where indicator_value_id in (select id_for_deletion from smart_to_delete);

# e)
update indicators_values iv join indicators i on (iv.indicator_id = i.indicator_id)
set iv.value = 'not computable' where 1=1
and not iv.value REGEXP '^[0-9]*[.]?[0-9]+$'
and i.indicator_id = @id;

# f)
drop table if exists smart_to_delete;

END$$
DELIMITER ;