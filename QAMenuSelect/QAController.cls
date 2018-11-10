public class QAController {
    
    @AuraEnabled
    //Builds a list of all the training sObjects with a start date equal with the year parameter passed in.
    public static List<Training__c> getBatchesByYear(Decimal year){
        //Creates Dates for the SOQL clause. One for the beginning and one for the end.
        Date startOfYear = date.newInstance((Integer)year, 1, 1);
        Date endOfYear = date.newInstance((Integer)year, 12, 31);
        //Queries the training list for the year parameter.
        List<Training__c> batchList =  [SELECT Id, Trainer__c, TrainingTrack__c, startDate__c, Caliber_Number_of_Weeks__c
                                        FROM Training__c
                                        WHERE (startDate__c >= : startOfYear AND startDate__c <= : endOfYear) 
                                        OR (endDate__c >= : startOfYear AND endDate__c <= : endOfYear)];
        return batchList;
    }

    @AuraEnabled
    //Creates the list with all years currently inside database.
    public static List<Integer> GetAllYearsWithBatches(){
        List<AggregateResult> trainings = [select count(Id), CALENDAR_YEAR(StartDate__c) from Training__c group by CALENDAR_YEAR(StartDate__c) ORDER BY CALENDAR_YEAR(StartDate__c) DESC];
        List<Integer> years = new List<Integer>();
        //Grabs year from aggregateResult returned from the query.
        for (AggregateResult ar : trainings){
            years.add((Integer)ar.get('expr1'));
        }
        return years;
    }
    
    //build a list of strings for all batches in year.
    @AuraEnabled
    public static List<String> buildBatchStrings(List<Training__c> trainings){
        List<String> batchStrings = new List<String>();
        //Puts all trainer ids from the training sObject into a list.
        List<Id> trainerIds = new List<Id>();
        for (Training__c training : trainings){
            trainerIds.add(training.Trainer__c);
        }
        //Queries all users with the id equal to training id.
        List<User> userTrainers = [select id, name from User where id in :trainerIds];
        
        //Creates the list with formatted string with the training id, trainer name, and training start date concatenated into one.
        //Will be split inside JavaScript controller.
        for (Training__c training : trainings){
            for (User trainer : userTrainers){
                if (trainer.id == training.Trainer__c){
            		String tString = training.id + ',' + trainer.Name + ' ' + training.startDate__c.format();
                    batchStrings.add(tString);
                }
            }
        }
        return batchStrings;
        
    }
}//end of ReportsController class