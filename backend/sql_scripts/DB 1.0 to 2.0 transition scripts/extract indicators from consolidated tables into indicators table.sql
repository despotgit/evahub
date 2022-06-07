delete from indicators where 1=1;
#and is_kpi_indicator = 0;

alter table indicators AUTO_INCREMENT = 0;

insert into indicators (no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, strategic_objective, is_kpi_indicator, extracted_from_file_type, extracted_from_file_year)
select                  no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, 'basic', 0, 'consolidated-a', year from consolidated_cup_a_basic_parameters;

insert into indicators (no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, strategic_objective, is_kpi_indicator, extracted_from_file_type, extracted_from_file_year)
select                  no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, 'protection', 0, 'consolidated-a', year from consolidated_cup_a_protection;

insert into indicators (no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, strategic_objective, is_kpi_indicator, extracted_from_file_type, extracted_from_file_year)
select                  no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, 'controls', 0, 'consolidated-a', year from consolidated_cup_a_controls;

insert into indicators (no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, strategic_objective, is_kpi_indicator, extracted_from_file_type, extracted_from_file_year)
select                  no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, 'facilitation', 0, 'consolidated-a', year from consolidated_cup_a_facilitation;

insert into indicators (no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, strategic_objective, is_kpi_indicator, extracted_from_file_type, extracted_from_file_year)
select                  no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, 'cooperation', 0, 'consolidated-a', year from consolidated_cup_a_cooperation;

insert into indicators (no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, strategic_objective, is_kpi_indicator, extracted_from_file_type, extracted_from_file_year)
select                  no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, 'basic', 0, 'consolidated-q', year from consolidated_cup_q_basic_parameters;

insert into indicators (no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, strategic_objective, is_kpi_indicator, extracted_from_file_type, extracted_from_file_year)
select                  no_of_indicator, name_of_indicator, extra_key_1, extra_key_2, extra_key_3, extra_key_4, 'controls', 0, 'consolidated-q', year from consolidated_cup_q_controls;

select * from indicators limit 10000;





