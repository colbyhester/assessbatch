({
	doInit : function(component, event, helper) {
		var action = component.get("c.getAssociates");
        console.log('handleSentId method has been called...');
        console.log('batchId is set to: '+ event.getParam("batchId"));
        component.set("v.batchID", event.getParam("batchId"));
        //component.set("v.batchID", 'a0Df4000006MZjoEAG');
        var id = component.get("v.batchID");
        console.log(id);
        action.setParams({"batchID" : id});
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.associates", response.getReturnValue());
                console.log(response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
	},
    saveNotes : function(component, event, helper){
        
    },
    
    handleSentId : function(component, event, helper){
        console.log('handleSentId method has been called...');
        component.set("v.batchId", event.getParam("batchId"));
        this.doInit(component, event, helper);
    }
})