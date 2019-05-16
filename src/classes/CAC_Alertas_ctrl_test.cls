@isTest
private class CAC_Alertas_ctrl_test {

    @testSetup static void setup(){

    }

    
    @isTest static void testMethod1() {
        List<Case> listaid = new List<Case>();
            List<Alertas__c> lista = new List<Alertas__c>();
            lista = CAC_Alertas_ctrl.getAlerts('00558000001xipBAAQ');
            System.assert(lista.size()==0,'TEST 1: OK');
    }

}