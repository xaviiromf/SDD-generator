import { normalize } from './tokenizer';
import { technologyById } from '../catalog/technologies';
import { optionCompatible } from '../domain/compatibility';
import type { Configuration, Suggestion } from '../domain/models';
export function scopeSuggestions(c: Configuration): Suggestion[] {
    if (!c.selections.storage?.length && /\b(reservas|clientes|productos|inventario|usuarios|pedidos)\b/.test(normalize(c.idea)))
        return [{ id: 'missing-storage', message: 'Se detectaron entidades sin persistencia definida. Elige cómo conservar sus datos.', options: ['localstorage', 'supabase', 'sqlite'].filter(id => optionCompatible(technologyById.get(id)!, c)) }];
    return [];
}
