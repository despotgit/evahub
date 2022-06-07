select * from indicators_values where indicator_id in (select indicator_id from indicators where no_of_indicator='KPI.PR.9');

select * from indicators_values where indicator_id in (select indicator_id from indicators where no_of_indicator='pr-numb-record');

select * from indicators order by indicator_id asc limit 100000;

# See the jointment
select i1.no_of_indicator as original_no_of_indicator, i1.indicator_id as original_indicator_id, 
i2.no_of_indicator as computed_no_of_indicator, i2.indicator_id as computed_indicator_id
from indicators i1
join kpi_indicators_mapping kim on (i1.indicator_id = kim.original_indicator_id)
join indicators i2 on (i2.indicator_id = kim.computed_indicator_id);