({
    openSubTab : function(component, event, helper) {
        var id = component.get("v.alerta").Id;
        console.log('get alerta id');
        console.log(id);
        var idPadre = component.get("v.padre");
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openSubtab({
            parentTabId: idPadre,
            recordId: id,
            focus: true
        }).then(function(response) {
                    var eventAlertaVista = component.getEvent('alertaconsultada');
                    eventAlertaVista.setParams({
                        "alertId" : id 
                    });
                    console.log('AQUI VA EL EVENTO BRO');
                    eventAlertaVista.fire();																			 									
            workspaceAPI.getTabInfo({
                tabId: response
            }).then(function(tabInfo) {
                console.log("The url for this tab is: " + tabInfo.url);
            });
        })
        .catch(function(error) {
            console.log(error);
        });
    }

})