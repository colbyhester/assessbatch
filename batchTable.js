({
    DeleteIt : function (component, event, helper){
    	var Assignment = component.get("v.DeleteAssess"); 
        //console.log(Assignment);
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
            //var tableRefresh = $A.get('e.c:tableRefresh');
        			//tableRefresh.fire();
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
            
           //console.log('@@@@' + JSON.stringify(assignment));
            
            
            action.setParams({
                "Assignment": assignment
            });
            
            action.setCallback(this,function(savingfunction){	
                if(savingfunction.getState() === "SUCCESS"){
                 var assessment = savingfunction.getReturnValue();
                 cmp.set("v.Assessments", assessment);
                    //var tableRefresh = $A.get('e.c:tableRefresh');
        			//tableRefresh.fire();
        			console.log('refresh (update)');
                 helper.refreshDataTable(cmp, event, helper);
                }
            });
            $A.enqueueAction(action);
            //console.log(action);
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
                var sendAssociates = $A.get('e.c:sendAssociates');
                sendAssociates.setParams({"associates" : component.get('v.associates')});
                sendAssociates.fire(); 
                
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
                console.log('Setting Grades (INIT)');
                helper.setGrades(component,assessments);
                //console.log('Set grades to: '+JSON.stringify(component.get('v.grades')));
                
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action2);
        
        var action3 = component.get("c.getBatchNote");
        
        week = component.get('v.week');
        let batchID = component.get('v.batchID');
        //let ass = component.get('v.associate');
        //console.log(typeof week);
        //console.log(ass.Id);
        action3.setParams({'week' : week, "batchID":batchID});
        // Add callback behavior for when response is received
        action3.setCallback(this, function(response) {
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
                //console.log(response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
                
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
        
    },
    addHeader : function(cmp, event, helper) {
        
        //helper.refreshDataTable(cmp,event,helper);
        
        var assessment = event.getParam("Assessment");
        var assessments = cmp.get('v.Assessments');
        //console.log(JSON.stringify(assessments));
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
        //console.log('Assessment: '+JSON.stringify(assessment));
        //Components needed to insert 
        var newComponents = [];
        newComponents.push(["aura:html", {
            "tag": "th",
            "HTMLAttributes": {
                "class" : "slds-text-title_caps col-sm-1 col-md-1 col-lg-1"	
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
                "class": "col-sm-1 col-md-1 col-lg-1 assessment-title"
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