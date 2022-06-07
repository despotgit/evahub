delete from to_delete;

insert into to_delete select iv.indicator_value_id from indicators_values iv
join `CUP-tmp`.indicators_values_backup iv2 on (iv.country_code = iv2.country_code
and iv.year = iv2.year and iv.indicator_id = iv2.indicator_id) limit 100000;

delete from indicators_values where indicator_value_id in (select id_for_deletion from to_delete);

insert into indicators_values select * from `CUP-tmp`.indicators_values_backup;

select * from `CUP-tmp`.indicators_values_backup ivb 
where ivb.indicator_id not in (select indicator_id from indicators);

select * from indicators_values iv
join `CUP-tmp`.indicators_values_backup iv2 on (iv.country_code = iv2.country_code
and iv.year = iv2.year and iv.indicator_id = iv2.indicator_id)
where true limit 100000;


select * from `CUP-tmp`.indicators_values_backup limit 100000;