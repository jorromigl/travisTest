({
    initFinOpEventListener : function(component, event, helper) {
        window.addEventListener('message', function (evt) {
            if (evt.data) {
                var data = JSON.parse(evt.data);
                if (data &&
                    data.body &&
                    data.body.event &&
                    data.body.event.name === 'bnk.finalizaroperativa') {
                    var closeTabEvent = component.getEvent("closeTab");
                    closeTabEvent.fire();
                }
            }
        }, false);
    },
    createParameters : function(component, event, helper) {
        var params = component.get("v.data").parameters;
        var stringParams = JSON.stringify(params); 
        component.set("v.parameters", stringParams);
    },
})