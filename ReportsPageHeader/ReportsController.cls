public class ReportsController {
	
    @AuraEnabled
    public static Map<Id, Decimal> getCumulativeScore(Integer year, ID batchID, Integer week, ID traineeID){
        List<Caliber_Grade__c> gradeList = getBatchGradesByWeek(batchID, week);
        
        // Calculate method will return a map of Contact ID and Avg week grade 
        Map<Id, Decimal> grades = new Map<Id, Decimal>();
        return grades;
        
    }//end of getCumulativeScore()
    
    @AuraEnabled
    public static List<Training__c> getBatchesByYear(Decimal year){
        Date startOfYear = date.newInstance((Integer)year, 1, 1);
        Date endOfYear = date.newInstance((Integer)year, 12, 31);
        List<Training__c> batchList =  [SELECT Id, Trainer__c, TrainingTrack__c, startDate__c, Caliber_Number_of_Weeks__c
                                        FROM Training__c
                                        WHERE (startDate__c >= : startOfYear AND startDate__c <= : endOfYear) 
                                        OR (endDate__c >= : startOfYear AND endDate__c <= : endOfYear)];
        return batchList;
    }

    @AuraEnabled
    public static List<Caliber_Grade__c> getBatchGradesByWeek(ID batchID, Integer week){
        List<Caliber_Assessment__c> assessmentList = [SELECT Id
                                                      FROM Caliber_Assessment__c WHERE Training_Id__c = : batchID];
        List<Caliber_Grade__c> gList = [SELECT Id, Name, Contact__c, Score__c 
                                        FROM Caliber_Grade__c
                                        WHERE Caliber_Assessment__c IN : assessmentList];
        return gList;
    }
    
    @AuraEnabled
    public static List<Integer> GetAllYearsWithBatches(){
        List<AggregateResult> trainings = [select count(Id), CALENDAR_YEAR(StartDate__c) from Training__c group by CALENDAR_YEAR(StartDate__c)];
        List<Integer> years = new List<Integer>();
        for (AggregateResult ar : trainings){
            years.add((Integer)ar.get('expr1'));
        }
        return years;
    }
    
    //build a list of strings for all batches in year
    @AuraEnabled
    public static List<String> buildBatchStrings(List<Training__c> trainings){
        List<String> batchStrings = new List<String>();
        List<Id> trainerIds = new List<Id>();
        for (Training__c training : trainings){
            trainerIds.add(training.Trainer__c);
        }
        List<User> userTrainers = [select id, name from User where id in :trainerIds];
        for (Training__c training : trainings){
            for (User trainer : userTrainers){
                if (trainer.id == training.Trainer__c){
            		String tString = trainer.Name + ' ' + training.startDate__c.format();
            		batchStrings.add(tString);
                }
            }
        }
        return batchStrings;
    }
    
    public static Decimal getWeeksInBatch(Training__c batch){
        return batch.Caliber_Number_of_Weeks__c;
    }
    
    @AuraEnabled
    public static List<String> batchWeeksStrings(Training__c batch){
        Decimal weeksInBatch = ReportsController.getWeeksInBatch(batch);
        List<String> weekStrings = new List<String>();
        for (Integer i = 1; i <= (Integer)weeksInBatch; i++){
            weekStrings.add('Week ' + i);
        }
        if (weeksInBatch == 0){
            weekStrings.add('No Weeks');
        }
        return weekStrings;
    }
    
    @AuraEnabled
    public static List<Contact> batchTrainees(Training__c batch){
        List<Training_Assignment__c> assignments = [select id, Contact__c from Training_Assignment__c where training__c = :batch.id];
        List<Id> traineeContactIds = new List<Id>();
        for (Training_Assignment__c assignment : assignments){
            traineeContactIds.add(assignment.contact__c);
        }
        return [select id, name from Contact where id in :traineeContactIds];
    }
    
    @AuraEnabled
    public static Contact getSelectedTrainee(List<Contact> allTrainees, String traineeName){
        for (Contact trainee : allTrainees){
            if (trainee.Name == traineeName){
                return trainee;
            }
        }
        return null;
    }
    
}//end of ReportsController class