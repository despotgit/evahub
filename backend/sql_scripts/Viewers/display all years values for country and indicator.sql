SELECT c5.AT 
from Consolidated_CUP_Q_2015_Controls as c5 
left join Consolidated_CUP_Q_2016_Controls as c6 on c5.No_of_indicator = c6.No_of_indicator
left join Consolidated_CUP_Q_2017_Controls as c7 on c5.No_of_indicator = c7.No_of_indicator
left join Consolidated_CUP_Q_2018_Controls as c8 on c5.No_of_indicator = c8.No_of_indicator
where c5.No_of_indicator='RB1.3';