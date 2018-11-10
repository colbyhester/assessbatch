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
    

    //The last method we test is the saveNote method
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
}