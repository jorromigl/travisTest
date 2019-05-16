public class EmailToCase {
    public static void getClients(List < Case > newCaseList) {
        List < String > ursusCodes = new List < String > ();
        List<String> emailList = new List<String>();
        Map<String, List<Case>> ursusCasesMap = new Map<String,List<Case>>();
        Map<String, List<Case>> emailCasesMap = new Map<String,List<Case>>();

        //Get Fictional Client Id via Custom Setting
        GenericCS__c clientFic = GenericCS__c.getValues('Cf Id');

        //Extract data from cases 
        for (Case c: newCaseList) {
            system.debug('Case insert '+c);
            String consultaCACRT = SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CAC_Operativa').getRecordTypeId();
            if (c.Subject != null && c.AccountId == null && c.RecordTypeId != consultaCACRT) {
                String ursus = getClient(c.Subject);
                system.debug('Case Subject Ursus '+ursus);               
                if(ursus != '' && ursus != '000000000'){ //If Ursus Code is indicated and not 000000000 
                    ursusCodes.add(ursus);
                    if(!ursusCasesMap.containsKey(ursus)){
                        ursusCasesMap.put(ursus, new List<Case>());
                    }
                    ursusCasesMap.get(ursus).add(c);
                } else { //If Ursus Code is 000000000 or not indicated, get email indicated
                    String email = getEmailClient(c.Subject);
                    system.debug('Case Subject Email '+email);
                    if(email != ''){//If email is indicated
                        emailList.add(email);
                        if(!emailCasesMap.containsKey(email)){
                            emailCasesMap.put(email, new List<Case>());
                        }
                        emailCasesMap.get(email).add(c);
                    } else {//If email is also not indicated, assign Fictional Client
                        system.debug('No Ursus nor Email, assign Fictional Client');
                        c.AccountId = clientFic.CF_Id_Cliente_Ficticio__c;
                    }                    
                }

                //Assign Parent Case if indicated
                String parentCaseId = getParent(c.Subject);
                if(parentCaseId != null && parentCaseId != ''){
                    c.ParentId = parentCaseId;
                }
            } else if(c.Subject == null && c.AccountId == null && c.RecordTypeId != consultaCACRT){
                system.debug('Subject null assign Fictional Client');
                c.AccountId = clientFic.CF_Id_Cliente_Ficticio__c;
            }
        }

        //Get Account Data via Ursus         
        if(ursusCodes.size() > 0){
            Map<String,Id> accMap = new Map<String,Id>(); 
            //Get Accounts Ids
            for(Account a : [Select Id, Ursus__c From Account Where Ursus__c IN :ursusCodes]){
                accMap.put(a.Ursus__c,a.Id);               
            }
            for(String ursus : ursusCasesMap.keySet()){
                if(accMap.containsKey(ursus)){//If client is found, assign it
                    for(Case c : ursusCasesMap.get(ursus)){
                        c.AccountId = accMap.get(ursus);
                    }
                } else {//If client was not found, assign Fictional Client 
                    for(Case c : ursusCasesMap.get(ursus)){
                        c.AccountId = clientFic.CF_Id_Cliente_Ficticio__c;
                    }
                }
            }
        }
       
        //Get Account Data via Email
        if(emailList.size() > 0){
            List<String> listAccountsEmails = CalculoAccID.calculateMethod(emailList);
            Map<String,Id> emailAccIdMap = new Map<String,Id>();
            //Get relationship between returned Account Ids and emails searched
            for(Integer i = 0; i<listAccountsEmails.size();i++){
                if(listAccountsEmails[i] != ''){
                    emailAccIdMap.put(emailList[i], listAccountsEmails[i]);
                } else { //If email was not found, put Fictional Client Id
                    emailAccIdMap.put(emailList[i], clientFic.CF_Id_Cliente_Ficticio__c);
                }                
            }
            for(String em : emailList){
                if(emailCasesMap.containsKey(em)){
                    for(Case c : emailCasesMap.get(em)){
                        c.AccountId = emailAccIdMap.get(em);
                    }
                }
            }
        }
      
        system.debug('newCaseList '+newCaseList);
    }

    public static void getClientOnline(List<Case> newCaseList){
        GenericCS__c clientFic = GenericCS__c.getValues('Cf Id');
        Map<String, Set<Id>> casesClientOnline = new Map<String, Set<Id>>();
        for (Case c: newCaseList) {
            system.debug('Case after insert '+c);
            if (c.Subject != null && (c.AccountId == null || c.AccountId == clientFic.CF_Id_Cliente_Ficticio__c)) {
                String ursus = getClient(c.Subject);
                system.debug('Case Subject Ursus '+ursus);               
                if(ursus != '' && ursus != '000000000'){
                    //Add case to the list to try to create client online
                    if(!casesClientOnline.containsKey(ursus)){
                        casesClientOnline.put(ursus, new Set<Id>());
                    }
                    casesClientOnline.get(ursus).add(c.Id);
                }
            }
        }

        //Execute Create Client Online in future
        if(casesClientOnline.size() > 0){
            String casesClientOnlineJSON = JSON.serialize(casesClientOnline);
            CreateClientOnline.checkClientOnline(casesClientOnlineJSON);
        }
    }

    public static String getParent(String subject){
        String parent = '';
        if (subject != '' && subject != null) {
            Integer result = subject.indexOf('IDCASO:');
            if (result != -1 && subject.length() >= result + 7 + 18) {
                parent = subject.substring(result + 7, result + 7 + 18);
            }
        }
        return parent;
    }

    public static String getClient(String subject) {
        String client = '';
        if (subject != '' && subject != null) {
            Integer result = subject.indexOf('NumCliente:');
            if (result != -1 && subject.length() >= result + 11 + 9) {
                client = subject.substring(result + 11, result + 11 + 9);
            }
        }
        return client;
    }

    public static String getEmailClient(String subject) {
        String email = '';
        if (subject != '' && subject != null) {
            Integer result = subject.lastIndexOf('FromOriginal:') != -1 ? subject.lastIndexOf('FromOriginal:') : subject.lastIndexOf('EmailCliente:');
            if (result != -1) {
                email = subject.substring(result + 13, subject.length()-2);
            }
        }
        return email;
    }
}