({
    doInit : function(component, event, helper) {
        var action = component.get("c.getNote");

        let week = component.get('v.week');
        let ass = component.get('v.associate');
        //console.log(typeof week);
        //console.log(ass.Id);
        action.setParams({'week' : week , 'associate' : ass.Id});
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.note", response.getReturnValue());
                //console.log(response.getReturnValue());
                
            }
            else {
                console.log("Failed with state: " + state);

            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
    },
    
    handleSave : function(component, event, helper){
        var action = component.get('c.saveNote');
        var note = component.get('v.note');
		//console.log(note);
        action.setParams({'note':note});
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.note", response.getReturnValue());
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