({
    //load default data upon opening reports page
    doInitYears : function(component, event, helper){
        var actionInit = component.get("c.GetAllYearsWithBatches");
        actionInit.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.allYears", response.getReturnValue());
            }
        });
        $A.enqueueAction(actionInit);
        helper.changeBatchesForYear(component, event);
    },
    //update the year label when user chooses a year
	updateYearLabel : function(component, event, helper) {
		var menuItemLabel = event.getSource().get("v.label"); 
        component.set("v.yearLabel", menuItemLabel);
        helper.changeBatchesForYear(component);
	},
    //update the batch label when user chooses a batch
    updateBatchLabel : function(component, event, helper) {
    	var menuItemLabel = event.getSource().get("v.label"); 
        component.set("v.batchLabel", menuItemLabel);
        helper.setCurrentBatch(component, event);
	},
    //update week label when user chooses a week
    updateWeekLabel : function(component, event, helper) {
    	var menuItemLabel = event.getSource().get("v.label"); 
        component.set("v.weekLabel", menuItemLabel);
	},
    //update trainee label when user chooses a trainee
    updateTraineeLabel : function(component, event, helper) {
        helper.getSelectedTrainee(component, event);
	},
    //update trainee label for all trainees
    updateAllTraineeLabel : function(component, event, helper){
        component.set("v.currentTraineeName", "Trainee");
    },
    //update week label for all weeks
    updateAllWeeks : function(component, event, helper){
        component.set("v.weekLabel", "Week (All)");
    }
 })