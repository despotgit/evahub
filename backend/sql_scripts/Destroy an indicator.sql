# DELETE BY NO_OF_INDICATOR ************************************
set @no = 'RC4.6';

delete from indicators_values where indicator_id in (
    select indicator_id from indicators where 1=1
    and no_of_indicator = @no
);

delete from indicators where no_of_indicator = @no;

# DELETE BY ID ************************************
/*
set @id = '3551';
select * from indicators_values where indicator_id in (
    select indicator_id from indicators where 1=1 
    and indicator_id = @id 
    and indicator_origin_type <> 'computed');
    
delete from indicators_values where indicator_id in (
    select indicator_id from indicators where 1=1
    and indicator_id = @id 
    and indicator_origin_type <> 'computed');
delete from indicators where indicator_id > @id and indicator_origin_type <> 'computed';
*/

# DESTROY INDICATOR(S) GREATER THAN CERTAIN VALUE ************************************
/*
set @id = '3551';
select * from indicators_values where indicator_id = @id;
delete from indicators_values where indicator_id > @id;
delete from indicators where indicator_id > @id;
*/