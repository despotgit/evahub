select i1.no_of_indicator, i2.no_of_indicator, iv1.year, 
iv1.indicator_value_id as original_iv_id, iv1.value as original_value, 
iv2.indicator_value_id as computed_iv_id, iv2.value as computed_value, #iv1.country_code, iv1.year, iv1.value as original_value, iv2.value as computed_value 
iv1.country_code as country
from indicators i1
join indicators_values iv1 on (i1.indicator_id = iv1.indicator_id and iv1.country_code = 'AT')
join kpi_indicators_mapping kim on (kim.original_indicator_id = i1.indicator_id)
join indicators i2 on (i2.indicator_id = kim.computed_indicator_id)
join indicators_values iv2 on (iv2.indicator_id = i2.indicator_id and iv2.country_code = iv1.country_code and iv2.year = iv1.year)
where 1=1
and i1.indicator_id in (select original_indicator_id from kpi_indicators_mapping)
and i2.indicator_id in (select computed_indicator_id from kpi_indicators_mapping)
and iv1.year <> 2013
order by i1.indicator_id asc, iv1.year asc limit 100000;

select * from kpi_extended;


