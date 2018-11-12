({
	createGrades : function(component, assessment, associates) {
        //console.log('Assessment: '+JSON.stringify(assessment));
        //console.log('Associates: '+JSON.stringify(associates));
        var action = component.get('c.insertGrades');
        action.setParams({'assessment':assessment,'associates':associates});
        action.setCallback(this, function(response){
            if(response.getState()==='SUCCESS'){
                var grades = response.getReturnValue();
                //console.log(JSON.stringify(grades));
                var theEvent = $A.get("e.c:DynComp");
        		theEvent.setParams({"Assessment" : assessment});
        		theEvent.setParams({"grades" : grades});
        		theEvent.fire(); 
            }else{
                console.log('Failed with state: '+response.getState());
            }
        });
        $A.enqueueAction(action);
        
        
	}
})