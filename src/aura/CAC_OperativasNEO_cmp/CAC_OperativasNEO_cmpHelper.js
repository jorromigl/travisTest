({
    // Select the mapping depending on the Action Code
    selectMap : function(actionCode) {
        var dataMap;
        // Put unmapped parameters in last rows
        switch (actionCode) {
            // Reintegro de emergencia
            case "CodeActionURLE":
                dataMap = {
                    // "actionCode":<actionCode>,
                    "Id":"AccountId",
                    "Ursus__c":"Account.Ursus__c",
                    "Name":"Account.Name",
                    "Codigo_gestor__c":"Account.Gestor__r.Codigo_de_Gestor__c",
                    "subInterID":"Id",
                    "interID":"ParentId",
                    "CtiId__c":"Parent.CtiId__c",
                    "ConnId__c":"Parent.ConnId__c",
                    "Seguridad_semaforo__c":"Parent.Seguridad_semaforo__c",
                    "Origin":"CAC_Flujo__c",
                    "Codigo_empleado_SSA__c":"",    // Context Variable from User
                    "UserId":"",                    // Context Variable from User
                    "TrackingID":""                 // Unmapped
                };
                break;
            // Solicitud PIN
            case "CodeActionRPIN":
                dataMap = {
                    // "actionCode":<actionCode>,
                    "Id":"AccountId",
                    "Ursus__c":"Account.Ursus__c",
                    "Name":"Account.Name",
                    "subInterID":"Id",
                    "interID":"ParentId",
                    "CtiId__c":"Parent.CtiId__c",
                    "ConnId__c":"Parent.ConnId__c",
                    "Seguridad_semaforo__c":"Parent.Seguridad_semaforo__c",
                    "Seguridad_OTP__c":"Parent.Seguridad_OTP__c",
                    "Seguridad_Quizz__c":"Parent.Seguridad_Quiz__c",
                    "Origin":"CAC_Flujo__c",
                    "Codigo_empleado_SSA__c":"",
                    "TrackingID":"" // Unmapped
                };
                break;
            // Clave OTP
            case "CodeActionOTP":
                dataMap = {
                    // "actionCode":<actionCode>,
                    "Id":"AccountId",
                    "Ursus__c":"Account.Ursus__c",
                    "Numero_de_movil__c":"Account.Numero_de_movil__c",
                    "Telefono_confirmado__c":"Account.Telefono_confirmado__c",
                    "subInterID":"Id",
                    "interID":"ParentId",
                    "CtiId__c":"Parent.CtiId__c",
                    "ConnId__c":"Parent.ConnId__c",
                    "Origin":"CAC_Flujo__c",
                    "Codigo_empleado_SSA__c":"",
                    "TrackingID":"" // Unmapped
                };
                break;
            // Destinos SMS
            case "CodeActionDEST":
                dataMap = {};
                break;
            // Consultas SMS
            case "CodeActionCSMS":
                dataMap = { 
                    // "actionCode":<actionCode>,
                    "Id":"AccountId",
                    "Ursus__c":"Account.Ursus__c",
                    "Numero_de_movil__c":"Account.Numero_de_movil__c", 
                    "Telefono_confirmado__c":"Account.Telefono_confirmado__c", 
                    "subInterID":"Id", 
                    "interID":"ParentId", 
                    "ConnId__c":"Parent.ConnId__c", 
                    "Codigo_empleado_SSA__c":"",
                    "TrackingID":"" // Unmapped
                };
                break;

            default:
                throw Error('Esta operativa no tiene parámetros asociados');
        }
        return dataMap;
    },
    // Returns the field map ready to be sent to the Canvas
    setCaseData : function(component, theMap, theCaseData, actionCode) {
        let aux;
        let entries;
        for (let key in theMap) {
            aux = theCaseData;
            entries = theMap[key].split('.', 5);
            for (let j in entries) {
                if (aux.hasOwnProperty(entries[j])) {
                    aux = aux[entries[j]];
                } else {
                    aux = '';
                    break;
                }
            }
            theMap[key] = aux;
        }
        var mapOrigin = {
            "Entrante":"ENT",
            "Saliente":"SAL"
        };
        // Fix field CAC_Flujo__c
        if (theMap.hasOwnProperty('CAC_Flujo__c') && mapOrigin.hasOwnProperty(theMap.CAC_Flujo__c)) {
            theMap.CAC_Flujo__c = mapOrigin[theMap.CAC_Flujo__c];
        }
        // Add non-mapped parameters
        theMap.actionCode = actionCode;

        var thisUser = component.get("v.user");
        if (theMap.hasOwnProperty('UserId')) {
            theMap.UserId = thisUser.Id;
        }
        if (theMap.hasOwnProperty('Codigo_empleado_SSA__c')) {
            theMap.Codigo_empleado_SSA__c = ( thisUser.hasOwnProperty('Codigo_empleado_SSA__c') ? thisUser.Codigo_empleado_SSA__c : '' );
        }

        return theMap;
    },
    // Generates the tab and the canvas component inside
    generateCanvasTab : function(component, event, helper, data) {
        var clicked = event.getSource();
        var opAuraId = clicked.getLocalId();
        var opLabel = clicked.get("v.label");
        var iconName = clicked.get("v.iconName");
        $A.createComponents([[
            "lightning:tab", {
                "aura:id": opAuraId, // MAKE ID AND AURA:ID SAME
                "id": opAuraId, 
                "label": opLabel, 
                "iconName": iconName 
            }], [
            "c:CAC_CanvasModal_cmp", {
                "aura:id": "canvas" + opAuraId, 
                "data": data 
            }]], 
            function(contents, status, errorMessage) {
                if (status === "SUCCESS") { // || status === "DRAFT") {
                    var newTab = contents[0];
                    var canvas = contents[1];
                    newTab.set("v.body", canvas);

                    // Adds the new tab to the tabList attribute (body of tabset)
                    var tabList = component.get("v.tabList");
                    tabList.push(newTab);
                    component.set("v.tabList", tabList);
                } else {
                    console.log("Error. Status of component creation: " + status);
                }
            }
        );
    },
    // Show the tab from an event source
    focusTab : function(component, event, helper) { 
        var opAuraId = event.getSource().getLocalId();
        component.find("canvasTabset").set("v.selectedTabId", opAuraId);
    },
    // Show or hide the modal window
    toggleShowModal : function(component) {
        $A.util.toggleClass(component.find("modalWindow"), "slds-hide");
    },
    // Close the selected Tab from Tabset
    closeSelectedTab : function(component, event, helper) {
        var selectedTabLocalId = component.find("canvasTabset").get("v.selectedTabId"); // id is the same as aura:id
        var tabList = component.get("v.tabList");

        var indexInArray = null;
        
        if (tabList.length) {
            for (let i=0 ; i<tabList.length ; i++) {
                if (selectedTabLocalId === tabList[i].getLocalId()) {
                    var indexInArray = i;
                    break;
                }
            }
            if (indexInArray !== null) {
                tabList.splice(indexInArray, 1);
                component.set("v.tabList", tabList);
                if (!tabList.length) {
                    helper.toggleShowModal(component);
                } else {
                    var localId = tabList[0].getLocalId();
                    component.find("canvasTabset").set("v.selectedTabId", localId);
                }
            } else {
                alert("Selecciona una pestaña")
            }
        } else {
            helper.toggleShowModal(component);
        }
    },
})