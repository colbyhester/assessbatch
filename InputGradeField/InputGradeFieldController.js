({
	doInit : function(component, event, helper) {
        

        let assess = component.get('v.assessment');
        let assoc = component.get('v.associate');
        let grades = component.get('v.grades');
        //console.log(JSON.stringify(grades));
        for(let i=0;i<grades.length;i++){

            if(grades[i].Caliber_Assessment__c==assess.Id&&grades[i].Contact__c==assoc.Id){
                component.set('v.grade', grades[i]);
                //console.log('found grade');
            }
        }
        
        
        
        /*var action = component.get("c.getGrade");
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
        $A.enqueueAction(action);*/
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