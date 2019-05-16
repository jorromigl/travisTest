<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>CAC_Asunto_Operativas_Consultas</fullName>
        <field>Subject</field>
        <formula>text(CAC_Operacion__c)  &amp; &quot; &quot;&amp; text(CAC_Producto__c)</formula>
        <name>Asunto Operativas-Consultas</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>CAC_Asunto_Subinteraccion</fullName>
        <actions>
            <name>CAC_Asunto_Operativas_Consultas</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Case.RecordTypeId</field>
            <operation>equals</operation>
            <value>Operativa-Consulta</value>
        </criteriaItems>
        <description>Informar automaticamente el campo Asunto, concatenando los campos Operación y Producto para las subinteracciones con tipo de registro Operativa-Consulta</description>
        <triggerType>onAllChanges</triggerType>
    </rules>
</Workflow>
