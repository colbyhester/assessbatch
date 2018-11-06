({
    changeBatchesForYear : function(component){
        var action2 = component.get("c.getBatchesByYear");
        var yearParam = component.get("v.yearLabel");
        action2.setParams({"year" : yearParam});
        action2.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.allBatches", response.getReturnValue());
                component.set("v.currentBatch", response.getReturnValue()[0]);
                this.buildBatchStrings(component);
                this.getWeeksForBatch(component);
                this.getTraineesForBatch(component);
            }
        });
        $A.enqueueAction(action2);
    },
    
	buildBatchStrings : function(component) {
		var action3 = component.get("c.buildBatchStrings");
        var trainingsParam = component.get("v.allBatches");       
        action3.setParams({"trainings" : trainingsParam});
        action3.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.allBatchLabels", response.getReturnValue());
                component.set("v.batchLabel", response.getReturnValue()[0]);
            }
        });
        $A.enqueueAction(action3);
	},
    
    getWeeksForBatch : function(component){
    	var action4 = component.get("c.batchWeeksStrings");
        var trainingParam = component.get("v.currentBatch");       
        action4.setParams({"batch" : trainingParam});
        action4.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.allWeekLabels", response.getReturnValue());
                component.set("v.weekLabel", response.getReturnValue()[0]);
            }
        });
        $A.enqueueAction(action4);
	},
    
    getTraineesForBatch : function(component){
        var action5 = component.get("c.batchTrainees");
        var trainingParam = component.get("v.currentBatch");       
        action5.setParams({"batch" : trainingParam});
        action5.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.allTrainees", response.getReturnValue());
                component.set("v.currentTrainee", response.getReturnValue()[0]);
            }
        });
        $A.enqueueAction(action5);
    },
    
    getSelectedTrainee : function(component, event){
        var action6 = component.get("c.getSelectedTrainee");
        var trainingParam = component.get("v.allTrainees"); 
        var menuItemLabel = event.getSource().get("v.label");
        action6.setParams({"allTrainees" : trainingParam, "traineeName" : menuItemLabel});
        action6.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                component.set("v.currentTrainee", response.getReturnValue());
            }
        });
        $A.enqueueAction(action6);
    }
    
})