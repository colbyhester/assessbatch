({
    DeleteIt : function (component, event, helper){
    	var Assignment = component.get("v.DeleteAssess"); 
        console.log(Assignment);
        var action = component.get("c.deleting");
        action.setParams({
            "Assignment" : Assignment
        });
        
        action.setCallback(this, function(response){
           
           var state = response.getState();

           if (state === "SUCCESS") {
            
          
            component.set("v.DeleteAssess", Assignment);
            helper.refreshDataTable(component, event, helper);
        }
    });
    $A.enqueueAction(action);
    
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
        
   
    },
    
    UpdateIt:function(cmp, event, helper){
          
        var allValid = cmp.find('input').reduce(function (validSoFar, inputCmp) {
            return validSoFar && !inputCmp.get('v.validity').valueMissing;
        }, true);
        if (allValid) {
            
            
            var cmpTarget = cmp.find('Modalbox');
            var cmpBack = cmp.find('Modalbackdrop');
            $A.util.removeClass(cmpBack,'slds-backdrop--open');
            $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
            
            
            var cmpTarget = cmp.find('Modalbox');
            var cmpBack = cmp.find('Modalbackdrop');
            $A.util.removeClass(cmpBack,'slds-backdrop--open');
            $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
            
            
            
            var assignment = cmp.get("v.Assessments2");
            var week = cmp.get("v.week");
            var batch = cmp.get("v.batchID");
            var action = cmp.get("c.updating");
            var point = cmp.get("v.point");
            var category = cmp.get("v.cat");
            var type = cmp.get("v.type");
            
            
            assignment.Id = cmp.get("v.DeleteAssess"); 
            assignment.Training_Id__c = batch;
            assignment.Week_Number__c = week;
            assignment.Max_Points__c = point;
            assignment.Assessment_Category__c = category;
            assignment.Assessment_Type__c = type;
            
           console.log('@@@@' + JSON.stringify(assignment));
            
            
            action.setParams({
                "Assignment": assignment
            });
            
            action.setCallback(this,function(savingfunction){	
                if(savingfunction.getState() === "SUCCESS"){
                 var assessment = savingfunction.getReturnValue();
                 cmp.set("v.Assessments", assessment);
                 helper.refreshDataTable(cmp, event, helper);
                }
            });
            $A.enqueueAction(action);
            console.log(action);
        } else{ 
            alert('Please update the invalid form entries and try again.');
        }
    },
    
    closeModal:function(component,event,helper){    
        
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
    },
    
    openmodal:function(component,event,helper) {
        
        var myElement = event.srcElement;
		     
        component.set('v.AssessTitle', myElement.innerText);
        component.set('v.DeleteAssess', myElement.id);
        
        console.log(component.get('v.DeleteAssess'));
        
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open'); 
    },
    
     weekChange : function(component,event,helper){
        var week = event.getParam("week");
        component.set('v.week',week);
        
    },
    
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

	 	var action3 = component.get("c.getCat");
        action3.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.Category", response.getReturnValue());
            }
        });
        $A.enqueueAction(action3);


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
               
                "onclick" : cmp.getReference("c.openmodal"),	
                "id" : assessment.Id,
                
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
                                   
                                }
                            }
                           );
    }
})