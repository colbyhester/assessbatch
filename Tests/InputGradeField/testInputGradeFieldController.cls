@isTest
public class testInputGradeFieldController {
	@testSetup
    public static void setup(){
        Training__c batch = new Training__c(Caliber_Number_Of_Weeks__c = 3);
        insert batch;
        
        List<Contact> trainees = new List<Contact>();
        List<Training_Assignment__c> assigns = new List<Training_Assignment__c>();
        Contact con1 = new Contact(FirstName='Colby', LastName='Hester', Email='colbyhester@testemail.com',
                                  Master_Stage__c = 'Training');
        Contact con2 = new Contact(FirstName='Eric', LastName='Marcondez', Email='eric@testemail.com',
                                  Master_Stage__c = 'Training');
        trainees.add(con1);
        trainees.add(con2);
		insert trainees;
        
        for(Contact  c : trainees){
            Training_Assignment__c assignment = new Training_Assignment__c();
            assignment.Training__c = batch.Id;
            assignment.Contact__c = c.Id;
            assigns.add(assignment);
        }
        insert assigns;
    	
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
    }
    
    @isTest
    public static void singlePositiveGetGrades(){
        Training__c batch = [SELECT ID FROM Training__c LIMIT 1];
        Contact associate = [SELECT Id FROM Contact WHERE FirstName = 'Colby' LIMIT 1];
        Contact associate2 = [SELECT Id FROM Contact WHERE FirstName = 'Eric' LIMIT 1];
        Caliber_Assessment__c assessment = [SELECT ID FROM Caliber_Assessment__c WHERE Training_Id__c = :batch.ID LIMIT 1];
        
        Caliber_Grade__c result1 = InputGradeFieldController.getGrade(assessment.Id, associate.Id);
        
        Caliber_Grade__c expected1= [SELECT Id, Score__c, Contact__c, Caliber_Assessment__c FROM Caliber_Grade__c
                                     WHERE Contact__c = :associate.Id AND Caliber_Assessment__c = :assessment.Id];
        
        System.assertEquals(expected1, result1);
        
        Caliber_Grade__c result2 = InputGradeFieldController.getGrade(assessment.Id, associate2.Id);
        Caliber_grade__c expected2 = new Caliber_Grade__c(Score__c = 0, Contact__c = associate2.Id, 
                                                         Caliber_Assessment__c = assessment.Id);
        System.assertEquals(expected2, result2);
    }
    
    @isTest
    public static void singlePositiveSaveGrade(){
        Contact associate = [SELECT Id FROM Contact WHERE FirstName = 'Colby' LIMIT 1];
        Caliber_Grade__c grade = [SELECT ID, Name, Score__c FROM Caliber_Grade__c WHERE Contact__c = :associate.Id LIMIT 1];
        Decimal beforeScore = grade.Score__c;
        
        grade.Score__c = 50;
        InputGradeFieldController.saveGrade(grade);
        
        Decimal afterGrade = grade.Score__c;
        
        System.assertEquals(50, afterGrade);
        
    }
} 