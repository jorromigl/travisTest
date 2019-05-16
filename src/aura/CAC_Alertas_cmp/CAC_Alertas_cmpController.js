({
    doInit : function(component, event, helper) {
        //your code to be executed after 1 second
        console.log('ON INIT');
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            if(response.tabId===undefined){
                console.log('NO HAY RESPUESTA');  
            }else{
                
                if(response.isSubtab === true){
                    component.set("v.tabPadreActual",response.parentTabId); 
                    var arrayaux=response.pageReference.state.ws.split('/');
                    component.set('v.recordIdPadreActual',arrayaux[4]);
                    if(arrayaux[3]=='Case'){
                        
                        component.set('v.firstTimeError',true);
                        helper.onInitA(component,arrayaux[4]);
                    }else{
                        
                    }
                    
                }else{
                    
                    component.set('v.tabPadreActual',response.tabId);
                    
                    component.set('v.recordIdPadreActual',response.pageReference.attributes.recordId);
                    
                    
                    if(response.pageReference.attributes.objectApiName=='Case'){
                        
                        var recordId = response.pageReference.attributes.recordId;
                        
                        //SE ENVIARA PARA CRIBAR ALERTAS AL METODO DEL HELPER
                        
                        component.set('v.firstTimeError',true);
                        helper.onInitA(component,recordId);
                    }else{
                        
                    }
                }
            }
            
            if(response.pageReference.attributes.objectApiName === 'Alertas__c'){
                helper.doUpdateVistas(component,response.pageReference.attributes.recordId);
            }																				
        }).catch(function(error) {
            console.log(error);
            console.log('ERROR AL INICIAR EL UTITLITY');
            if(component.get('v.componenteIniciado')===false){console.log('CAMBIO DE SENTIDO');component.set('v.componenteIniciado',true);}
            component.set('v.firstTimeError',true);
        });
        if(component.get('v.componenteIniciado')===false){console.log('CAMBIO DE SENTIDO');component.set('v.componenteIniciado',true);}
        
        
        
        
    },
    
    setUtilityHighlighted : function(component, event, helper) {
        var utilityAPI = component.find("utilitybar");
        utilityAPI.setUtilityHighlighted({
            highlighted: true
        });
    },
    
    onTabFocused : function(component, event, helper){
        if(component.get('v.componenteIniciado')===true){
            console.log('TAB FOCUSED FUNCTION');
            var utilityAPI = component.find("utilitybar");  
            var workspaceAPI = component.find("workspace");
            var aux = event.getParam('currentTabId');
            workspaceAPI.getTabInfo({tabId: aux}).then(function(response) {
                
                
                if(response.isSubtab === true){
                    
                    var arrayaux=response.pageReference.state.ws.split('/');
                    if(arrayaux[3]=='Case'){
                        component.set("v.tabPadreActual",response.parentTabId);
                        if(component.get('v.recordIdPadreActual')===arrayaux[4]){
                            //DO NOTHING
                        }else{
                            
                            component.set('v.recordIdPadreActual',arrayaux[4]);
                            helper.onInit(component,arrayaux[4]);     
                            /*   if(component.get('v.alertas')===null){
                                            utilityAPI.setUtilityHighlighted({
                        					highlighted: false
                    							});
                							utilityAPI.minimizeUtility();
                        }*/
                            
                        }
                    }else{
                        component.set('v.recordIdPadreActual',arrayaux[4]);
                        component.set("v.alertas",null);
                        utilityAPI.setUtilityHighlighted({
                            highlighted: false
                        });
                        console.log('MINIMIZE 1');
                        utilityAPI.getUtilityInfo().then(function(response) {
                            if (response.utilityVisible) {
                                utilityAPI.minimizeUtility();
                            }
                            
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                    }
                    
                }else{
                    component.set('v.tabPadreActual',response.tabId);
                    component.set('v.recordIdPadreActual',response.pageReference.attributes.recordId);
                    if(response.pageReference.attributes.objectApiName==='Case'){
                        
                        var recordId = response.pageReference.attributes.recordId;
                        helper.onInit(component,recordId);
                        /* if(component.get('v.alertas')===null){
                        utilityAPI.setUtilityHighlighted({
                            highlighted: false
                        });
                        utilityAPI.minimizeUtility();
                        }*/
                    }else{
                        component.set("v.alertas",null);
                        utilityAPI.setUtilityHighlighted({
                            highlighted: false
                        });   
                        utilityAPI.getUtilityInfo().then(function(response) {
                            if (response.utilityVisible) {
                                utilityAPI.minimizeUtility();
                            }
                        })
                        .catch(function(error) {
                            console.log(error);
                        });
                    }
                }
                
                if(response.pageReference.attributes.objectApiName === 'Alertas__c'){
                    helper.doUpdateVistas(component,response.pageReference.attributes.recordId);
                }
                
            }).catch(function(error) {
                component.set("v.alertas",null);
                utilityAPI.setUtilityHighlighted({
                    highlighted: false
                });
                utilityAPI.getUtilityInfo().then(function(response) {
                    if (response.utilityVisible) {
                        utilityAPI.minimizeUtility();
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
            });
        }
    },
    
    updateVistas : function(component,event,helper){
        var id = event.getParam('alertId');
        helper.doUpdateVistas(component,id);
    }
    
})