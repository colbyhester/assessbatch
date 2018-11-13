({
    setGrades : function(component, assessments){
        var action3 = component.get("c.getGrades");
        //let assessments = component.get('v.Assessments');
        //console.log(JSON.stringify(assessments));
        action3.setParams({'assessments' : assessments});
        // Add callback behavior for when response is received
        action3.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.grades", response.getReturnValue());
                //console.log(response.getReturnValue());
                //
                //
                
                for(let i=0;i<assessments.length;i++){
                    
                    var action4 = component.get("c.sectionAverage");
                    action4.setParams({"grades" : response.getReturnValue(), "assessment" : assessments[i].Id});
                    action4.setCallback(this, function(response){
                        if(response.getState()==="SUCCESS"){
                            var avg = component.get('v.averages');
                            avg.push(response.getReturnValue());
                            component.set('v.averages',avg);
                        }else{
                            console.log('Failed with state: '+response.getState());
                        }
                    });
                    $A.enqueueAction(action4);
                    
                    var theEvent = $A.get("e.c:DynComp");
                    theEvent.setParams({"Assessment" : assessments[i]});
                    theEvent.setParams({"grades" : response.getReturnValue()});
                    //console.log(assessments[i]);
                    theEvent.fire();
                }
                
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action3);
        
        var action5 = component.get('c.weeklyBatchAverage');
        action5.setParams({'weekAvg' : assessments});
        action5.setCallback(this, function(response){
            if(response.getState()==='SUCCESS'){
                component.set('v.totalAvg',response.getReturnValue());
            }else{
                console.log('Failed with state: '+response.getState());
            }
        });
        $A.enqueueAction(action5);
    },
    refreshDataTable : function(component, event, helper) {
        component.set('v.body','');
        
        //console.log(JSON.stringify(component.get('v.averages')));
        var empty = [];
        component.set('v.averages', empty);
        /*var refreshAction = component.get("c.getAssessments");
        refreshAction.setCallback(this, function(data) {
            component.set("v.body", data.getReturnValue()); 
        });
        
        $A.enqueueAction(refreshAction);*/
        
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
                console.log('Setting Grades (refresh)');
                helper.setGrades(component,assessments);
                //console.log('Set grades to: '+JSON.stringify(component.get('v.grades')));
                
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
        
        var action4 = component.get("c.getBatchNote");
        
        week = component.get('v.week');
        let batchID = component.get('v.batchID');
        //let ass = component.get('v.associate');
        //console.log(typeof week);
        //console.log(ass.Id);
        action4.setParams({'week' : week, "batchID":batchID});
        // Add callback behavior for when response is received
        action4.setCallback(this, function(response) {
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
        $A.enqueueAction(action4);
    }
})