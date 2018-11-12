public class batchTableController {

    @AuraEnabled
    public static Training__c getBatch(ID batchID){
        return [SELECT Name, Caliber_Number_of_Weeks__c FROM Training__c WHERE ID=:batchID LIMIT 1];
    }
    
    @AuraEnabled
    public static Training__c incrementWeek(Training__c batch){
        batch.Caliber_Number_of_Weeks__c++;
        update batch;
        return batch;
    }
    
    
    @AuraEnabled
    public static List<Contact> getAssociates(ID batchID){
        List<Training_Assignment__c> trainAss = [SELECT ID, Contact__c FROM Training_Assignment__c WHERE Training__c=:batchID];
        List<Contact> allCons = [SELECT Name FROM Contact];
        List<Contact> batchCons = new List<Contact>();
        for(Contact c : allCons){
            for(Training_Assignment__c ta : trainAss){
                if(ta.Contact__c == c.ID){
                    batchCons.add(c);
                    break;
                }
            }
        }
        
        return batchCons;
    }
    
    @AuraEnabled
    public static Caliber_Note__c getNote(Decimal week, ID associate){
        System.debug(week);
        System.debug(associate);
        for(Caliber_Note__c n : [SELECT ID, Note_Content__c, Contact__c, Week_Number__c FROM Caliber_Note__c]){
            if(n.Week_Number__c==week&&n.Contact__c==associate){
                //System.debug('poop');
                return n;
            }
        }
        Caliber_Note__c n = new Caliber_Note__c();
        n.Contact__c=associate;
        n.Week_Number__c=week;
        n.Is_QC_Feedback__c=false;
        n.Note_Content__c='';
        n.Note_Type__c='Trainee';
        List<Contact> c = [SELECT (SELECT ID FROM Training_Assignments__r LIMIT 1) FROM Contact WHERE ID=:associate LIMIT 1];
        Training_Assignment__c trass = c[0].Training_Assignments__r[0];
        List<Training_Assignment__c> trassList = [SELECT Training__c FROM Training_Assignment__c WHERE ID=:trass.ID LIMIT 1];
        n.Training__c=trassList[0].Training__c;
        insert n;
        return n;
    }
    

    
    @AuraEnabled
    public static Caliber_Note__c saveNote(Caliber_Note__c note){
        update note;
        return note;
    }
    
    @AuraEnabled
    public static List<Caliber_Assessment__c> getAssessments(ID batchID, Integer week){
        return [SELECT Max_Points__c, Assessment_Title__c FROM Caliber_Assessment__c WHERE Week_Number__c=:week AND Training_Id__c=:batchID];
    }
    
    @AuraEnabled
    public static List<Caliber_Grade__c> getGrades(List<Caliber_Assessment__c> assessments){
        System.debug(assessments);
        List<Caliber_Grade__c> allGrades = [SELECT ID, Caliber_Assessment__c, Contact__c, Score__c FROM Caliber_Grade__c];
        List<Caliber_Grade__c> filterGrades = new List<Caliber_Grade__c>();
        for(Caliber_Grade__c g : allGrades){
            for(Caliber_Assessment__c a : assessments){
                if(g.Caliber_Assessment__c==a.ID){
                    filterGrades.add(g);
                }
            }
        }
        System.debug(filterGrades);
        return filterGrades;
    }
    
        @AuraEnabled
    public static Caliber_Note__c getBatchNote(Decimal week, ID batchID){
        System.debug(week);
        
        for(Caliber_Note__c n : [SELECT ID, Note_Content__c, Week_Number__c, Note_Type__c, Training__c FROM Caliber_Note__c]){
            if(n.Week_Number__c==week&&n.Training__c==batchID&&n.Note_Type__c=='Batch'){
                System.debug('poop');
                return n;
            }
        }
        Caliber_Note__c n = new Caliber_Note__c();
        n.Week_Number__c=week;
        n.Is_QC_Feedback__c=false;
        n.Note_Content__c='';
        n.Note_Type__c='Batch';
        n.Training__c = batchID;
        insert n;
        return n;
    }
    
    @AuraEnabled
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
    
    @AuraEnabled
    public static Decimal sectionAverage(List<Caliber_Grade__c> grades){
        /*iterate through the grades*/
        Decimal ScoreSum=0;
        for(Integer i=0; i<grades.size(); i++){
            /*creates a list of decimals; sums it up*/
               // ScoreSum += grades[i];
        ScoreSum += grades[i].Score__c;
        }/*returns the section average*/
        return(ScoreSum/grades.size());
    } 
    
    @AuraEnabled
    public static Decimal weeklyBatchAverage(List<Caliber_Assessment__c> weekAvg){
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