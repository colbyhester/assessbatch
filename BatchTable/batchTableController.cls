public class batchTableController {

    @AuraEnabled
    public static List<Contact> getAssociates(ID batchID){
        //Returns a list all associates that are within a batch, specified by the batch Id
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
        //First checks to see if a note exists for the specified associate and week, 
        //and if there is, then that is returned
        System.debug(week);
        System.debug(associate);
        for(Caliber_Note__c n : [SELECT ID, Note_Content__c, Contact__c, Week_Number__c FROM Caliber_Note__c]){
            if(n.Week_Number__c==week&&n.Contact__c==associate){
                System.debug('poop');
                return n;
            }
        }
        //If there is no existing note for the specified week and associate, then one is created
        //using the given parameters and returned
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
        //Takes the specified note, updates the contents, and returns it back to display the new message
        update note;
        return note;
    }
    
    
}