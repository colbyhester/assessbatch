({
    //todo: update all batches based on year, all weeks based on batch
    //all trainees based on batch
    
    //todo: split doInitYears into multiple init functions?
    //initialize years, batches, weeks, and trainees
    doInitYears : function(component, event, helper){
        var action = component.get("c.GetAllYearsWithBatches");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.allYears", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
        
        helper.changeBatchesForYear(component);
    },
    
	updateYearLabel : function(component, event, helper) {
		var menuItemLabel = event.getSource().get("v.label"); 
        component.set("v.yearLabel", menuItemLabel);
        helper.changeBatchesForYear(component);
	},
    
    updateBatchLabel : function(component, event, helper) {
    	var menuItemLabel = event.getSource().get("v.label"); 
        component.set("v.batchLabel", menuItemLabel);
	},
    
    updateWeekLabel : function(component, event, helper) {
    	var menuItemLabel = event.getSource().get("v.label"); 
        component.set("v.weekLabel", menuItemLabel);
	},
    
    updateTraineeLabel : function(component, event, helper) {
        helper.getSelectedTrainee(component, event);
	}
 })