({
	doInit : function(component, event, helper) {
        var action = component.get("c.getGrade");

        let assess = component.get('v.assessment');
        let assoc = component.get('v.associate');
        //console.log(typeof week);
        //console.log(ass.Id);
        action.setParams({'assessment' : assess.Id , 'associate' : assoc.Id});
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.grade", response.getReturnValue());
                //console.log(response.getReturnValue());
                
            }
            else {
                console.log("Failed with state: " + state);

            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
    },
    
    handleBlur : function(component, event, helper){
        var action = component.get('c.saveGrade');
        var grade = component.get('v.grade');
		//console.log(grade);
        action.setParams({'grade':grade});
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.grade", response.getReturnValue());
                //console.log(response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);

            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);

    }
})