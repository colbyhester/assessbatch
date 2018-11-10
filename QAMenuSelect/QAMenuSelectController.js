({
    init: function (cmp,event,helper) {
        console.log('Current Training ID: '+cmp.get('v.currentTraining.Id'));
        var options = [];
        var action = cmp.get("c.GetAllYearsWithBatches");
        //Sets the selected value of currentYear attribute to the current year
        cmp.set("v.currentYear",new Date().getFullYear().toString());
        action.setCallback(this,function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                //Sets the yearOption attribute to the list returned from the Apex controller
                var arr = response.getReturnValue();
                arr.forEach(function(element){
                    options.push({value: element.toString(), label:element});
                });
                cmp.set("v.yearOptions",options);
            }
            
        });
        $A.enqueueAction(action);
        //Calls a helper to set the training combobox to the year selected
        helper.changeTrainingForYear(cmp);
        
    },
    updateYearLabel: function (cmp, event,helper) {
        //Refreshes the training list to the selected year
        helper.changeTrainingForYear(cmp);
        var yearLabel = event.getSource().get("v.value");
        console.log(event.getParam("value"));
        cmp.set("v.currentYear", yearLabel);


    },
    
    //TODO: Pass value to parent app
    updateTraining: function(cmp,event,helper){
    	var selectedOptionValue = event.getParam("value");
        alert("Option selected with value: '" + selectedOptionValue + "'");
	}
})