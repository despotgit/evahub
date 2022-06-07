select * from consolidated_cup_a_basic_parameters c join indicators i 
on (c.year = i.extracted_from_file_year and c.No_of_indicator = i.no_of_indicator);

select * from consolidated_cup_a_controls c join indicators i 
on (c.year = i.extracted_from_file_year and c.No_of_indicator = i.no_of_indicator);

select * from consolidated_cup_a_protection c join indicators i 
on (c.year = i.extracted_from_file_year and c.No_of_indicator = i.no_of_indicator);

select * from consolidated_cup_a_facilitation c join indicators i 
on (c.year = i.extracted_from_file_year and c.No_of_indicator = i.no_of_indicator);

select * from consolidated_cup_a_cooperation c join indicators i 
on (c.year = i.extracted_from_file_year and c.No_of_indicator = i.no_of_indicator);
