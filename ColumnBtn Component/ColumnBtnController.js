({
    closeModal:function(component,event,helper){    
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
    },
    openmodal:function(component,event,helper) {
        var cmpTarget = component.find('Modalbox');
        var cmpBack = component.find('Modalbackdrop');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open'); 
    },
    
    //Pulls from Controller to get list of Categories to insert in module options
    doInit: function(cmp) {
        var action = cmp.get("c.getCat");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.Category", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
        
    },
    
    //What happens when a button is saved
    HandleIt : function(cmp, event, helper) {
        
       
        var allValid = cmp.find('input').reduce(function (validSoFar, inputCmp) {
            return validSoFar && !inputCmp.get('v.validity').valueMissing;
        }, true);
        if (allValid) {
            
           
			//closes modal
            var cmpTarget = cmp.find('Modalbox');
            var cmpBack = cmp.find('Modalbackdrop');
            $A.util.removeClass(cmpBack,'slds-backdrop--open');
            $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
             
            //grabs inputed values and assigns them to assessment
            var assignment = cmp.get("v.Assessment");
            var week = cmp.get("v.week");
            var batch = cmp.get("v.batchID");            
            var point = cmp.get("v.point");
            var category = cmp.get("v.cat");
            var type = cmp.get("v.type");
            
            assignment.Id = null;
            assignment.Training_Id__c = batch;
            assignment.Week_Number__c = week;
            assignment.Max_Points__c = point;
            assignment.Assessment_Category__c = category;
            assignment.Assessment_Type__c = type;
           
            //calls apex
            var saving = cmp.get("c.saving");
            
            saving.setParams({"Assignment": assignment});
            
            saving.setCallback(this,function(savingfunction){
                if(savingfunction.getState() === "SUCCESS"){
                   
                    var assessment = savingfunction.getReturnValue();
                    cmp.set('v.Assessment',assessment);
                    var associates = cmp.get('v.associates');
                    
                    //calling helper to refresh table once created
                    helper.createGrades(cmp,assessment,associates);
                    
                   
                }
            });
            $A.enqueueAction(saving);
          
        } else{ 
            alert('Please update the invalid form entries and try again.');
        }
        
    },
    weekChange : function(component,event,helper){
        var week = event.getParam("week");
        component.set('v.week',week);
        
    },
    setAssociates : function(component,event,helper){
        var associates = event.getParam("associates");
        component.set('v.associates',associates);
    }
    
})