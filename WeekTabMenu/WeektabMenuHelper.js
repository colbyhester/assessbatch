({
    handleActive: function (cmp, event) {
        var tab = event.getSource();
        switch (tab.get('v.id')) {
            case 'badge' :
                //this.injectComponent('lightningcomponentdemo:exampleBadge', tab);
                break;
            case 'buttons' :
                //this.injectComponent('lightningcomponentdemo:exampleRegularButtons', tab);
                break;
            case 'icons':
                //this.injectComponent('lightningcomponentdemo:exampleIcon', tab);
                break;
            case 'inputs':
                //this.injectComponent('lightningcomponentdemo:exampleInputValidation', tab);
                break;
        }
    },
    injectComponent: function (name, target) {
        $A.createComponent(name, {
            // no attrs
        }, function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                target.set('v.body', contentComponent);
            } else {
                throw new Error(error);
            }
        });
    }
})