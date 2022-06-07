drop procedure if exists sp_calculate_iv_for_indicator_based_on_3_indicators_equivalence;

set sql_mode = '';

DELIMITER $$
CREATE PROCEDURE `sp_calculate_iv_for_indicator_based_on_3_indicators_equivalence`(in no varchar(200),
 in no1 varchar(200),
 in no2 varchar(200),
 in no3 varchar(200),
 in apply_to_year int(4),
 in from_file_type varchar(60)
 )
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
select iv1.year, @id, iv1.country_code, 
    if((not iv1.value REGEXP '^[0-9]*[.]?[0-9]+$' or 
        not iv2.value REGEXP '^[0-9]*[.]?[0-9]+$' or 
        not iv3.value REGEXP '^[0-9]*[.]?[0-9]+$'), iv1.value,
    if(abs(round(iv1.value, 0) - round(iv2.value, 0)) < 1.2 
       and abs(round(iv1.value, 0) - round(iv3.value, 0)) < 1.2, round(iv1.value, 0), 'not computable')) as value,  # Formula
'Added using stored procedure for creation of 1 indicator based on 3 indicators equivalence' as additional_info,
'calculated' as origin
from indicators_values iv1
join indicators i1 on (iv1.indicator_id = i1.indicator_id and i1.no_of_indicator = no1)
join indicators_values iv2 on (iv2.year = iv1.year and iv2.country_code = iv1.country_code)
join indicators i2 on (iv2.indicator_id = i2.indicator_id and i2.no_of_indicator = no2)
join indicators_values iv3 on (iv3.year = iv1.year and iv3.country_code = iv1.country_code)
join indicators i3 on (iv3.indicator_id = i3.indicator_id and i3.no_of_indicator = no3)
where 1=1
and if(from_file_type is null or from_file_type = '', true, i1.extracted_from_file_type = from_file_type)
and if(apply_to_year is null or apply_to_year = 0, true, iv1.year = apply_to_year)
group by iv1.year, iv1.country_code
order by year asc, country_code asc limit 100000;

# METADATA FINAL TOUCH: **********************************************************:

update indicators
set indicator_origin_type = 'computed',
is_composite = 1,
is_percentage = 0
where indicator_id = @id;

END$$
DELIMITER ;
