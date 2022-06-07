<?php

$sql = "
delete from to_delete;
            
insert into to_delete
select iv1.indicator_value_id from indicators_values iv1 join indicators i1 on (i1.indicator_id = iv1.indicator_id)
where 1=1
and exists (select * from indicators_values iv2 
              join indicators i2 on i2.indicator_id = iv2.indicator_id
			  where 1=1
              and iv1.year = iv2.year 
			  and iv1.country_code = iv2.country_code
			  and iv1.indicator_id = iv2.indicator_id 
              and i1.extracted_from_file_type = i2.extracted_from_file_type
			  and iv1.indicator_value_id < iv2.indicator_value_id) limit 10;
              
delete from indicators_values where indicator_value_id in(select indicator_value_id from to_delete where 1 and indicator_value_id is not null);
";
