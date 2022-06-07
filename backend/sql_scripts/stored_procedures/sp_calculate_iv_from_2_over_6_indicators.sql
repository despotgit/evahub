drop procedure if exists sp_calculate_iv_from_2_over_6_indicators;

set sql_mode = '';

DELIMITER $$
CREATE PROCEDURE `sp_calculate_iv_from_2_over_6_indicators`
(in no varchar(200),
 in no1 varchar(200),
 in no2 varchar(200),
 in no3 varchar(200),
 in no4 varchar(200),
 in no5 varchar(200),
 in no6 varchar(200),
 in no7 varchar(200),
 in no8 varchar(200),
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
    if(exists (select * from indicators_values eiv
               join indicators ei on (ei.indicator_id = eiv.indicator_id)
               where 1=1
			   and ei.no_of_indicator in(no1, no2, no3, no4, no5, no6, no7, no8)
			   and eiv.year = iv1.year
               and eiv.country_code = iv1.country_code
               and if(from_file_type is null or from_file_type = '', true, ei.extracted_from_file_type = from_file_type)
			   and (not eiv.value REGEXP '^[0-9]*[.]?[0-9]+$' or eiv.value='NA' or eiv.value is null or eiv.value='not computable')),
    'not computable',
    (sum(case when i1.no_of_indicator in (no1, no2)
              then iv1.value
              end) 
    / sum(case when i1.no_of_indicator in(no3, no4, no5, no6, no7, no8)
               then iv1.value
               end)) / divi.value) as value,  # Formula
'Added using stored procedure for creation of 1 indicator as ratio of 2 over 6 indicators' as additional_info,
'calculated' as origin
from indicators_values iv1
join indicators i1 on (iv1.indicator_id = i1.indicator_id)
join recalculation_divisor_values_tmp divi on (divi.year = iv1.year)
where if(from_file_type is null or from_file_type = '', true, i1.extracted_from_file_type = from_file_type)
and if(apply_to_year is null or apply_to_year = 0, true, iv1.year = apply_to_year)
group by iv1.year, iv1.country_code
order by year asc, country_code asc limit 100000;

# METADATA FINAL TOUCHES: **********************************************************:

update indicators
set indicator_origin_type = 'computed',
is_composite = 1,
is_percentage = 1
where indicator_id = @id;

END$$
DELIMITER ;

#call sp_calculate_iv_from_2_over_6_indicators('RB1.2', 'B1.1.2.3', 'B1.2.2.2', 'B1.1.2.2', 'B1.1.2.3', 'B1.1.2.4', 'B1.2.2.1', 'B1.2.2.2', 'B1.2.2.3', 'consolidated-a', 1);

#select * from indicators where no_of_indicator in('B1.2.2.1', 'B1.2.2.2', 'B1.2.2.3', 'B1.1.2.2', 'B1.1.2.3', 'B1.1.2.4', 'B1.2.2.1', 'B1.2.2.2', 'B1.2.2.3');
