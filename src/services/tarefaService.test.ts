import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mock=vi.hoisted(()=>({get:vi.fn(),post:vi.fn(),put:vi.fn(),delete:vi.fn()}));
vi.mock('axios',()=>({default:{create:()=>mock,isAxiosError:()=>false}}));
const dados={titulo:'Teste',descricao:'',data:'2026-10-09',prioridade:'medium' as const,projeto:'TaskFlow',concluida:false};
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();vi.resetModules();vi.clearAllMocks();});
describe('serviço REST',()=>{
 beforeEach(()=>{vi.stubEnv('VITE_STORAGE_MODE','crudcrud');vi.stubEnv('VITE_API_URL','https://crudcrud.com/api/teste');});
 it('GET e POST usam tarefas e o identificador devolvido pela API',async()=>{const s=await import('./tarefaService');mock.get.mockResolvedValue({data:[{...dados,_id:'api-id'}]});mock.post.mockResolvedValue({data:{...dados,_id:'api-id'}});expect((await s.listarTarefas())[0]._id).toBe('api-id');expect((await s.criarTarefa(dados))._id).toBe('api-id');expect(mock.post).toHaveBeenCalledWith('/tarefas',dados);});
 it('PUT envia os dados sem _id; DELETE usa o mesmo identificador',async()=>{const s=await import('./tarefaService');await s.atualizarTarefa('api-id',{...dados,concluida:true});expect(mock.put).toHaveBeenCalledWith('/tarefas/api-id',{...dados,concluida:true});await s.excluirTarefa('api-id');expect(mock.delete).toHaveBeenCalledWith('/tarefas/api-id');});
 it('propaga erro da API sem registrar sucesso',async()=>{const s=await import('./tarefaService');mock.post.mockRejectedValue(new Error('indisponível'));await expect(s.criarTarefa(dados)).rejects.toThrow('indisponível');});
 it('recusa modo API sem endpoint configurado',async()=>{vi.stubEnv('VITE_API_URL','');const s=await import('./tarefaService');await expect(s.listarTarefas()).rejects.toThrow('Configure VITE_API_URL');});
});
describe('persistência local',()=>{it('cria, lê, edita e exclui',async()=>{vi.stubEnv('VITE_STORAGE_MODE','local');const armazenamento=new Map();vi.stubGlobal('localStorage',{getItem:(k:string)=>armazenamento.get(k)??null,setItem:(k:string,v:string)=>armazenamento.set(k,v)});const s=await import('./tarefaService');const t=await s.criarTarefa(dados);expect(await s.listarTarefas()).toEqual([t]);await s.atualizarTarefa(t._id,{...dados,concluida:true});expect((await s.listarTarefas())[0].concluida).toBe(true);await s.excluirTarefa(t._id);expect(await s.listarTarefas()).toEqual([]);});});
