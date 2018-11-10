@isTest
public class FrontEndFunctionsTest {
    @testSetup
    static void dummyData(){
        // Create associates
        List<Contact> associates = new List<Contact>();
        for(Integer i = 0; i < 5; i++){
            Contact a = new Contact();
            a.Email = 'batch' + 'trainee' + i + '@test.com';
            a.Master_Stage__c = 'Training';
            a.FirstName = 'batch';
            a.LastName = 'trainee ' + i;
            associates.add(a);
        }
        insert associates;
        List<Contact> associate= [SELECT Id FROM Contact];
        system.debug(associate);
        //create Training_Track
        Training_Track__c track = new Training_Track__c();
        track.Active__c = true;
        track.ShortName__c = 'Salesforce';
        track.Name = 'Salesforce';
        insert track; 
        
        Date startDate = Date.parse('09/03/2018');
        Date endDate = Date.parse('11/16/2018');
        
        List<Training__c> batches = new List<Training__c>();
        for(Integer i = 0; i < 3; i++){
            Training__c batch = new Training__c();
            batch.StartDate__c = startDate.addDays(7*i);
            batch.EndDate__c = endDate.addDays(7*i);
            batch.Status__c = 'In Progress';
            batch.Trainer__c = '005f4000003dGRKAA2';
            batch.TrainingTrack__c = track.Id;
            batches.add(batch);
        }
        
        insert batches;
        
        //Create Training Assignments
        List<Training_Assignment__c> taList = new List<Training_Assignment__c>();
        for(Training__c batch : batches){
            for(Integer i = 0; i < associates.size(); i++){
                Training_Assignment__c ta = new Training_Assignment__c();
                ta.Contact__c = associates[i].Id;
                ta.Training__c = batch.Id;
                ta.Name = 'TA-' + i;
                taList.add(ta);
            }
        }
        insert taList;
        
        //create categories for assessments
        List<Caliber_Category__c> cats = new List<Caliber_Category__c>();
        List<String> catNames = new List<String>{'SF Security', 'SF Data Model', 'Sales Cloud', 'Apex', 'Visualforce'};
            for(Integer i = 0; i < 5; i++){
                Caliber_Category__c cat = new Caliber_Category__c();
                cat.Active__c = true;
                cat.Name = catNames[i];
                cats.add(cat);
            }
        insert cats;
        
        List<String> assessmentTypes = new List<String>{'Exam', 'Verbal', 'Project'};
            
            //create new assessment object
            Caliber_Assessment__c Assessment= new Caliber_Assessment__c();
        Assessment.Assessment_Category__c = cats[0].id;
        Assessment.Assessment_Type__c = 'Project';
        Assessment.Max_Points__c= 100;
        Assessment.Training_Id__c = batches[0].Id;
        Assessment.Week_Number__c = 1;
        insert Assessment;
//create a new grade object
 /* List<Caliber_Grade__c> GradesList= [SELECT Score__c FROM Caliber_Grade__c WHERE Caliber_Assessment__c =: week[1].Id];  */        
    }
    /*tests for overall*/
    static testMethod void testPointstoPercent(){
        Training__c trains= [SELECT Id FROM Training__c LIMIT 1];
        List<Caliber_Category__c> cats= [SELECT Id FROM Caliber_Category__c];      
        List<String> assessmentTypes = new List<String>{'Exam', 'Verbal', 'Project'};
       List<Caliber_Assessment__c> assessmentList = new List<Caliber_Assessment__c>();
        
        //we want to loop through 5 assignments
        for(Integer i = 0; i < 5; i++){
            Caliber_Assessment__c assessment = new Caliber_Assessment__c();
            //access fields on the new object
            assessment.Assessment_Category__c = cats[i].id;
            assessment.Assessment_Type__c = 'Project';
            assessment.Max_Points__c= null;
            assessment.Training_Id__c = trains.Id;
            assessment.Week_Number__c = i;
            AssessmentList.add(assessment);
        } 
        Assessmentlist[0].Max_Points__c=15;
        Assessmentlist[1].Max_Points__c=35;
        Assessmentlist[2].Max_Points__c=20;
        Assessmentlist[3].Max_Points__c=100;
        Assessmentlist[4].Max_Points__c=15;
        insert AssessmentList;
        
        //test data for variable points to percent
        
        //before you assert you call the function you are testing
        Decimal x= FrontEndFunctions.pointstoPercent(AssessmentList, 3);
        System.assertEquals(54, x); 
    }
    
