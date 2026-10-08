import type { ComponentKind, DeclarativeProfile } from '../domain/profiles';
const softwareModes = ['nuevo','ampliacion','migracion'] as const;
function integrated(id:string,name:string,kinds:ComponentKind[],questions:string[]):DeclarativeProfile {
    return {id,version:'1.0.0',name,description:'Perfil documental del generador; la implementación del destino requiere revisión.',sources:[{label:'Contrato público de SDD-Studio',url:'https://github.com/xaviiromf/SDD-generator'}],reviewedAt:'2026-10-08',support:'verificada',appliesTo:id==='perfil-documental'?['documentacion']:[...softwareModes],componentKinds:kinds,capabilities:['Delimitar responsabilidades y criterios observables'],questions,constraints:['No inventar contratos ni resultados de pruebas'],sections:['Requisitos','Arquitectura','Criterios de validación']};
}
export const builtinProfiles: readonly DeclarativeProfile[] = [
    integrated('perfil-web','Interfaz web',['web'],['¿Qué actores, dispositivos y condiciones de acceso se necesitan?']),
    integrated('perfil-movil','Aplicación móvil',['movil'],['¿Cómo funciona sin conectividad y qué permisos requiere?']),
    integrated('perfil-api','API y servicios',['api','servicio'],['¿Cuáles son las interfaces, errores y límites declarados?']),
    integrated('perfil-sistema','Sistemas, datos y dispositivos',['cli','escritorio','datos','dispositivo','otro'],['¿Qué entorno y protocolo se deben preservar?']),
    integrated('perfil-documental','Proceso documental',['documental'],['¿Qué actores, decisiones y evidencias necesita el proceso?'])
];
