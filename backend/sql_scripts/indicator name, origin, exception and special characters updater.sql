/* 
Prerequisites:
-Have table names with no_of_indicator, name_of_indicator, indicator_origin_type, and exception to 
 connect it to the corresponding fields in the table indicators
*/

update indicators i
join names n on (i.no_of_indicator = n.no_of_indicator)
set i.name_of_indicator = n.name_of_indicator,
i.indicator_origin_type = n.indicator_origin_type,
i.has_calculation_exception = if(n.exception is null or n.exception = '' or n.exception = ' ' or n.exception = 'No' or n.exception = 'NO' or n.exception = 'no' , 0, 1),
i.calculation_exception_text = n.exception_text;


# Might be useful, to also update indicators that are not consolidated-a nor consolidated-q:
#update indicators i join names_a n on n.no_of_indicator = i.no_of_indicator set i.name_of_indicator = n.name_of_indicator
#where i.extracted_from_file_type = "consolidated-a" or i.indicator_origin_type = 'computed';


# Currency and logical operators special characters cleaner
update indicators set name_of_indicator = replace(name_of_indicator, '000 �', '000 €');
update indicators set name_of_indicator = replace(name_of_indicator, '000?', '000€');
update indicators set name_of_indicator = replace(name_of_indicator, '000 ?', '000 €');
update indicators set name_of_indicator = replace(name_of_indicator, '10 000 e', '10 000 €');
update indicators set name_of_indicator = replace(name_of_indicator, '50 000 e', '50 000 €');
update indicators set name_of_indicator = replace(name_of_indicator, '50 000 �', '50 000 €');
update indicators set name_of_indicator = replace(name_of_indicator, '< x � ', '< x ≤ ');
update indicators set name_of_indicator = replace(name_of_indicator, 'sing time is � 5 minutes', 'sing time is ≤ 5 minutes');
update indicators set name_of_indicator = replace(name_of_indicator, 'IE001 ? where', 'IE001 - where');
update indicators set name_of_indicator = replace(name_of_indicator, 'time is ? 48 hours', 'time is > 48 hours');