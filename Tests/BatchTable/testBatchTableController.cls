@isTest
public class testBatchTableController{

    //First we create a setup method to create all the test data we would need to effectively run 
    //the methods we aim to test
    @testSetup
    public static void setup(){
        //First we create a batch to link everything to, and insert it so that we can access the auto-numbered ID
        //that is created upon being committed to the database
        Training__c batch = new Training__c(Caliber_Number_Of_Weeks__c = 3);
        insert batch;
        
        //Next, we create a few trainees to associate with the batch we just created, and insert them as well
        List<Contact> trainees = new List<Contact>();
        List<Training_Assignment__c> assigns = new List<Training_Assignment__c>();
        Contact con1 = new Contact(FirstName='Colby', LastName='Hester', Email='colbyhester@testemail.com',
                                  Master_Stage__c = 'Training');
        Contact con2 = new Contact(FirstName='Eric', LastName='Marcondez', Email='eric@testemail.com',
                                  Master_Stage__c = 'Training');
        trainees.add(con1);
        trainees.add(con2);
		insert trainees;
        
        //Next we create assignments to link trainees to the batch we created
        for(Contact  c : trainees){
            Training_Assignment__c assignment = new Training_Assignment__c();
            assignment.Training__c = batch.Id;
            assignment.Contact__c = c.Id;
            assigns.add(assignment);
        }
        insert assigns;

        List<Caliber_Category__c> cats = new List<Caliber_Category__c>();
        for(integer i = 0; i < 3; i++){
            Caliber_Category__c c = new Caliber_Category__c();
            c.Active__c = true;
            c.Name = 'Category';
            cats.add(c);
        }
        insert cats;
    }
    
    //The fist method we test is the getAssociates method
    @isTest
    public static void singlePositiveGetAssociates(){
        //We start by querying for the batch we created and saving it as a new Training__c object to use
        //in this test
        Training__c batch = [SELECT Id FROM Training__c LIMIT 1];

        //Next we call the getAssociates method with that batch's Id as the parameter, and save it in a 
        //new List of Contacts 
        List<Contact> results = batchTableController.getAssociates(batch.Id);
        
        //Lastly, we assert that the results from the method match the list of trainees we created before
        System.assertEquals([SELECT Id, Name FROM Contact WHERE FirstName = 'Colby' OR FirstName = 'Eric'], results);
    }//end of singlePositivegetAssociates method


    //The next method we test is the getNote method
	@isTest
    public static void singlePositiveGetNote(){
        //We start by querying for all the data needed to call the method, which in this case is the batch and
        //one of the trainees. We then create a new Caliber_Note__c object and link it to the trainee and batch
        //that we just queried for. Lastly, we insert it as we will need it's Id to compare to the one returned
        //by the method
        Training__c batch = [SELECT Id FROM Training__c LIMIT 1];
        Contact associate = [SELECT Id, Name FROM Contact LIMIT 1];
        Caliber_Note__c note = new Caliber_Note__c(Note_Content__c = 'Hello World', Contact__c = associate.Id
                                                  , Week_Number__c = 1, Training__c = batch.Id);
        insert note;

        //We then call the getNote method and store the results into a new note to use for our assert later
        Caliber_Note__c result = batchTableController.getNote(1, associate.Id);
        
        //Last, we compare the note we made and the result of the getNote method to ensure it returned the same one
        System.assertEquals(note.Id, result.Id);
    }//end of singlePositiveGetNote test method
    

    //The next method we test is the saveNote method
    @isTest
    public static void singlePositiveSaveNote(){
        //Similarly to the previous method, we must query for relevant information that is needed to make the
        //saveNote call. In this case it is the batch and a trainee again, which we store in their respective
        //object types. We then create a new note with generic contents that is linked to the batch and trainee
        //we just created, and insert it to ensure an Id is generated for it
        Training__c batch = [SELECT Id FROM Training__c LIMIT 1];
        Contact associate = [SELECT Id, Name FROM Contact LIMIT 1];
        Caliber_Note__c note = new Caliber_Note__c(Note_Content__c = 'Hello World', Contact__c = associate.Id
                                                  , Week_Number__c = 1, Training__c = batch.Id);
        insert note;

        //Next, we manually change the contents of the note we just created
        note.Note_Content__c = 'I was changed!';

        //We then call the saveNote method to update the contents of the note to the previous value we changed it to
        batchTableController.saveNote(note);

        //Lastly, we assert that the note's contents have been updated to the new value
        System.assertEquals('I was changed!', note.Note_Content__c);
    }//end of singlePositiveSaveNote test method

    //next is the getBatch method
    @isTest
    public static void singlePositiveGetBatch(){

        //First we define a new batch to pass into the method. Since there is only one that has been created, we
        //don't worry about limiting the query to 1
        Training__c batch = [SELECT ID FROM Training__c];
        //We store the results of the method into another Training__c object to use in our assert
        Training__c result = batchTableController.getBatch(batch.Id);

        //Finally, we assert that the batch returned is the same as the one that was created. Since the method 
        //only returns the Name and Cailber_Number_Of_Weeks__c fields, those are what we query for in the 
        //"expected" parameter of the assert
        System.assertEquals([SELECT Name, Caliber_Number_of_Weeks__c FROM Training__c LIMIT 1], result);
    }//end of singlePositiveGetBatch test method

