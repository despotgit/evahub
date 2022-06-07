drop table if exists to_delete;

/* get ids for those indicators x for which exists the same indicator y but with the value for hungary less than that of x */
create table to_delete as select id from consolidated_cup_a_basic_parameters t1 
where 1=1
and exists (select * 
            from consolidated_cup_a_basic_parameters t3 
            where t3.No_of_Indicator = t1.No_of_indicator 
            and t3.year = t1.year
            and t3.HU > t1.HU
            )
order by No_of_indicator asc, year asc;

select * from to_delete;

#delete from consolidated_cup_a_basic_parameters where id in (select id from to_delete);