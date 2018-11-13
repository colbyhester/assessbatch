({
	doBurrito : function(component, event, helper) {
        component.set("v.hidden", "display:none");
        component.set("v.icon", "fa fa-spinner fa-spin fa-3x");
        setTimeout(function(){
            component.set("v.color", "color:green");
            component.set("v.icon", "fa fa-check fa-3x");
            setTimeout(function(){
        	component.set("v.icon", "");
            component.set("v.hidden", "display:block");
            component.set("v.color", "color:#F26925");
        	},2000);
        },2000);   
	}
})