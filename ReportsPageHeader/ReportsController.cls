public class ReportsController {
    
    //return all batches starting or ending in a specific year
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
    
    //return list of years that have batches starting in them
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
    //return the number of weeks in a batch
    public static Decimal getWeeksInBatch(Training__c batch){
        return batch.Caliber_Number_of_Weeks__c;
    }
    
    //return strings for each week in a batch
    @AuraEnabled
    public static List<String> batchWeeksStrings(Training__c batch){
        Decimal weeksInBatch = ReportsController.getWeeksInBatch(batch);
        List<String> weekStrings = new List<String>();
        for (Integer i = 1; i <= (Integer)weeksInBatch; i++){
            weekStrings.add('Week ' + i);
        }
        return weekStrings;
    }
    //return all trainees in a batch
    @AuraEnabled
    public static List<Contact> batchTrainees(Training__c batch){
        List<Training_Assignment__c> assignments = [select id, Contact__c from Training_Assignment__c where training__c = :batch.id];
        List<Id> traineeContactIds = new List<Id>();
        for (Training_Assignment__c assignment : assignments){
            traineeContactIds.add(assignment.contact__c);
        }
        return [select id, name from Contact where id in :traineeContactIds];
    }
    //return the selected trainee's info
    @AuraEnabled
    public static Contact getSelectedTrainee(List<Contact> allTrainees, String traineeName){
        for (Contact trainee : allTrainees){
            if (trainee.Name == traineeName){
                return trainee;
            }
        }
        return null;
    }
    //return the batch info for selected batch
    @AuraEnabled
    public static Training__c getSelectedBatch(List<Training__c> batches, String batchName){
        for (Training__c batch : batches){
            if (batchName.contains(batch.StartDate__c.format())){
                return batch;
            }
        }
        return null;
    }
    
    @AuraEnabled
    public static String getBatchOverallCumulativeScoresBar(Id batchID){
        Map<String, Object> dataToSend = new Map<String, Object>();
        List<Id> traineeIDs = new List<Id>();
        Map<String, Object> traineeMap = null;
        List<Map<String, Object>> gradesToCalculate = new List<Map<String, Object>>();
        List<Decimal> scores = new List<Decimal>();
        List<Decimal> maxPoints = new List<Decimal>();
        String fullName;
        
        // get trainees that are a part of current batch
        for (Training_Assignment__c t : [SELECT Contact__c FROM Training_Assignment__c WHERE Training__c = : batchID]){
            traineeIDs.add(t.Contact__c);
        }
        
        // get all grades associated with each trainee
        List<Caliber_Grade__c> gradesList = [SELECT Id, Contact__c, Contact__r.FirstName, Contact__r.LastName, 
                                             Score__c, Caliber_Assessment__r.Max_Points__c 
                                             FROM Caliber_Grade__c
                                             WHERE Contact__c IN : traineeIDs];
        
        // get all scores and maxpoints for each trainee, map them and put them into a list to calculate grades
        for (Id tID : traineeIDs){
            scores.clear();
            maxPoints.clear();
            for (Caliber_Grade__c g : gradesList){
                if (g.Contact__c == tID){
                    fullName = g.Contact__r.LastName + ', ' + g.Contact__r.FirstName;
                    scores.add(g.Score__c);
                    maxPoints.add(g.Caliber_Assessment__r.Max_Points__c);
                }
            }
            traineeMap = new Map<String, Object>();
            traineeMap.put('name', fullName);
            traineeMap.put('score', scores);	
            traineeMap.put('maxPoints', maxPoints);
            gradesToCalculate.add(traineeMap);
        }
        
        
        for (Map<String, Object> m : gradesToCalculate){
            system.debug(m);
        }
        
        // calculate grades from gradesToCalculate list
        // should return List<Map<String, Object>>
        List<Map<String, Object>> data = null;
        // calculate benchmark 
        // should return single decimal 
        Decimal benchmark = 0;
        
        // add to map to return to javaScript controller
        dataToSend.put('trainee', data);
        dataToSend.put('benchmark', benchmark);
        system.debug(JSON.serialize(dataToSend));
        
        return JSON.serialize(dataToSend);
    }
    
	// tested and working.
    @AuraEnabled
    public static String getBatchOverallQCTable(Id batchID){
        Map<String, Object> dataToSend = new Map<String, Object>();
        Map<String, Object> traineeMap = null;
        List<Id> traineeIDs = new List<Id>();
        List<Map<String, Object>> traineeData = new List<Map<String, Object>>();
        String fullName;
        List<String> traineeGrades = new List<String>();
        List<String> traineeNotes = new List<String>();
        List<String> batchNotes = new List<String>();
        List<String> batchGrades = new List<String>();
        
        // find out number of weeks this batch has
        Integer numOfWeeks = (Integer)[SELECT COUNT_DISTINCT(Week_Number__c) weeks 
                                       FROM Caliber_Note__c WHERE Training__c = : batchID][0].get('weeks');
        
        // get all QC scores and feedback for batch and trainees in order by week
        List<Caliber_Note__c> qcList = [SELECT Id, Note_Content__c, Week_Number__c, QC_Status__c, Note_Type__c, Contact__c
                                        FROM Caliber_Note__c WHERE Training__c = : batchID AND Is_QC_Feedback__c = true 
                                        ORDER BY Week_Number__c ASC];
        
        // get trainees in batch
        List<Training_Assignment__c> traineeList = [SELECT Contact__c, Contact__r.FirstName, Contact__r.LastName 
                                                    FROM Training_Assignment__c WHERE Training__c = : batchID];
        
        // get trainees that are a part of current batch
        for (Training_Assignment__c t : traineeList){
            traineeIDs.add(t.Contact__c);
        }
        
        // seperate trainee notes/grades 
        for (Training_Assignment__c t : traineeList){
            traineeGrades.clear();
            traineeNotes.clear();
            for (Caliber_Note__c n : qcList){
                if (n.Contact__c == t.Contact__c && n.Note_Type__c == 'QC Trainee'){
                    traineeGrades.add(n.QC_Status__c);
                    traineeNotes.add(n.Note_Content__c);
                }
            }
            traineeMap = new Map<String, Object>();
            fullName = t.Contact__r.LastName + ', ' + t.Contact__r.FirstName;
            traineeMap.put('name', fullName);
            traineeMap.put('grades', traineeGrades);	
            traineeMap.put('notes', traineeNotes);
            traineeData.add(traineeMap);
        }
        
        // seperate batch notes/grades
        for (Caliber_Note__c n : qcList){
            if (n.Note_Type__c == 'QC Batch'){
                batchGrades.add(n.QC_Status__c);
                batchNotes.add(n.Note_Content__c);
            }
        }
        
        // add to map to return to javaScript controller
        dataToSend.put('numOfWeeks', numOfWeeks);
        dataToSend.put('trainee', traineeData);
        dataToSend.put('batchGrades', batchGrades);
        dataToSend.put('batchNotes', batchNotes);
        system.debug(JSON.serialize(dataToSend));
        
        return JSON.serialize(dataToSend);
    }
    
    @AuraEnabled
    public static String getBatchOverallTechSkillsRadar(Id batchID){
        // query caliber_grade__c > caliber_assessment__r.assessment_category__r.Name, 
        // caliber_assessment__r.max_points__c, caliber_assessment__r.training__Id__c, 
        // score__c, Contact__c
       	

        return 'todo';
    }
    @AuraEnabled
    public static Id getBatchId(Training__c batch){
        System.debug(batch);
        return batch.Id;
    }
}//end of ReportsController class