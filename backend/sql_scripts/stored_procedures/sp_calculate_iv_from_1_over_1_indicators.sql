drop procedure if exists sp_calculate_iv_from_1_over_1_indicators;

set sql_mode = '';

DELIMITER $$
CREATE PROCEDURE `sp_calculate_iv_from_1_over_1_indicators`(in no varchar(200),
 in no1 varchar(200),
 in no2 varchar(200),
 in apply_to_year int(4),
 in from_file_type varchar(60),
 in divisor int(10))
BEGIN

# PREPARATION: **********************************************************:

select indicator_id from indicators where no_of_indicator = no limit 1 into @id;

# CALCULATION: **********************************************************:

# Recalculate divisor (1, 100, 1000, 1000000, or the total) values in the temporary table

# First, set the hardcoded divisor (1, 10, 100, 1000, 1000000 being some of the usual ones)
update recalculation_divisor_values_tmp divi set divi.value = divisor;

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
    or not iv2.value REGEXP '^[0-9]*[.]?[0-9]+$' or iv2.value='NA' or iv2.value is null or iv2.value=0 or iv2.value='0'
    ),
    'not computable',
    iv1.value / (iv2.value * divi.value)),  # Formula
'Added using stored procedure for calculating values from 1 over 1 indicator ratio' as additional_info,
'calculated' as origin
from indicators_values iv1
join indicators i1 on (iv1.indicator_id = i1.indicator_id 
					   and i1.no_of_indicator = no1)
join indicators_values iv2 on (iv1.year = iv2.year and iv1.country_code = iv2.country_code) 
join indicators i2 on (iv2.indicator_id = i2.indicator_id 
                       and i2.no_of_indicator = no2)
join recalculation_divisor_values_tmp divi on (divi.year = iv1.year)
where 1=1
and if(from_file_type is null or from_file_type = '', true, i1.extracted_from_file_type = from_file_type) 
and if(from_file_type is null or from_file_type = '', true, i2.extracted_from_file_type = from_file_type)
and if(apply_to_year is null or apply_to_year = 0, true, iv1.year = apply_to_year)
order by year asc, country_code asc limit 100000;

# METADATA FINAL TOUCH: **********************************************************:

update indicators
set indicator_origin_type = 'computed',
is_composite = 1,
is_percentage = 1
where indicator_id = @id;

END$$
DELIMITER ;
