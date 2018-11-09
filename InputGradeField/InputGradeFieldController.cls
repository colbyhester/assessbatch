public class InputGradeFieldController {
	@AuraEnabled
    public static Caliber_Grade__c getGrade(Id assessment, Id associate){
        System.debug(assessment);
        System.debug(associate);
        
        for(Caliber_Grade__c g : [SELECT Id, Score__c, Contact__c, Caliber_Assessment__c FROM Caliber_Grade__c]){
            if(g.Contact__c == associate && g.Caliber_Assessment__c  == assessment){
                System.debug('Found it.');
                return g;
            }
        }
        
        Caliber_Grade__c g = new Caliber_Grade__c();
        g.Caliber_Assessment__c = assessment;
        g.Contact__c = associate;
        g.Score__c = 0;
        return g;
                                 
    }
    
    @AuraEnabled
    public static Caliber_Grade__c saveGrade(Caliber_Grade__c grade){
        update grade;
        return grade;
    }
}