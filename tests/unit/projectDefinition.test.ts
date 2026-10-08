import { describe, expect, it } from 'vitest';
import { createProjectDefinition, createRequirement } from '../../src/domain/projectDefinition';
import { isProjectDefinition, projectValidationErrors } from '../../src/domain/projectValidation';
import { emptyConfiguration } from '../../src/domain/models';
import { validateConfiguration } from '../../src/domain/validation';
describe('modelo canónico',()=>{
 it('admite borradores incompletos y rechaza versiones, duplicados y referencias rotas',()=>{
  const project=createProjectDefinition();
  project.requirements=[createRequirement('RF-1')];
  expect(isProjectDefinition(project)).toBe(true);
  project.requirements.push(createRequirement('RF-1'));
  expect(isProjectDefinition(project)).toBe(false);
  project.requirements.pop(); project.requirements[0].actorId='ACT-999';
  expect(projectValidationErrors(project).join(' ')).toContain('ACT-999');
  expect(isProjectDefinition({...createProjectDefinition(),schemaVersion:2})).toBe(false);
 });
 it('rechaza límites, criterios duplicados, credenciales y símbolos prohibidos',()=>{
  const project=createProjectDefinition(); const requirement=createRequirement('RF-1');
  requirement.criteria=[{id:'CA-1',text:'Resultado'},{id:'CA-1',text:'Duplicado'}];
  project.requirements=[requirement]; expect(isProjectDefinition(project)).toBe(false);
  requirement.criteria=[];requirement.behavior='x'.repeat(2001);expect(isProjectDefinition(project)).toBe(false);
  requirement.behavior='token='+ 'a'.repeat(24);const config=emptyConfiguration();config.project=project;
  expect(validateConfiguration(config).some(d=>d.blocking)).toBe(true);
  requirement.behavior=String.fromCodePoint(0x1f600);expect(validateConfiguration(config).some(d=>d.blocking)).toBe(true);
 });
 it('representa trabajo documental sin inferir código ni datos de negocio',()=>{
  const project=createProjectDefinition('proceso');project.mode='documentacion';project.implementationRequired=false;
  expect(isProjectDefinition(project)).toBe(true);expect(project.requirements).toEqual([]);
 });
});
