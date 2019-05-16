({
    // Inicializa el valor de v.user
    initUser : function(component, event, helper) {
        var action = component.get("c.getUser"); // Call the controller method
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.user", response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    console.log(JSON.stringify(errors));
                } else {
                    console.log("Unknown error");
                }
            } else {
                console.log("State: " + state);
            }
        });
        $A.enqueueAction(action);
    },
    // Inicializa el Ursus del cliente
    initUrsusCliente : function(component, event, helper) {
        var action = component.get("c.getClientUrsus"); // Call the controller method
        action.setParams({
            "caseId": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.ursusCliente", response.getReturnValue());
                // console.log("Ursus Cliente: " + response.getReturnValue()); // COMMENT
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    console.log(JSON.stringify(errors));
                } else {
                    console.log("Unknown error");
                }
            } else {
                console.log("State: " + state);
            }
        });
        $A.enqueueAction(action);
    },
    // Decide la acción según el botón clicado
    clickOperativa : function(component, event, helper) {
        var auraId = event.getSource().getLocalId();

        var actionCode;
        // Select the Action Code depending on the pressed button
        switch (auraId) {
            // Reintegro de emergencia
            case "reintegroemergencia":
                actionCode = "CodeActionURLE";
                break;
            // Solicitud PIN
            case "solicitudpin":
                actionCode = "CodeActionRPIN";
                break;
            // Clave OTP
            case "claveotp":
                actionCode = "CodeActionOTP";
                break;
            // Destinos SMS
            case "destinossms":
                actionCode = "CodeActionDEST";
                break;
            // Consultas SMS
            case "consultasms":
                actionCode = "CodeActionCSMS";
                break;

            default:
                throw Error("Operativa incorrecta o en proceso de construcción");
        }
        
        if (actionCode) {
            var recordId = component.get("v.recordId");
            var dataMap = helper.selectMap(actionCode);

            // Create the modal component that hosts the canvas app
            var tabList = component.get("v.tabList");

            if(auraId && tabList) {
                var isOpen = false;
                for (let i=0 ; i<tabList.length ; i++) { // SE PUEDE HACER CON EL OPERADOR 'IN' ?
                    if (auraId === tabList[i].getLocalId()) {
                        isOpen = true;
                        break;
                    }
                }

                if (!isOpen) {
                    let dataList = Object.values(dataMap);

                    var action = component.get("c.getCaseData");
                    action.setParams({
                        "caseId": recordId,
                        "queryFields": dataList
                    });
                    action.setCallback(this, function(response) {
                        var state = response.getState();
                        if (state === "SUCCESS") {
                            var returnedCaseData = response.getReturnValue();
                            component.set("v.thisCaseData", returnedCaseData);

                            var data = {
                                "parameters": helper.setCaseData(component, dataMap, returnedCaseData, actionCode)
                            };

                            if(!data) {
                                throw Error("No se han podido obtener los parámetros");
                            }

                            helper.generateCanvasTab(component, event, helper, data);
                            helper.focusTab(component, event, helper);
                            helper.toggleShowModal(component);

                        } else if (state === "ERROR") {
                            var errors = response.getError();
                            if (errors) {
                                console.log(JSON.stringify(errors));
                            } else {
                                console.log("Unknown error");
                            }
                        } else {
                            console.log("State: " + state);
                        }
                    });
                    $A.enqueueAction(action);

                } else {
                    helper.focusTab(component, event, helper);
                    helper.toggleShowModal(component);
                }
            }
        }
    },
    hideModal : function(component, event, helper) {
        helper.toggleShowModal(component);
    },
    closeAllTabs : function(component, event, helper) {
        component.set("v.tabList", []);
        helper.toggleShowModal(component);
    },
    closeTab : function(component, event, helper) {
        helper.closeSelectedTab(component, event, helper);
    },
})