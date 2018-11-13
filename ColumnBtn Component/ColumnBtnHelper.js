({
	createGrades : function(component, assessment, associates) {
        var action = component.get('c.insertGrades');
        action.setParams({'assessment':assessment,'associates':associates});
        action.setCallback(this, function(response){
            if(response.getState()==='SUCCESS'){
                var grades = response.getReturnValue();
                var theEvent = $A.get("e.c:tableRefresh");
                theEvent.fire(); 
                
                console.log('Table Refresh Event Fired.');
            }else{
                console.log('Failed with state: '+response.getState());
            }
        });
        $A.enqueueAction(action);
        
        
	}
})