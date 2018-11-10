public class InputGradeFieldController {
    //This class is used by the InputGradeField component in order to both get all the grades needed, as well
    //as save them to the database when they are updated

    //The first method is used to get a Caliber_Grade__c record associated with a given associate and assessment
	@AuraEnabled
    public static Caliber_Grade__c getGrade(Id assessment, Id associate){
        System.debug(assessment);
        System.debug(associate);
        
        //First we run a for loop that cycles through all the grades currently saved in the database
        for(Caliber_Grade__c g : [SELECT Id, Score__c, Contact__c, Caliber_Assessment__c FROM Caliber_Grade__c]){
            //Next we check each grade to see if it is associated with the trainee and assessment we are
            //interested in
            if(g.Contact__c == associate && g.Caliber_Assessment__c  == assessment){
                //If the grade does match this criteria, then it is returned
                System.debug('Found it.');
                return g;
            }
        }
        
        //If none of the grades in the database match the if statement from before, we create one for the specified
        //associate and assessment that is initialized with no contents. This way, even if the trainer hasn't 
        //entered a grade yet, there will still be a grade field visible for them to edit within the component
        Caliber_Grade__c g = new Caliber_Grade__c();
        g.Caliber_Assessment__c = assessment;
        g.Contact__c = associate;
        g.Score__c = 0;
        return g;
                                 
    }//end of getGrade method
    
    //The next method is used to update and return the contents of a specified Caliber_Grade__c record so that
    //the component can display the new contents in each grade field
    @AuraEnabled
    public static Caliber_Grade__c saveGrade(Caliber_Grade__c grade){
        update grade;
        return grade;
    }
}