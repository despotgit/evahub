drop procedure if exists sp_calculate_iv_from_fixed_value;

set sql_mode = '';

DELIMITER $$
CREATE PROCEDURE `sp_calculate_iv_from_fixed_value`(in no varchar(200),
 in val varchar(100),
 in apply_to_year int(4))
BEGIN

# PREPARATION: **********************************************************:

select indicator_id from indicators where no_of_indicator = no limit 1 into @id;

# CALCULATION: **********************************************************:

# Actual insertion of the indicator's values
INSERT INTO indicators_values
(
`year`,
`indicator_id`,
`country_code`,
`value`,
`additional_info`,
`origin`
)
select years.year, @id, c.country_code, 
val,  # Formula
'Added from stored procedure for calculation of values from a given value' as additional_info,
'calculated' as origin
from countries c join years on (1=1)
where 1=1
and if(apply_to_year is null or apply_to_year = 0, true, years.year = apply_to_year)
and (c.is_eu_member or c.is_eu_candidate)
order by year asc, country_code asc limit 100000;

# METADATA FINAL TOUCH: **********************************************************:

update indicators
set indicator_origin_type = 'computed',
is_composite = 0 # composed of more than one indicator or not
where indicator_id = @id;

END$$
DELIMITER ;

#call sp_calculate_iv_from_1_indicator('KPI.C.1','RK1.1.I1',null,true,1,false);