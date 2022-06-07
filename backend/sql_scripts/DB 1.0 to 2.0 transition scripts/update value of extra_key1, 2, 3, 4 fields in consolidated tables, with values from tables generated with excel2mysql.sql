# BASIC PARAMETERS:
update basic_parameters_2014 b join cup.consolidated_cup_a_basic_parameters c on (c.year=2014 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update basic_parameters_2015 b join cup.consolidated_cup_a_basic_parameters c on (c.year=2015 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update basic_parameters_2016 b join cup.consolidated_cup_a_basic_parameters c on (c.year=2016 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update basic_parameters_2017 b join cup.consolidated_cup_a_basic_parameters c on (c.year=2017 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update basic_parameters_2018 b join cup.consolidated_cup_a_basic_parameters c on (c.year=2018 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

# PROTECTION:
update protection_2014 b join cup.consolidated_cup_a_protection c on (c.year=2014 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update protection_2015 b join cup.consolidated_cup_a_protection c on (c.year=2015 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update protection_2016 b join cup.consolidated_cup_a_protection c on (c.year=2016 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update protection_2017 b join cup.consolidated_cup_a_protection c on (c.year=2017 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update protection_2018 b join cup.consolidated_cup_a_protection c on (c.year=2018 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

# CONTROLS:
update controls_2014 b join cup.consolidated_cup_a_controls c on (c.year=2014 and b.f7 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4, 
    c.extra_key_4 = b.f5; # f2, f3, f4, f5 ; f7

update controls_2015 b join cup.consolidated_cup_a_controls c on (c.year=2015 and b.f7 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4, 
    c.extra_key_4 = b.f5; # f2, f3, f4, f5 ; f7

update controls_2016 b join cup.consolidated_cup_a_controls c on (c.year=2016 and b.f7 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4, 
    c.extra_key_4 = b.f5; # f2, f3, f4, f5 ; f7

update controls_2017 b join cup.consolidated_cup_a_controls c on (c.year=2017 and b.f7 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4, 
    c.extra_key_4 = b.f5; # f2, f3, f4, f5 ; f7

update controls_2018 b join cup.consolidated_cup_a_controls c on (c.year=2018 and b.f7 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4, 
    c.extra_key_4 = b.f5; # f2, f3, f4, f5 ; f7

# FACILITATION:
update facilitation_2014 b join cup.consolidated_cup_a_facilitation c on (c.year=2014 and b.f5 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3; # f2, f3 ; f5

update facilitation_2015 b join cup.consolidated_cup_a_facilitation c on (c.year=2015 and b.f5 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3; # f2, f3 ; f5

update facilitation_2016 b join cup.consolidated_cup_a_facilitation c on (c.year=2016 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update facilitation_2017 b join cup.consolidated_cup_a_facilitation c on (c.year=2017 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update facilitation_2018 b join cup.consolidated_cup_a_facilitation c on (c.year=2018 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3,
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

# COOPERATION:
update cooperation_2014 b join cup.consolidated_cup_a_cooperation c on (c.year=2014 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update cooperation_2015 b join cup.consolidated_cup_a_cooperation c on (c.year=2015 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update cooperation_2016 b join cup.consolidated_cup_a_cooperation c on (c.year=2016 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update cooperation_2017 b join cup.consolidated_cup_a_cooperation c on (c.year=2017 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

update cooperation_2018 b join cup.consolidated_cup_a_cooperation c on (c.year=2018 and b.f6 = c.No_of_indicator) 
set c.extra_key_1 = b.f2, 
    c.extra_key_2 = b.f3, 
    c.extra_key_3 = b.f4; # f2, f3, f4 ; f6

