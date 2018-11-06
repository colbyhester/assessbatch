({
    handleActive: function (cmp, event, helper) {
        helper.handleActive(cmp, event);
    },
     addTab: function(component, event) {
         var i = component.get("v.moretabs").length;
         // i starts as the number of 'added' tabs, in order to be able to use it to create the
         // new tab labels and ids, we add 2, since it starts at 0.
         //console.log(i);
         i = i+2;  
        $A.createComponent("lightning:tab", {
            // first create the new tab with the label and id to match
            "label": "Week "+i,
            "id": "Week"+i,
            "onactive": component.getReference("c.addContent")
        }, function (newTab, status, error) {
            // add that tab!
            if (status === "SUCCESS") {
                var body = component.get("v.moretabs");
                body.push(newTab)
                component.set("v.moretabs", body);
            } else {
                throw new Error(error);
            }
        });
    },
    addContent : function(component, event) {
        var tab = event.getSource();
        // replace the bellow section with what we wish to add in the tab
      /*  switch (tab.get('v.id')){
            case 'new':
                // Display a badge in the tab content.
                // You can replace lightning:badge with a custom component.
                $A.createComponent("lightning:badge", {
                    "label": "NEW"
                }, function (newContent, status, error) {
                    if (status === "SUCCESS") {
                        tab.set('v.body', newContent);
                    } else {
                        throw new Error(error);
                    }
                });
                break;
        } */
    }
})