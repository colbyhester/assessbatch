({
	doInit : function(component, event, helper) {
		var action = component.get("c.getAssociates");
        component.set("v.batchID", 'a0Df4000006RH8sEAG');
        let id = component.get('v.batchID');
        action.setParams({'batchID' : id});
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.associates", response.getReturnValue());
                //console.log(response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
	},
    saveNotes : function(component, event, helper){
        
    }
})