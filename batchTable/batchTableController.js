({
	doInit : function(component, event, helper) {
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
	},
    saveNotes : function(component, event, helper){
        var saveEvent = $A.get('e.c:saveNotes');
        saveEvent.fire();

    },
    addHeader : function(cmp, event, helper) {
        
        var assessment = event.getParam("Assessment");
        //console.log('Assessment: '+JSON.stringify(assessment));
         //Components needed to insert 
        var newComponents = [];
        newComponents.push(["aura:html", {
            "tag": "th",
            "HTMLAttributes": {
                
                "class" : "slds-text-title_caps",
                "scope" : "col"
            }
        }]);

        newComponents.push(["aura:html", {
            "tag": "div",
            "body": assessment.Assessment_Title__c,
            "HTMLAttributes": {
                
                "class": "slds-truncate"
            }
        }]);
        
    	
        
       
        //Dynamic nested component
        $A.createComponents(newComponents,
        function (components, status, errorMessage) {
            if (status === "SUCCESS") {
                var pageBody = cmp.get("v.body");
                for (var i = 0; i < components.length; i += 2) {
                    var td = components[i];
                    var div = components[i + 1];
                    //var ita = components[i + 2]
                    var tdBody = td.get("v.body");
                    tdBody.push(div);
                    td.set("v.body", tdBody)
                    pageBody.push(td);
                }
                cmp.set("v.body", pageBody);
            }
            else // Report any error
            {
                this.displayToast("Error", "Failed to create list components.");
            }
        }
    );
    }
})