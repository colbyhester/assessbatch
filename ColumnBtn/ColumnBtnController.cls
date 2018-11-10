public with sharing class ColumnBtnController {
    
    @AuraEnabled 
    public static List<Caliber_Category__c> getCat() {
        List<Caliber_Category__c> cat = [SELECT Name, ID FROM Caliber_Category__c ];
        return cat;
    }
    
    @AuraEnabled        
    public static List<String> getPickListValuesIntoList(String objectType, String selectedField){
        List<String> pickListValuesList = new List<String>();
        Schema.SObjectType convertToObj = Schema.getGlobalDescribe().get(objectType);
        Schema.DescribeSObjectResult res = convertToObj.getDescribe();
        Schema.DescribeFieldResult fieldResult = res.fields.getMap().get(selectedField).getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple){
            pickListValuesList.add(pickListVal.getLabel());
        }     
        return pickListValuesList;
    }
    
    
    @AuraEnabled
    public static Caliber_Assessment__c saving(Caliber_Assessment__c Assignment){
        System.debug(Assignment);
        upsert Assignment;
        return [SELECT Max_Points__c, Assessment_Title__c FROM Caliber_Assessment__c WHERE ID=:Assignment.ID];
    }
}