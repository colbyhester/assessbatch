({
    doInit : function(component, event, helper) {
        var action = component.get("c.getNote");
        //component.set("v.batchID", 'a0Df4000006RH8sEAG');
        //let id = component.get('v.batchID');
        let week = component.get('v.week');
        let ass = component.get('v.associate');
        console.log(typeof week);
        console.log(JSON.stringify(ass));
        action.setParams({'week' : week},{'associate':ass.Id});
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.note", response.getReturnValue());
                console.log(response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);/*
               var errors = response.getError();
                var message = '';
                if (errors) {
                    for(var i=0; i < errors.length; i++) {
                        for(var j=0; errors[i].pageErrors && j < errors[i].pageErrors.length; j++) {
                            message += (message.length > 0 ? '\n' : '') + errors[i].pageErrors[j].message;
                        }
                        if(errors[i].fieldErrors) {
                            for(var fieldError in errors[i].fieldErrors) {
                                var thisFieldError = errors[i].fieldErrors[fieldError];
                                for(var j=0; j < thisFieldError.length; j++) {
                                    message += (message.length > 0 ? '\n' : '') + thisFieldError[j].message;
                                }
                            }
                        }
                        if(errors[i].message) {
                            message += (message.length > 0 ? '\n' : '') + errors[i].message;
                        }
                    }
                } else {
                    message += (message.length > 0 ? '\n' : '') + 'Unknown error';
                }
                console.log(message);*/
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
    }
})