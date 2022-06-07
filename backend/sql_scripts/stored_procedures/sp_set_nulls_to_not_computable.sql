drop procedure if exists sp_set_nulls_to_not_computable;

DELIMITER $$
CREATE PROCEDURE `sp_set_nulls_to_not_computable`(in no varchar(200))
BEGIN

select indicator_id from indicators where no_of_indicator = no limit 1 into @id;

update indicators_values set value = 'not computable' where value is null and indicator_id = @id;

END$$
DELIMITER ;
