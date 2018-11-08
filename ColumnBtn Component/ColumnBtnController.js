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
    
    doYes: function(cmp) {
        var action = cmp.get("c.getCat");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.Category", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
        
    },
    
    HandleIt : function(cmp, event, helper) {
        
        var table = document.getElementById("Colbysucks").insertCell(1);
        var tr = document.createElement('tr');
        tr.class="slds-line-height_reset";
        table.appendChild(tr);
        var id = cmp.get("v.cat");
        var id2 = cmp.get("v.type");
        var id3 = cmp.get("v.point");
        var th = document.createElement("th")
        th.class="slds-text-title_caps" ;
        th.scope="col";
        var div = document.createElement("div")
        div.class="slds-truncate" ;
        div.innerHTML = id + " " + id2 + " " + id3 + '%';
        table.appendChild(th); 
        table.appendChild(div);
              
        var theEvent = $A.get("e.c:DynComp");
    	theEvent.fire();
        
        
        
        var cmpTarget = cmp.find('Modalbox');
        var cmpBack = cmp.find('Modalbackdrop');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open'); 
        
    },
    
})