/*points to percent*/
({
	pointsToPercent : function(Assessment, Index) {
   	/*numerator */
        var TrainerPoints= Assessment[Index].Max_Points__c;
        /*total points*/
        var Pointssum=0;
        for(i=0; i<Assessment.length; i++){
            Pointssum+= Assessment[i].Max_Points__c ; 
         /*points to percentage*/
  		return (TrainerPoints/Pointssum)*100;
  }
        
    }
})
