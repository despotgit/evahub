drop procedure if exists sp_calculate_iv_from_1_indicator;

set sql_mode = '';

DELIMITER $$
CREATE PROCEDURE `sp_calculate_iv_from_1_indicator`(in no varchar(200),
 in no1 varchar(200),
 in apply_to_year int(4),
 in from_file_type varchar(60),
 in prioritize_calculate_from_computed boolean,
 in divisor int(10),
 in as_percent_of_eu boolean)
BEGIN

# PREPARATION: **********************************************************:

select indicator_id from indicators where no_of_indicator = no limit 1 into @id;

select is_percentage from indicators where no_of_indicator = no1 limit 1 into @is_percentage;

# CALCULATION: **********************************************************:

# Recalculate divisor (1, 100, 1000, 1000000, or eu total) values in the temporary table

# First, set the hardcoded divisor (1, 10, 100, 1000, 1000000 being some of the usual ones)
update recalculation_divisor_values_tmp divi set divi.value = divisor;

# If the case may be, multiply the hardcoded divisor by the eu total, so the final value is divided by it at the end
if(as_percent_of_eu)
then
update recalculation_divisor_values_tmp divi
set divi.value = divi.value * (select sum(if(not iv.value REGEXP '^[0-9]*[.]?[0-9]+$' or iv.value='NA' or iv.value is null, 0, iv.value)) 
                               from indicators i join indicators_values iv on(i.indicator_id = iv.indicator_id) 
							   where 1=1
				               and i.no_of_indicator = no1
				               and iv.year = divi.year
				               and iv.country_code in (select country_code from countries where is_eu_member)
				               and if(from_file_type is null or from_file_type = '', true, i.extracted_from_file_type = from_file_type));
end if;

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
select iv1.year, @id, iv1.country_code, 
if((not iv1.value REGEXP '^[0-9]*[.]?[0-9]+$' or iv1.value='NA' or iv1.value is null
    or not divi.value REGEXP '^[0-9]*[.]?[0-9]+$' or divi.value='NA' or divi.value is null), 
    'not computable', 
    iv1.value / divi.value),  # Formula
    'Added from stored procedure for calculation from 1 other indicator' as additional_info,
'calculated' as origin
from indicators_values iv1
join indicators i1 on (iv1.indicator_id = i1.indicator_id and i1.no_of_indicator = no1)
join recalculation_divisor_values_tmp divi on (divi.year = iv1.year)
where 1=1
and if(prioritize_calculate_from_computed = true, i1.indicator_origin_type = 'computed', true)
and if(from_file_type is null or from_file_type = '', true, i1.extracted_from_file_type = from_file_type)
and if(apply_to_year is null or apply_to_year = 0, true, iv1.year = apply_to_year)
order by year asc, country_code asc limit 100000;

# METADATA FINAL TOUCH: **********************************************************:

update indicators
set indicator_origin_type = 'computed',
is_composite = 0, # composed of more than one indicator or not
is_percentage = (as_percent_of_eu or @is_percentage)
where indicator_id = @id;

END$$
DELIMITER ;
