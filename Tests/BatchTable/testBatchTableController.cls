@isTest
public class testBatchTableController{

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
    }
    
    @isTest
    public static void singlePositiveGetAssociates(){
        Training__c batch = [SELECT Id FROM Training__c LIMIT 1];
        List<Contact> results = batchTableController.getAssociates(batch.Id);
        

        System.assertEquals([SELECT Id, Name FROM Contact WHERE FirstName = 'Colby' OR FirstName = 'Eric'], results);
    }

	@isTest
    public static void singlePositiveGetNote(){
        Training__c batch = [SELECT Id FROM Training__c LIMIT 1];
        Contact associate = [SELECT Id, Name FROM Contact LIMIT 1];
        Caliber_Note__c note = new Caliber_Note__c(Note_Content__c = 'Hello World', Contact__c = associate.Id
                                                  , Week_Number__c = 1, Training__c = batch.Id);
        insert note;
        Caliber_Note__c result = batchTableController.getNote(1, associate.Id);
        
        System.assertEquals(note.Id, result.Id);
    }
    
    @isTest
    public static void singlePositiveSaveNote(){
        Training__c batch = [SELECT Id FROM Training__c LIMIT 1];
        Contact associate = [SELECT Id, Name FROM Contact LIMIT 1];
        Caliber_Note__c note = new Caliber_Note__c(Note_Content__c = 'Hello World', Contact__c = associate.Id
                                                  , Week_Number__c = 1, Training__c = batch.Id);
        insert note;
        note.Note_Content__c = 'I was changed!';
        batchTableController.saveNote(note);
        System.assertEquals('I was changed!', note.Note_Content__c);
    }
}