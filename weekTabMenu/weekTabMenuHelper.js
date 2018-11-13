({
    handleActive: function (cmp, event) {
        var tab = event.getSource();
        console.log((tab));
        // When the tab becomes active, find the tab by the id and inject the corresponding content.
        // See this example for how this will need to be done. 
        var week = tab.get('v.id').split('k')[1];
        var batchID = cmp.get('v.batchID');
        this.injectComponent('c:batchTable', tab, week, batchID);
        
        var weekEvent = $A.get('e.c:weekChangeEvent');
		weekEvent.setParams({"week" : week});
        weekEvent.fire(); 
    },
    injectComponent: function (name, target,week,id) {
        // inserts the content into the tab
        $A.createComponent(name, {
            'week' : week,
            'batchID' : id
        }, function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                target.set('v.body', contentComponent);
            } else {
                throw new Error(error);
            }
        });
    },
    addTab: function(component, event) {
         // Find how many 'extra' tabs exist already, then adjust the number to
         // match what the new tab's label and Id will be
         var i = component.get("v.moretabs").length;
         i = i+2; // if there are no extra tabs, i starts at 0, so first created tab should be Week 2
        $A.createComponent("lightning:tab", {
            // first create the new tab component, give it the same format as the other tabs
            "label": "Week "+i,
            "id": "Week"+i,
            "class": "slds-m-left_large, weekly-tab",
            "onactive": component.getReference("c.handleActive")
        }, function (newTab, status, error) {
            // add that tab!
            if (status === "SUCCESS") {
                // this way, the new tab is appened to moretabs, instead of just overriding. 
                var body = component.get("v.moretabs");
                body.push(newTab)
                component.set("v.moretabs", body);
            } else {
                throw new Error(error);
            }
        });
    }
})