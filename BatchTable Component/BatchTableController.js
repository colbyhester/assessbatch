({
    DeleteIt : function (component, event, helper){
    	var Assignment = component.get("v.DeleteAssess"); 
        var action = component.get("c.deleting");
        action.setParams({
            "Assignment" : Assignment
        });
        
        action.setCallback(this, function(response){
           
           var state = response.getState();

           if (state === "SUCCESS") {
            
          
            component.set("v.DeleteAssess", Assignment);
               console.log('refresh (delete)');
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
            
            action.setParams({
                "Assignment": assignment
            });
            
            action.setCallback(this,function(savingfunction){	
                if(savingfunction.getState() === "SUCCESS"){
                 var assessment = savingfunction.getReturnValue();
                 cmp.set("v.Assessments", assessment);
        			console.log('refresh (update)');
                 helper.refreshDataTable(cmp, event, helper);
                }
            });
            $A.enqueueAction(action);
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
        let id = component.get('v.batchID');
        
        action.setParams({'batchID' : id});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.associates", response.getReturnValue());
                var sendAssociates = $A.get('e.c:sendAssociates');
                sendAssociates.setParams({"associates" : component.get('v.associates')});
                sendAssociates.fire(); 
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        $A.enqueueAction(action);
        
        
        var action2 = component.get("c.getAssessments");
        let week = component.get('v.week');
        action2.setParams({'batchID' : id, 'week':week});
        action2.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.Assessments", response.getReturnValue());
                var assessments = component.get('v.Assessments');
                console.log('Setting Grades (INIT)');
                helper.setGrades(component,assessments);
                
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        $A.enqueueAction(action2);
        
        
        var action3 = component.get("c.getBatchNote");
        week = component.get('v.week');
        let batchID = component.get('v.batchID');
        action3.setParams({'week' : week, "batchID":batchID});
        action3.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.note", response.getReturnValue());
                
            }
            else {
                console.log("Failed with state: " + state);
                
            }
        });
        
        $A.enqueueAction(action3);
        
        
        var action4 = component.get("c.getCat");
        action4.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.Category", response.getReturnValue());
            }
        });
        $A.enqueueAction(action4);
        
        
    },
    
    saveNotes : function(component, event, helper){
        var saveEvent = $A.get('e.c:saveNotes');
        saveEvent.fire();
        
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
            }
            else {
                console.log("Failed with state: " + state);
                
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
        
    },
    addHeader : function(cmp, event, helper) {
        
        
        var assessment = event.getParam("Assessment");
        var assessments = cmp.get('v.Assessments');
        var action = cmp.get('c.PointstoPercent');
        var index = cmp.get('v.index')+'';
        action.setParams({"Assessment" : assessments , "Index" : index});
        if(index<assessments.length-1){
            cmp.set('v.index',cmp.get('v.index')*1+1);
        }else{
            cmp.set('v.index','0');
        }
        console.log('index: '+cmp.get('v.index'));
        action.setCallback(this,function(response){
            
            if(response.getState()==="SUCCESS"){
        //Components needed to insert 
        var newComponents = [];
        newComponents.push(["aura:html", {
            "tag": "th",
            "HTMLAttributes": {
                
                "class" : "slds-text-title_caps",
                "scope" : "col"
            }
        }]);
        var bod = assessment.Assessment_Title__c+" - "+response.getReturnValue()+"%";
                //console.log(response.getReturnValue());
        newComponents.push(["aura:html", {
            "tag": "div",
            
            "body":  bod,
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
                                        var tdBody = td.get("v.body");
                                        tdBody.push(div);
                                        td.set("v.body", tdBody);
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
            }else{
                console.log('Failed with state: '+response.getState());
            }
        });
        $A.enqueueAction(action);
         
    },
   refresh : function(component, event, helper){
        console.log('refresh (refresh)');
        helper.refreshDataTable(component,event,helper);
    }	
})