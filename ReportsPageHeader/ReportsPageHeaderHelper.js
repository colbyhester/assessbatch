({
    //updates the batches for a year when a new year is chosen
    //defaults to all weeks and all trainees for first batch
    changeBatchesForYear : function(component, event){
        var actionChangeBatches = component.get("c.getBatchesByYear");
        var yearParam = component.get("v.yearLabel");
        actionChangeBatches.setParams({"year" : yearParam});
        actionChangeBatches.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                //set batch attributes in component
                component.set("v.allBatches", response.getReturnValue());
                component.set("v.currentBatch", response.getReturnValue()[0]);
                this.buildBatchStrings(component);
                this.getWeeksForBatch(component);
                this.getTraineesForBatch(component);
            }
        });
        $A.enqueueAction(actionChangeBatches);
    },
    //build strings for the batches to represent them in UI
	buildBatchStrings : function(component) {
		var actionBuildBatchString = component.get("c.buildBatchStrings");
        var trainingsParam = component.get("v.allBatches");       
        actionBuildBatchString.setParams({"trainings" : trainingsParam});
        actionBuildBatchString.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.allBatchLabels", response.getReturnValue());
                component.set("v.batchLabel", response.getReturnValue()[0]);
                
            }
        });
        $A.enqueueAction(actionBuildBatchString);
	},
    //get all available weeks for selected batch
    //default to all weeks
    getWeeksForBatch : function(component){
    	var actionGetBatchWeeks = component.get("c.batchWeeksStrings");
        var trainingParam = component.get("v.currentBatch");       
        actionGetBatchWeeks.setParams({"batch" : trainingParam});
        actionGetBatchWeeks.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.allWeekLabels", response.getReturnValue());
                component.set("v.weekLabel", "Week (All)");
            }
        });
        $A.enqueueAction(actionGetBatchWeeks);
	},
    //get all trainees for selected batch
    //default to all trainees
    getTraineesForBatch : function(component){
        var actionGetBatchTrainees = component.get("c.batchTrainees");
        var trainingParam = component.get("v.currentBatch");       
        actionGetBatchTrainees.setParams({"batch" : trainingParam});
        actionGetBatchTrainees.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.allTrainees", response.getReturnValue());
                component.set("v.currentTraineeName", "Trainee")
                this.setBatchId(component, event);
            }
        });
        $A.enqueueAction(actionGetBatchTrainees);
        
    },
    //pull data for trainee selected from UI
    getSelectedTrainee : function(component, event){
        var actionGetTrainee = component.get("c.getSelectedTrainee");
        var trainingParam = component.get("v.allTrainees"); 
        var menuItemLabel = event.getSource().get("v.label");
        actionGetTrainee.setParams({"allTrainees" : trainingParam, "traineeName" : menuItemLabel});
        actionGetTrainee.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.currentTrainee", response.getReturnValue());
                component.set("v.currentTraineeName", response.getReturnValue().Name);
            }
        });
        $A.enqueueAction(actionGetTrainee);
    },
    //set the newly chosen batch and get the weeks and trainees associated with it
    setCurrentBatch : function(component, event){
        var actionSetBatch = component.get("c.getSelectedBatch")
        var currentBatchLabel = component.get("v.batchLabel");
        var allBatches = component.get("v.allBatches");
        actionSetBatch.setParams({"batches" : allBatches, "batchName" : currentBatchLabel});
        actionSetBatch.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.currentBatch", response.getReturnValue());
                console.log(response.getReturnValue());
                this.getWeeksForBatch(component);
        		this.getTraineesForBatch(component);
                this.setBatchId(component, event);
            }
        });
        $A.enqueueAction(actionSetBatch);
    },
    //set the batchId to that of the current Batch
    setBatchId : function(component, event){
        var getId = component.get("c.getBatchId");
        var batch = component.get("v.currentBatch");
        console.log(batch);
        getId.setParams({"batch" : batch});
        getId.setCallback(this, function(response){
            var state = response.getState();
            console.log(state);
            if(state==='SUCCESS'){
                component.set("v.batchId", response.getReturnValue());
                var event = $A.get('e.c:sendBatchId');
        		event.setParams({"batchId" : component.get("v.batchId")});
       		 	event.fire();
        		console.log('SendBatchId event has been fired...');
                
            }
            else{
                console.log('The state was unsuccessful: '+state);
            }
        });
        $A.enqueueAction(getId);
        
    }
})