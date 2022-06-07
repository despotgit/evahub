select kim.kpi_indicators_mapping_id,
i2.indicator_id as computed_indicator_id, 
i2.no_of_indicator as computed_indicator_no
from kpi_indicators_mapping kim
join indicators i2 on (i2.indicator_id = kim.computed_indicator_id);

select iv.* from indicators_values iv join indicators i on (i.indicator_id = iv.indicator_id and i.no_of_indicator = 'KPI.BP.5')
and iv.country_code = 'AT';

select * from kpi_indicators_mapping;

select * from indicators where no_of_indicator = 'KPI1.3.1';


