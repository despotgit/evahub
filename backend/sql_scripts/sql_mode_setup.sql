SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'STRICT_TRANS_TABLES',''));
SET @@sql_mode=(SELECT REPLACE(@@sql_mode,'STRICT_TRANS_TABLES',''));

SET GLOBAL sql_mode='STRICT_TRANS_TABLES';
SET sql_mode='STRICT_TRANS_TABLES';
SET @@sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

select @@sql_mode;

#call sp_calculate_iv_from_4_indicators_sum('B9','B9.1','B9.2','B9.3','B9.4',null,1);

#Error Code: 1055. Expression #4 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'cup.iv1.value' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by
