({
	doInit : function(component, event, helper) {
		var action = component.get("c.getTrainees");
        action.setParams({"batch" : "v.batch"});
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state==='SUCCESS'){
                component.set("v.trainees", response.getReturnValue());
                console.log('The trainees for this batch have been retrieved.');
            }
            else{
                console.log('The doInit state was unsuccessful.');
            }
        });
        $A.enqueueAction(action);
	}
})