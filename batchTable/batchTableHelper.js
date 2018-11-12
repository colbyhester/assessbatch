({
	setGrades : function(component, assessments){
        var action3 = component.get("c.getGrades");
        //let assessments = component.get('v.Assessments');
        //console.log(JSON.stringify(assessments));
        action3.setParams({'assessments' : assessments});
        // Add callback behavior for when response is received
        action3.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.grades", response.getReturnValue());
                //console.log(response.getReturnValue());
                for(let i=0;i<assessments.length;i++){
                    var theEvent = $A.get("e.c:DynComp");
                    theEvent.setParams({"Assessment" : assessments[i]});
                    theEvent.setParams({"grades" : response.getReturnValue()});
                    //console.log(assessments[i]);
    				theEvent.fire();
                }
                
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action3);
    }
})