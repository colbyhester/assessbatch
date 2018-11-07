/*points to percent*/
({
	pointsToPercent : function(Assessment, Index) {
   	/*grab the number of points from index*/
        var TrainerPoints= Assessment[Index].Max_Points__c;
        /*total points*/
        var Pointssum=0;
        for(i=0; i<Assessment.length; i++){
            Pointssum+= Assessment[i].Max_Points__c ; 
         /*points to percentage*/
  		return (TrainerPoints/Pointssum)*100;
  }
        
    }//end of points to percent*/
    sectionAverage : function(Score__c){
        /*iterate through the grades*/
      var ScoresSum=0;
        for(i=0; i<Score__c.length; i++){
       /*just an array of integers; sums it up*/
            ScoresSum += Score__c[i];
    }/*we want to return the average*/
    return(GradesSum/Score__c.length);
    }//end of sectionAverage

    weeklyBatchAverage: function(Score__c){
       return (this.sectionAverage/this.sectionAverage.length);
      
    }//end of weeklyAverage
})
