public with sharing class ColumnBtnController {
    
    @AuraEnabled 
    	public static List<Caliber_Category__c> getCat() {
         List<Caliber_Category__c> cat = [SELECT Name, ID FROM Caliber_Category__c ];
         return cat;
    }
    // Vobert's code
    
    @AuraEnabled
    public static Caliber_Assessment__c saving(Caliber_Assessment__c Assignment){
        upsert Assignment;
        return Assignment;
    }
}