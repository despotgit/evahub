update basic_parameters_2014 b
join cup.consolidated_cup_a_basic_parameters c on (c.year=2014 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 =  ; # f2, f3, f4 ; f6

select * from basic_parameters_2015; # f2, f3, f4 ; f6

select * from basic_parameters_2016; # f2, f3, f4 ; f6

select * from basic_parameters_2017; # f2, f3, f4 ; f6

select * from basic_parameters_2018; # f2, f3, f4 ; f6

select * from controls_2014; # f2, f3, f4, f5 ; f7

select * from controls_2015; # f2, f3, f4, f5 ; f7

select * from controls_2016; # f2, f3, f4, f5 ; f7

select * from controls_2017; # f2, f3, f4, f5 ; f7

select * from controls_2018; # f2, f3, f4, f5 ; f7

select * from cooperation_2014; # f2, f3, f4 ; f6

select * from cooperation_2015; # f2, f3, f4 ; f6

select * from cooperation_2016; # f2, f3, f4 ; f6

select * from cooperation_2017; # f2, f3, f4 ; f6

select * from cooperation_2018; # f2, f3, f4 ; f6

select * from facilitation_2014; # f2, f3 ; f5

select * from facilitation_2015; # f2, f3 ; f5

select * from facilitation_2016; # f2, f3, f4 ; f6

select * from facilitation_2017; # f2, f3, f4 ; f6

select * from facilitation_2018; # f2, f3, f4 ; f6

select * from protection_2014; # f2, f3, f4 ; f6

select * from protection_2015; # f2, f3, f4 ; f6

select * from protection_2016; # f2, f3, f4 ; f6

select * from protection_2017; # f2, f3, f4 ; f6

select * from protection_2018; # f2, f3, f4 ; f6
