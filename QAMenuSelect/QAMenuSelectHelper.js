({
    changeTrainingForYear : function(cmp,event){
        var options = [];
        //Grabs all the batches for the year selected
        var action = cmp.get("c.getBatchesByYear");
        var year = cmp.get("v.currentYear");
        action.setParams({"year":year});
        action.setCallback(this, function(response){
            var state = response.getState();
            //If successful, will set the trainingList attribute
            if(state === "SUCCESS"){
                console.log(response.getReturnValue());
                cmp.set("v.trainingList",response.getReturnValue());
                cmp.set('v.currentTraining',response.getReturnValue()[0]);
                console.log(JSON.stringify(cmp.get('v.currentTraining')));
                
                var newComponents = [];
                newComponents.push(["c:ColumnBtn",
                                    {
                                        "batchID" : cmp.get('v.currentTraining.Id') 
                                        
                                    }]);
                newComponents.push(["c:weekTabMenu",
                                    {
                                        "batchID" : cmp.get('v.currentTraining.Id') 
                                        
                                    }]);
                
                
                
                
                
                
                
                //Dynamic nested component
                $A.createComponents(newComponents,
                                    function (components, status, errorMessage) {
                                        if (status === "SUCCESS") {
                                            var pageBody = cmp.get("v.body");
                                            for (var i = 0; i < components.length; i += 2) {
                                                var btn = components[i];
                                                var tabs = components[i + 1];
                                                
                                                //var tdBody = td.get("v.body");
                                                //tdBody.push(div);
                                                //td.set("v.body", tdBody)
                                                pageBody.push(btn);
                                                pageBody.push(tabs);
                                            }
                                            cmp.set("v.body", pageBody);
                                            console.log('inserted components');
                                        }
                                        else // Report any error
                                        {
                                            this.displayToast("Error", "Failed to create list components.");
                                        }
                                    });
                
                //Calls buildTrainingStrings to build the label and value for the combobox for trainings
                this.buildTrainingStrings(cmp);
            }
        });
        $A.enqueueAction(action);
    },
    
    buildTrainingStrings : function(cmp){
        var action = cmp.get("c.buildBatchStrings");
        //Grabs the list of trainers
        var trainingList = cmp.get("v.trainingList");
        var options = [];
        action.setParams({"trainings":trainingList});
        //Send the list of trainings to build the formatted list of Trainer and start date
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var allStrings = response.getReturnValue();
                var tempString =[];
                //Splits the List of Strings into a List of List of Strings
                for(var i = 0; i < allStrings.length;i++){
                    tempString.push(allStrings[i].split(","));
                    
                }
                //Sets the Combobox: Training id as the value/Formatted trainer name and training start_date as the label
                tempString.forEach(function(element){
                    options.push({value:element[0],label:element[1]});
                })
                //Sets the list of trainers and starts dates
                cmp.set("v.trainingOptions",options);
                //Sets the value for the selected training
                cmp.set("v.trainingValue",tempString[0][0]);
            }
        });
        $A.enqueueAction(action);
    }
    
})