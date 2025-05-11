
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types';
import { ClientRow } from '@/types/supabaseTypes';

// Adapter function to convert Supabase rows to our app type
export function adaptClientFromSupabase(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name || '',
    contactPerson: row.contact_person || '',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    country: row.country || '',
    notes: row.notes || '',
  };
}

// Adapter function to convert our app type to Supabase insert type
export function adaptClientForSupabase(client: Partial<Client>) {
  return {
    id: client.id,
    name: client.name,
    contact_person: client.contactPerson,
    email: client.email,
    phone: client.phone,
    address: client.address,
    country: client.country,
    notes: client.notes,
  };
}

// Service functions
export async function fetchClients() {
  const { data, error } = await supabase.from('clients').select('*');
  
  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  
  return data.map(adaptClientFromSupabase);
}

export async function fetchClientById(id: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching client ${id}:`, error);
    return null;
  }
  
  return adaptClientFromSupabase(data);
}

export async function createClient(client: Partial<Client>) {
  const { data, error } = await supabase
    .from('clients')
    .insert(adaptClientForSupabase(client))
    .select()
    .single();
  
  if (error) {
    console.error('Error creating client:', error);
    return null;
  }
  
  return adaptClientFromSupabase(data);
}

export async function updateClient(id: string, client: Partial<Client>) {
  const { data, error } = await supabase
    .from('clients')
    .update(adaptClientForSupabase(client))
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating client ${id}:`, error);
    return null;
  }
  
  return adaptClientFromSupabase(data);
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting client ${id}:`, error);
    return false;
  }
  
  return true;
}
