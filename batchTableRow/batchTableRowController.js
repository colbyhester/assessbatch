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

    },
    DynComp : function(cmp, event, helper) {
        
         
         //Components needed to insert 
        var newComponents = [];
        newComponents.push(["aura:html", {
            "tag": "td"
        }]);

        newComponents.push(["aura:html", {
            "tag": "div",
            "HTMLAttributes": {
                
                "class": "slds-truncate"
            }
        }]);
        var assoc = cmp.get('v.associate');
        var assess = event.getParam("Assessment");
    	newComponents.push(["c:InputGradeField",
            {
                "aura:id" : "oTextarea", 
                "assessment": assess,
                "associate": assoc
            }]);
        //console.log(newComponents[2]);
        //console.log(assess);
        //console.log(JSON.stringify(assoc));
        
       
        //Dynamic nested component
        $A.createComponents(newComponents,
        function (components, status, errorMessage) {
            if (status === "SUCCESS") {
                var pageBody = cmp.get("v.body");
                for (var i = 0; i < components.length; i += 3) {
                    var td = components[i];
                    var div = components[i + 1];
                    var ita = components[i + 2]
                    var tdBody = td.get("v.body");
                    tdBody.push(ita);
                    td.set("v.body", tdBody)
                    pageBody.push(td);
                }
                cmp.set("v.body", pageBody);
            }
            else // Report any error
            {
                console.log("Error: Failed to create list components.");
            }
        }
    );
    }
})