select * from indicators where no_of_indicator like '%KPI%'
and no_of_indicator not like '%KPI.%';

delete from indicators where no_of_indicator like '%KPI%'
and no_of_indicator not like '%KPI.%';

delete from indicators_values 
where 1=1
and indicator_id in(select indicator_id 
                    from indicators where 1=1
                    and no_of_indicator like '%KPI%'
					and no_of_indicator not like '%KPI.%') limit 100000;