    //Next up is the incrementWeek method
    @isTest
    public static void singlePositiveIncrementWeek(){
        //First we need to define the batch we want to increment the week number of
        Training__c testBatch = [SELECT Name, Caliber_Number_of_Weeks__c FROM Training__c LIMIT 1];
        //Next we save the current number of weeks into a decimal variable to compare to later
        Decimal beforeWeeks = testBatch.Caliber_Number_of_Weeks__c;
        
        //Now we call the method on the batach we just created
        batchTableController.incrementWeek(testBatch);
        
        //After the method has completed, we save the new number of weeks into another decimal variable, which 
        //will also be used in our assert
        Decimal afterWeeks = testBatch.Caliber_Number_Of_Weeks__c;
        
        //Last, we assert that the new week value is one more than the old value
        System.assertEquals((beforeWeeks+1), afterWeeks);
    }//end of singlePositiveIncrementWeek test method
    
    //Next on the list is getAssessments
    @isTest
    public static void singlePositiveGetAssessments(){
        //first we need to define the batch that we would be getting the list of associates from
        Training__c batch = [SELECT Id, Name FROM Training__c LIMIT 1];

        //After that we define two lists of Caliber_Assessment__c records: one that is the expected results of 
        //the method, and the other being the actual results
        List<Caliber_Assessment__c> expected = [SELECT Max_Points__c, Assessment_Title__c FROM Caliber_Assessment__c WHERE Week_Number__c=1 AND Training_Id__c=:batch.Id];
        List<Caliber_Assessment__c> assessments = batchTableController.getAssessments(batch.Id, 1);
        
        //Lastly, we compare the expected values to the actual results to ensure the right assessments were 
        //returned
        System.assertEquals(expected, assessments);
    }//end of singlePositiveGetAssociates test method
    
    //The next method we will test is the getGrades method
    @isTest
    public static void singlePositiveGetGrades(){
        
        List<Caliber_Assessment__c> aList = [SELECT Id, Name FROM Caliber_Assessment__c];
        List<Caliber_Grade__c> gList = [SELECT Id, Caliber_Assessment__c, Contact__c, Score__c FROM Caliber_Grade__c];
        List<Caliber_Grade__c> filterGrades = new List<Caliber_Grade__c>();
        for(Caliber_Grade__c g : gList){
            for(Caliber_Assessment__c a : aList){
                if(g.Caliber_Assessment__c==a.ID){
                    filterGrades.add(g);
                }
            }
        }
        List<Caliber_Grade__c> results = batchTableController.getGrades(aList);
        System.assertEquals(filterGrades, results);
        
    }
    
    @isTest
    public static void singlePositiveGetBatchNote(){
        Training__c batch = [SELECT Id, Name FROM Training__c LIMIT 1];
        Caliber_Note__c batchNote = new Caliber_Note__c();
        batchNote.Week_Number__c = 1;
        batchNote.Training__c = batch.Id;
        batchNote.Note_Content__c = 'Hello World!';
        batchNote.Note_Type__c = 'Batch';
        insert batchNote;
        
        Caliber_Note__c result = batchTableController.getBatchNote(1, batch.Id);
        
        System.assertEquals(batchNote.Week_Number__c, result.Week_Number__c);
        System.assertEquals(batchNote.Training__c, result.Training__c);
        System.assertEquals(batchNote.Note_Content__c, result.Note_Content__c);
        System.assertEquals(batchNote.Note_Type__c, result.Note_Type__c);
        
        Caliber_Note__c result2 = batchTableController.getBatchNote(2, batch.ID);
        
        System.assertEquals(2, result2.Week_Number__c);
        System.assertEquals(batch.Id, result2.Training__c);
        System.assertEquals('', result2.Note_Content__c);
        System.assertEquals('Batch', result2.Note_Type__c);
        
    }
    
    @isTest
    public static void singlePositiveDeleting(){
        Integer beforeCount = [SELECT COUNT() FROM Caliber_Assessment__c];
        Caliber_Assessment__c a = [SELECT Id, Name FROM Caliber_Assessment__c LIMIT 1];
        
        batchTableController.deleting(a.Id);
        Integer afterCount = [SELECT COUNT() FROM Caliber_Assessment__c];
        
        System.assertEquals((beforeCount - 1), afterCount);
    }
    
    @isTest
    public static void singlePositiveGetCat(){
        List<Caliber_Category__c> expected = [SELECT Name, ID FROM Caliber_Category__c];
        List<Caliber_Category__c> results = batchTableController.getCat();

        System.assertEquals(expected, results);
    }
    
    @isTest
    public static void singlePositiveUpdating(){
        Caliber_Assessment__c a = [SELECT Id, Name, Max_Points__c, Assessment_Title__c  FROM Caliber_Assessment__c LIMIT 1];
        a.Max_Points__c = 30;
        
        batchTableController.updating(a);
        
        System.assertEquals(30, a.Max_Points__c);
    }
}
}