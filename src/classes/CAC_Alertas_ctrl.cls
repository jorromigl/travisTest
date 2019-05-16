public class CAC_Alertas_ctrl {
    //prueba 1
	@AuraEnabled
    public static List<Alertas__c> getAlerts(Id record){
        
        return [SELECT Id,Name,Alerta__c,Cliente__r.Name,Fecha_fin_alerta__c FROM Alertas__c WHERE Cliente__c IN
                (SELECT AccountId FROM Case WHERE Id = :record) WITH SECURITY_ENFORCED /*AND Fecha_fin_alerta__c > TODAY*/];
    }
}