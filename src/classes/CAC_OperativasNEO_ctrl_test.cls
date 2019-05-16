/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an organization are executed whenever Apex code is deployed
 * to a production organization to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production organization. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the organization size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
public class CAC_OperativasNEO_ctrl_test {

    @testSetup
    static void setup () {
        Account acc = new Account(
            // RecordTypeId = Schema.getGlobalDescribe().get('Account').getDescribe().getRecordTypeInfosByName().get('Particular').getRecordTypeId(),
            Name = 'OperativasNEO_TestAccount',
            Origen__c = 'faketestorigin',
            Ursus__c = '111111111'
        );
        Database.SaveResult dsrAccount = Database.insert(acc);
        System.debug('Account ID: ' + acc.Id);

        Case aCase = new Case(
            AccountId = acc.Id,
            CtiId__c = 123456,
            ConnId__c = 'TestConnId',
            Origin = 'Web'
        );
        Database.SaveResult dsrCase = Database.insert(aCase);

        System.assert(dsrAccount.isSuccess(), 'An error occurred while inserting test Account');
        System.assert(dsrCase.isSuccess(), 'An error occurred while inserting test Case');
    }

    @isTest
    static void getUrsusSuccess () {
        Account testAcc = [SELECT Id, Name, Origen__c, Ursus__c FROM Account WHERE (Ursus__c = '111111111' AND Origen__c = 'faketestorigin') LIMIT 1];
        Case testCase = [SELECT Id, AccountId FROM Case WHERE AccountId = :testAcc.Id LIMIT 1]; // Can be done w/ subquery

        Test.startTest();
            String clientUrsus = CAC_OperativasNEO_ctrl.getClientUrsus(testCase.Id);
        Test.stopTest();

        System.assertEquals(testAcc.Ursus__c, clientUrsus, 'Ursus codes do not match');
    }

    @isTest
    static void getCaseSuccess () {
        Account testAcc = [SELECT Id, Name, Origen__c, Ursus__c FROM Account WHERE (Ursus__c = '111111111' AND Origen__c = 'faketestorigin') LIMIT 1];
        Case theCase = [SELECT Id, AccountId, CtiId__c, ConnId__c, Origin FROM Case WHERE AccountId = :testAcc.Id LIMIT 1];
        List<String> queryFields = new List<String> {
            'Id',
            'AccountId',
            'CtiId__c',
            'ConnId__c',
            'Origin'
        };

        Test.startTest();
            Case queryCase = CAC_OperativasNEO_ctrl.getCaseData(theCase.Id, queryFields);
        Test.stopTest();

        System.assert(
            queryCase == theCase &&
            queryCase.Id == theCase.Id &&
            queryCase.AccountId == theCase.AccountId &&
            queryCase.CtiId__c == theCase.CtiId__c &&
            queryCase.ConnId__c == theCase.ConnId__c &&
            queryCase.Origin == theCase.Origin,
            'Cases are not the same OR some field not queried'
        );
    }

    @isTest
    static void getEmptyCaseWithEmptyFieldList () {
        Account testAcc = [SELECT Id, Name, Origen__c, Ursus__c FROM Account WHERE (Ursus__c = '111111111' AND Origen__c = 'faketestorigin') LIMIT 1];
        Case theCase = [SELECT Id, AccountId, CtiId__c, ConnId__c, Origin FROM Case WHERE AccountId = :testAcc.Id LIMIT 1];
        List<String> queryFields = new List<String> ();

        Test.startTest();
            Case queryCase = CAC_OperativasNEO_ctrl.getCaseData(theCase.Id, queryFields);
        Test.stopTest();

        System.assertEquals(new Case(), queryCase, 'Case gotten with empty field list is != new Case()');
    }

    @isTest
    static void getUserId () {
        Id profileId = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1].Id;
  
        User usr = new User(
            LastName = 'FakeLN',
            FirstName='FakeFN',
            Alias = 'FFAKE',
            Email = 'fakemail@fakedomain.com',
            Username = 'fakemail20190430@fakedomain.com.fakeusername',
            ProfileId = profileId,
            TimeZoneSidKey = 'GMT',
            LanguageLocaleKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LocaleSidKey = 'en_US'
        );
        Database.SaveResult dsr = Database.insert(usr);
        System.assert(dsr.isSuccess(), 'User insert failed');

        User returnedUser;
        System.runAs(usr) {
            Test.startTest();
                returnedUser = CAC_OperativasNEO_ctrl.getUser();
            Test.stopTest();
        }
        System.assertEquals(usr.Id, returnedUser.Id, 'User does not match');
    }
}