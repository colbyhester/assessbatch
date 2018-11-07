public class FrontEndFunctions {

    public static Decimal PointstoPercent(List<Caliber_Assessment__c> Assessment, Integer Index){
        /*grab the number of points from index where we are accessing the trainer (max_Points__c)*/
   Decimal TrainerPoints= Assessment[Index].Max_Points__c;
        /*calculate the total points*/
    Decimal PointSum= 0;
    for(Integer i=0; i<Assessment.size(); i++){
       /*if i is less then the total number of assessments we want to add to pointsum*/
         PointSum += Assessment[i].Max_Points__c;
       /*calculate points to percentage*/   
        }
       return (TrainerPoints/PointSum)*100; 
    }
    public Decimal sectionAverage(List<Caliber_Grade__c> grades){
        /*iterate through the grades*/
        Decimal ScoreSum=0;
        for(Integer i=0; i<grades.size(); i++){
            /*creates a list of decimals; sums it up*/
               // ScoreSum += grades[i];
        ScoreSum += grades[i].Score__c;
        }/*returns the section average*/
        return(ScoreSum/grades.size());
    } 
    public Decimal weeklyBatchAverage(List<Caliber_Assessment__c> weekAvg){
      /*this method uses the sectionaverage and divides by those sizes*/
        Decimal totalAverage=0;
        for(Integer i=0; i<weekAvg.size(); i++){
            /*we want to create a list of grades where we select the score from the caliber grades object
             * and where the caliber assessment object is we want it to be our weekAvg[i]*/
            list<Caliber_Grade__c> grade= [SELECT Score__c FROM Caliber_Grade__c WHERE Caliber_Assessment__c=: weekAvg[i].Id];
            /*we want the total average to sum up to the list of grade*/
            totalAverage += sectionAverage(grade);
        }
        return (totalAverage/weekAvg.size());
    }
}