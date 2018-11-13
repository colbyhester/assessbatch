@isTest
public class testColumnBtnController {

    @TestSetup
    static void setup(){

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
        
        List<Caliber_Category__c> cats = new List<Caliber_Category__c>();
        for(integer i = 0; i < 3; i++){
            Caliber_Category__c c = new Caliber_Category__c();
            c.Active__c = true;
            c.Name = 'Category';
            cats.add(c);
        }

        insert cats;

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
    }

    @isTest
    public static void singlePositiveGetCat(){
        List<Caliber_Category__c> expected = [SELECT Name, ID FROM Caliber_Category__c ];
        List<Caliber_Category__c> results = ColumnBtnController.getCat();

        System.assertEquals(expected, results);
    }

    @isTest
    public static void singlePositiveGetPickListValuesIntoList(){
        List<String> results = ColumnBtnController.getPickListValuesIntoList('Caliber_Assessment__c', 'Assessment_Type__c');
        List<String> expected = new List<String>();
        expected.add('Exam');
        expected.add('Verbal');
        expected.add('Project');
        expected.add('Presentation');
        expected.add('Other');

        System.assertEquals(expected, results);
    }

    @isTest
    public static void singlePositiveSaving(){
        Training__c batch = [SELECT Name, Id FROM Training__c LIMIT 1];
        Caliber_Assessment__c assessment = new Caliber_Assessment__c();
        assessment.Training_Id__c  = batch.Id;
        assessment.Max_Points__c = 100;
        assessment.Assessment_Type__c = 'Project';
        assessment.Week_Number__c = 2;
        insert assessment;

        Decimal week = assessment.Week_Number__c;

        assessment.Week_Number__c = 3;
        Caliber_Assessment__c afterUpdate = ColumnBtnController.saving(assessment);
		Decimal result = assessment.Week_Number__c;
        
        System.assertEquals((week+1), result);
        
    }

    @isTest
    public static void singlePositiveInsertGrades(){
        Caliber_Assessment__c a = [SELECT Name, Id FROM Caliber_Assessment__c LIMIT 1];
        List<Contact> trainees = [SELECT Name, Id FROM Contact];

        List<Caliber_Grade__c> expected = new List<Caliber_Grade__c>();
        for(Contact c : trainees){
            Caliber_Grade__c g = new Caliber_Grade__c();
            g.Caliber_Assessment__c = a.ID;
            g.Contact__c = c.ID;
            g.Score__c = 0;
            expected.add(g);
        }
		
        List<Caliber_Grade__c> results = ColumnBtnController.insertGrades(a, trainees);
		
        System.assertEquals(expected[0].Caliber_Assessment__c, results[0].Caliber_Assessment__c);
        System.assertEquals(expected[0].Contact__c, results[0].Contact__c);
        System.assertEquals(expected[0].Score__c, results[0].Score__c);
        
        System.assertEquals(expected[1].Caliber_Assessment__c, results[1].Caliber_Assessment__c);
        System.assertEquals(expected[1].Contact__c, results[1].Contact__c);
        System.assertEquals(expected[1].Score__c, results[1].Score__c);
    }

}