/*****************************************************************************************************************************************

    Apex Trigger Name: Usuario_CTI_CAC__c 
    Version:           1.0
    Created Date:      22/03/2019
    Function:          Autogestion del objeto
    Author:            Joaquin Martin 
    Company:           DatapointEurope

    History: 
    <Date>                  <Dev Name>                              <Change Description>
    22/03/2019              Joaquin Martin                          Initial version

*****************************************************************************************************************************************/
trigger Usuario_CTI_CAC on Usuario_CTI_CAC__c (before insert, before update, before delete, after insert, after update, after delete, after undelete){

           if (trigger.isBefore){
                if (trigger.isInsert){
                     
                        CAC_CTI_Usuario_Trigger_ctrl.OnInsert_CheckDuplicateUsersOnObjectCTI_CAC(Trigger.new);
                               
                }
                else if (trigger.isUpdate){
                    
                }
                else if (trigger.isDelete){
                    
                    CAC_CTI_Usuario_Trigger_ctrl.OnDelete_EnforceUsersObjectCTI_CAC(Trigger.old);
                
                }
            }
            
            else if(trigger.isAfter) { 
                if (trigger.isInsert){ 
                    
                }
                else if (trigger.isUpdate){ 
                    
                }
                else if (trigger.isDelete){ 
                    
                }
            }
}