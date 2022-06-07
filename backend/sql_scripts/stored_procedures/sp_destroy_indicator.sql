drop procedure if exists sp_destroy_indicator;

DELIMITER $$
CREATE PROCEDURE `sp_destroy_indicator`(in no varchar(200))
BEGIN

select indicator_id from indicators where no_of_indicator = no limit 1 into @id;

delete from indicators_values where indicator_id = @id;

delete from indicators_computations_formulas where no_of_destination_indicator = no;

delete from indicators_computations_formulas_exceptions where no_of_destination_indicator = no;

delete from indicators where no_of_indicator = no;

END$$
DELIMITER ;
