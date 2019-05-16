public with sharing class CAC_OperativasNEO_ctrl {
    @AuraEnabled
    public static String getClientUrsus (Id caseId) {
        return [SELECT Id, Account.Ursus__c FROM Case WHERE Id=:caseId LIMIT 1].Account.Ursus__c;
    }

    @AuraEnabled
    public static User getUser() {
        return [SELECT Id, Codigo_empleado_SSA__c FROM User WHERE Id = :UserInfo.getUserId()];
    }

    /************************************************************************
     * INPUT:
     *     Id caseId: ID from the case to search fields from.
     *     List<String> queryFields: list of fields to query from the case.
     * RETURN:
     *     Case thisCase: a Case record containing the queried fields.
     * 
     * Be careful, empty Salesforce fields return no value! (not even null).
     ************************************************************************/
    @AuraEnabled
    public static Case getCaseData (Id caseId, List<String> queryFields) {
        if (queryFields.size() > 0) {
            String queryFieldsString = '';
            for (String aField : queryFields) {
                queryFieldsString += ( (queryFieldsString == '' || aField == '') ? '' : ',' ) + aField;
            }
            // Can do: Case thisCase = Database.query('SELECT ' + queryFieldsString + ' FROM Case WHERE Id=:caseId LIMIT 1');
            Case thisCase = Database.query('SELECT ' + queryFieldsString + ' FROM Case WHERE Id=:caseId LIMIT 1');
            return thisCase;
        } else {
            return new Case();
        }
    }
}