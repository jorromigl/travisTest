({
    onInit : function(component,recordId){
        console.log('ON INIT COMUN');
        var action = component.get("c.getAlerts")
        action.setParams({ record: recordId })
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue().length>0) {
                component.set("v.alertas", response.getReturnValue());
                var existen = this.nueva(response.getReturnValue(),component.get('v.alertaVista'));
                var utilityAPI = component.find("utilitybar");
                if(!existen){
                    
                    utilityAPI.setUtilityHighlighted({
                        highlighted: true
                    });
                    if(component.get('v.firstTime')===true){
                        utilityAPI.openUtility();
                        component.set('v.firstTime',false);
                    }
                }
            }else{
                console.log('el attributo esta en : ' + component.get('v.firstTimeError'));
                if(component.get('v.firstTimeError')===true){
                    component.set('v.firstTimeError',false);
                    console.log('POR EL BUENO');
                }else{
                    console.log('POR EL MALO');
                    component.set('v.firstTimeError',false);
                    console.log("Failed with state: " + state);
                    component.set("v.alertas",null);
                    var utilityAPI = component.find("utilitybar");
                    utilityAPI.setUtilityHighlighted({
                        highlighted: false
                    });
                    utilityAPI.minimizeUtility();
                    
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    onInitA : function(component,recordId){
        console.log('ON INIT A');
        var action = component.get("c.getAlerts")
        action.setParams({ record: recordId })
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue().length>0) {
                component.set("v.alertas", response.getReturnValue());
                var existen = this.nueva(response.getReturnValue(),component.get('v.alertaVista'));
                var utilityAPI = component.find("utilitybar");
                if(!existen){
                    
                    utilityAPI.setUtilityHighlighted({
                        highlighted: true
                    });
                    if(component.get('v.firstTime')===true){
                        utilityAPI.openUtility();
                        component.set('v.firstTime',false);
                    }
                }
            }else{
                console.log('NO ENCONTRAMOS NADA');
              /*  if(component.get('v.firstTimeError')===true){
                    component.set('v.firstTimeError',false);
                    console.log('POR EL BUENO');
                }else{
                    console.log('POR EL MALO');
                    component.set('v.firstTimeError',false);
                    console.log("Failed with state: " + state);
                    component.set("v.alertas",null);
                    var utilityAPI = component.find("utilitybar");
                    utilityAPI.setUtilityHighlighted({
                        highlighted: false
                    });
                    utilityAPI.minimizeUtility();
                    
                }*/
            }
        });
        $A.enqueueAction(action);
    },
    
    nueva : function(alertas,ids){
        var existen=true;
        for(var i = 0;i <alertas.length;i++ ){
            existen = ids.includes(alertas[i].Id);
            if(existen===false){
                return existen};
        }
        return existen;
    },
    
    doUpdateVistas : function(component,id){
        var arrayid = component.get('v.alertaVista');
        if(!arrayid.includes(id)){
            arrayid.push(id);
            component.set('v.alertaVista',arrayid);
        }
        
        if(this.nueva(component.get('v.alertas'),arrayid)){
            var utilityAPI = component.find("utilitybar");
            utilityAPI.setUtilityHighlighted({
                highlighted: false
            });
        }
    }
})