@isTest
public class testInputGradeFieldController {
    //First we need to create all the test data necessary for the the following tests. Here we 
    //make use of a setup method to create everything we would need
	@testSetup
    public static void setup(){
        //For the purposes of these tests, one batch is enough to make sure everything is working
        Training__c batch = new Training__c(Caliber_Number_Of_Weeks__c = 3);
        insert batch;
        
        //Next is creating a few Trainees to query for. We make sure to insert them so we can access the
        //auto-numbered Id's that are generated upon being committed to the database
        List<Contact> trainees = new List<Contact>();
        List<Training_Assignment__c> assigns = new List<Training_Assignment__c>();
        Contact con1 = new Contact(FirstName='Colby', LastName='Hester', Email='colbyhester@testemail.com',
                                  Master_Stage__c = 'Training');
        Contact con2 = new Contact(FirstName='Eric', LastName='Marcondez', Email='eric@testemail.com',
                                  Master_Stage__c = 'Training');
        trainees.add(con1);
        trainees.add(con2);
		insert trainees;
        
        //After that, we create an assignment for them to relate them to the batch we created earlier. Same as 
        //with the trainees we created, we have to be sure to insert them as well
        for(Contact  c : trainees){
            Training_Assignment__c assignment = new Training_Assignment__c();
            assignment.Training__c = batch.Id;
            assignment.Contact__c = c.Id;
            assigns.add(assignment);
        }
        insert assigns;
    	
        //Next is creating a few generic assessments to use.It doesn't matter what the fields have in them,
        //other than associating them with the batch me made. For these, as well as the other records we create,
        //it is important that we insert them here, as we will be referencing their auto-generated Id's in 
        //several queries
        List<Caliber_Assessment__c> assessments = new List<Caliber_Assessment__c>();
        for(Integer i = 0; i < 3; i++){
            Caliber_Assessment__c a = new Caliber_Assessment__c();
            a.Training_Id__c = batch.Id;
            a.Max_Points__c = 100;
            a.Assessment_Type__c = 'Exam';
            a.Week_Number__c = 1;
            assessments.add(a);
        }
        insert assessments;
        
        //The last thing we need for these tests is a list of grades to pull from. Again, the scores don't
        //matter, as long as they are properly linked to the right trainee and assessment.
        List<Caliber_Grade__c> grades = new List<Caliber_Grade__c>();
        Caliber_grade__c g1 = new Caliber_Grade__c();
        g1.Contact__c = con1.Id;
        g1.Caliber_Assessment__c = assessments[0].Id;
        g1.Score__c = 90;
        
        Caliber_Grade__c g2 = new Caliber_Grade__c();
        g2.Contact__c = con1.Id;
        g2.Caliber_Assessment__c = assessments[1].Id;
        g2.Score__c = 88;
        grades.add(g1);
        grades.add(g2);
        
        insert grades;
    }//end of setup method
    
    //Our first test is to make sure the getGrades method pulls the correct grades
    @isTest
    public static void singlePositiveGetGrades(){
        //First we query for the batch, trainees, and one assessment we created earlier to 
        //use in the getGrades method. This is to test the first half of the method, where it pulls
        //the pre-existing grade associated with those records
        Training__c batch = [SELECT ID FROM Training__c LIMIT 1];
        Contact associate = [SELECT Id FROM Contact WHERE FirstName = 'Colby' LIMIT 1];
        Contact associate2 = [SELECT Id FROM Contact WHERE FirstName = 'Eric' LIMIT 1];
        Caliber_Assessment__c assessment = [SELECT ID FROM Caliber_Assessment__c WHERE Training_Id__c = :batch.ID LIMIT 1];
        
        //Next we call the method with parameters from the queried records from before
        Caliber_Grade__c result1 = InputGradeFieldController.getGrade(assessment.Id, associate.Id);
        
        //After that, we need to create another grade record that represents what we are expecting
        Caliber_Grade__c expected1= [SELECT Id, Score__c, Contact__c, Caliber_Assessment__c FROM Caliber_Grade__c
                                     WHERE Contact__c = :associate.Id AND Caliber_Assessment__c = :assessment.Id];
        
        //Then compare the two grades to make sure they match up
        System.assertEquals(expected1, result1);
        
        //Next we need to test the second half of the getGrades method, where there isn't a grade already
        //associated with the trainee passed into it. Here we make sure that a new grade is created and 
        //compared to what we are expecting the values to be
        Caliber_Grade__c result2 = InputGradeFieldController.getGrade(assessment.Id, associate2.Id);
        Caliber_grade__c expected2 = new Caliber_Grade__c(Score__c = 0, Contact__c = associate2.Id, 
                                                         Caliber_Assessment__c = assessment.Id);
        System.assertEquals(expected2, result2);
    }//end of singlePositiveGetGrades test method
    

    //Next we will test the saveGrade method
    @isTest
    public static void singlePositiveSaveGrade(){
        //Starting off, we must query for the correct grade to update by finding the associate that it is
        //associated with
        Contact associate = [SELECT Id FROM Contact WHERE FirstName = 'Colby' LIMIT 1];
        Caliber_Grade__c grade = [SELECT ID, Name, Score__c FROM Caliber_Grade__c WHERE Contact__c = :associate.Id LIMIT 1];
        
        
        //Then we manually change the score, and call the saveGrade method to update it within the database
        grade.Score__c = 50;
        InputGradeFieldController.saveGrade(grade);
        
        //After the score has been updated, we save the new value to use in the assertEquals method
        Decimal afterGrade = grade.Score__c;
        
        //Finally, we check the new value to be equal to the value we manually entered, which in this
        //case was 50
        System.assertEquals(50, afterGrade);
        
    }//end of singlePositiveSaveGrade test method
} 