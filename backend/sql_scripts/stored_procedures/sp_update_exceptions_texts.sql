drop procedure if exists sp_update_exceptions_texts;

DELIMITER $$
CREATE  PROCEDURE `sp_update_exceptions_texts`()
BEGIN

update indicators i join exceptions e on (i.no_of_indicator = e.no_of_indicator)
set i.calculation_exception_text = e.text;

END$$
DELIMITER ;