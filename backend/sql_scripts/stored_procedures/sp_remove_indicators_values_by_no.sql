drop procedure if exists sp_remove_indicators_values_by_no;

set sql_mode = '';

DELIMITER $$
CREATE PROCEDURE `sp_remove_indicators_values_by_no`
(in no varchar(200),
 in apply_to_year int(4))
BEGIN

select indicator_id from indicators where no_of_indicator = no limit 1 into @id;

delete from indicators_values where indicator_id = @id 
and if(apply_to_year is null or apply_to_year = 0, true, year = apply_to_year);

END$$
DELIMITER ;