    static testMethod void testSectionAverage(){
        Training__c trains= [SELECT Id FROM Training__c LIMIT 1];
        List<Caliber_Category__c> cats= [SELECT Id FROM Caliber_Category__c];
        List<String> assessmentTypes = new List<String>{'Exam', 'Verbal', 'Project'};
            List<Caliber_Assessment__c> assessmentList = [SELECT Id FROM Caliber_Assessment__c];
        //Create a new Associate list and query through
        List<Contact> associates= [SELECT Id FROM Contact LIMIT 5];
        //create a new grade list
        List<Caliber_Grade__c> GradesList= new List<Caliber_Grade__c>();   
        //iterate through the list of 5 grades
        for(Integer i=0; i< 5; i++){
            Caliber_Grade__c grades= new Caliber_Grade__c();
            grades.Caliber_Assessment__c= assessmentList[0].Id;
            grades.Contact__c= associates[i].Id;
            grades.Score__c= null;
            GradesList.add(grades); 
        }
        GradesList[0].Score__c=85;
        GradesList[1].Score__c=90;
        GradesList[2].Score__c=100;
        GradesList[3].Score__c=100;
        GradesList[4].Score__c=70;
        insert GradesList;
        
        //before you assert you call the function you are testing
        Decimal x= FrontEndFunctions.sectionAverage(GradesList);
        System.assertEquals(89, x);
    }
    static testMethod void testWeeklyAverage(){
        /*pull from the dummy data*/
        Training__c trains= [SELECT Id FROM Training__c LIMIT 1];
        List<Caliber_Category__c> cats= [SELECT Id FROM Caliber_Category__c];      
        List<String> assessmentTypes = new List<String>{'Exam', 'Verbal', 'Project'};
        List<Caliber_Assessment__c> assessmentList = new List<Caliber_Assessment__c>(); 
        List<Contact> associates= [SELECT Id FROM Contact LIMIT 5];
         //we want to loop through all 5 assignments of the batch
        for(Integer i = 0; i < 5; i++){
            Caliber_Assessment__c assessment = new Caliber_Assessment__c();
            //access fields on the new object
            assessment.Assessment_Category__c = cats[i].id;
            assessment.Assessment_Type__c = 'Project';
            assessment.Max_Points__c= null;
            assessment.Training_Id__c = trains.Id;
            assessment.Week_Number__c = i;
            AssessmentList.add(assessment);
        } 
        Assessmentlist[0].Max_Points__c=15;
        Assessmentlist[1].Max_Points__c=35;
        Assessmentlist[2].Max_Points__c=20;
        Assessmentlist[3].Max_Points__c=100;
        Assessmentlist[4].Max_Points__c=15;
        insert AssessmentList;
        /*create 5 grades*/
    List<Caliber_Grade__c> GradesList= new List<Caliber_Grade__c>(); 
        for(Integer i=0; i<5; i++){
        Caliber_Grade__c grade= new Caliber_Grade__c();
           grade.Caliber_Assessment__c= assessmentList[i].Id;
            grade.Contact__c= associates[i].Id;
            grade.Score__c= null;
            GradesList.add(grade); 
        }
        GradesList[0].Score__c=85;
        GradesList[1].Score__c=90;
        GradesList[2].Score__c=100;
        GradesList[3].Score__c=100;
        GradesList[4].Score__c=70;
        insert GradesList;
        
        //test data for variable points to percent
        
        //before you assert you call the function you are testing
        Decimal x= FrontEndFunctions.weeklyBatchAverage(AssessmentList);
        System.assertEquals(89, x); 
    }
}