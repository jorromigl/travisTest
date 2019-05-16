/*****************************************************************************************************************************************

    Apex Trigger Name: User
    Version:           1.0
    Created Date:      23/01/2017
    Function:          User trigger
    Author:            Francisco Javier Ayllon Martinez
    Company:           Capgemini

    History: 
    <Date>                  <Dev Name>                              <Change Description>
    23/01/2017              Francisco Javier Ayllon Martinez        Initial version
    23/02/2017              Joaquin Martin                          Trigger: On Update: Update record on Usuario_CTI__c when checkbox "Usuario_CTI__c" is checked/unchecked
    23/02/2017              Joaquin Martin                          Trigger: On Insert: Create record on Usuario_CTI__c when checkbox "Usuario_CTI__c" is checked.
    23/03/2017              Joaquin Martin                          Delete "isDelete" & "isUndelete" branchs (unreachable code). DML delete operations are not allowed id USER object.
    23/05/2017		        Alberto Merino			                Adjustments for migration
    22/03/2019		        Joaquin Martin			                Trigger: On Insert/Update: Create/update record on Usuario_CTI_CAC__c when checkbox "Usuario_CTI_CAC__c" is checked/unchecked.
*****************************************************************************************************************************************/
trigger User on User (before insert, before update, before delete, after insert, after update, after delete, after undelete){

        Bypass__c bypass = Bypass__c.getInstance();
        system.debug(Bypass.Skip_trigger__c);
         system.debug(Bypass.Execute_trigger_Migration__c);
        if (!Bypass.Skip_trigger__c){
            if (trigger.isBefore){
                if (trigger.isInsert){
                   
                }              
            }
            else if(trigger.isAfter) { 
                if (trigger.isInsert){  
                    
                        UserOnCTI_Trigger.beforeInsertCreateUserCTI(trigger.new);   
                        CAC_UserOnCTI_Trigger.beforeInsertCreateUserCAC(trigger.new);   
                }
                else if (trigger.isUpdate){
                    
                            UserOnCTI_Trigger.beforeUpdateUpdateUserCTI(trigger.new,trigger.OldMap); 
                            CAC_UserOnCTI_Trigger.beforeUpdateUpdateUserCAC(trigger.new,trigger.OldMap); 
                    
                    
                    		UserTrigger.AfterUpdateCodigoGestor(trigger.new,trigger.OldMap);
                    		//UserTrigger.LaunchCalculoMasValor(trigger.new,trigger.OldMap);
                    		//UserTrigger.LaunchCalculoGestor(trigger.new,trigger.OldMap);
                }
            }
        }
        //--- Solo para las Integraciones ---
        else if (Bypass.Execute_trigger_Migration__c){ 
            if (trigger.isBefore){

                UserTrigger ust = new UserTrigger();

                if (trigger.isInsert){
                       UserTrigger.beforeInsertIntegration(trigger.new);
                }
                else if (trigger.isUpdate){
                       UserTrigger.beforeUpdateIntegration(trigger.new,Trigger.oldMap);
                    	
                }
            }
            else if(trigger.isAfter) { 
                if (trigger.isInsert){
                   UserOnCTI_Trigger.beforeInsertCreateUserCTI(trigger.new);  
                }
                else if (trigger.isUpdate){
                    UserOnCTI_Trigger.beforeUpdateUpdateUserCTI(trigger.new,trigger.OldMap); 
                    UserTrigger.AfterUpdateCodigoGestor(trigger.new,trigger.OldMap);
                }
            }

        }
        //----------------------------------------

}