public class TraineeRowController {
	@AuraEnabled
    public static List<Contact> getTrainees(Training__c batch){
        List<Contact> trainees = [SELECT Name, ID FROM Contact WHERE PreTraining__c = :batch.Id];
        return trainees;
    }
}