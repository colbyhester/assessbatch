({
	refreshDataTable : function(component, event, helper) {
   		 var refreshAction = component.get("c.getAssessments");
   		 refreshAction.setCallback(this, function(data) {
         	component.set("v.body", data.getReturnValue()); 
    });

    $A.enqueueAction(refreshAction);
        
       var action = component.get("c.getAssociates");
        //component.set("v.batchID", 'a0Df4000006RH8sEAG');
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
        
        var action2 = component.get("c.getAssessments");
        let week = component.get('v.week');
        action2.setParams({'batchID' : id, 'week':week});
        // Add callback behavior for when response is received
        action2.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.Assessments", response.getReturnValue());
                //console.log(response.getReturnValue());
                var assessments = component.get('v.Assessments');
                for(let i=0;i<assessments.length;i++){
                    var theEvent = $A.get("e.c:DynComp");
                    theEvent.setParams({"Assessment" : assessments[i]});
                    //console.log(assessments[i]);
                    theEvent.fire();
                }
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action2); 
}    
})