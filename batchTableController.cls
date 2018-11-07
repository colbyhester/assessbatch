public class batchTableController {

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
                System.debug('poop');
                return n;
            }
        }
        //change this later
        return [SELECT ID, Note_Content__c FROM Caliber_Note__c LIMIT 1];
    }
    
    @AuraEnabled
    public static Caliber_Note__c saveNote(Caliber_Note__c note){
        update note;
        return note;
    }
    
    
}