
import { Database } from '@/integrations/supabase/types';

// Define types using the correct structure from the Database type
export type Tables = Database['public']['Tables'];

// Suppliers
export type SupplierRow = Tables['suppliers']['Row'];
export type SupplierInsert = Tables['suppliers']['Insert'];

// Projects
export type ProjectRow = Tables['projects']['Row'];
export type ProjectInsert = Tables['projects']['Insert'];

// Purchase Orders
export type PurchaseOrderRow = Tables['purchase_orders']['Row'];
export type PurchaseOrderInsert = Tables['purchase_orders']['Insert'];

// Milestones
export type MilestoneRow = Tables['milestones']['Row'];
export type MilestoneInsert = Tables['milestones']['Insert'];

// Supplier Comments
export type SupplierCommentRow = Tables['supplier_comments']['Row'];
export type SupplierCommentInsert = Tables['supplier_comments']['Insert'];

// External Links
export type ExternalLinkRow = Tables['external_links']['Row'];
export type ExternalLinkInsert = Tables['external_links']['Insert'];

// Clients
export type ClientRow = Tables['clients']['Row'];
export type ClientInsert = Tables['clients']['Insert'];

// Team Members
export type TeamMemberRow = Tables['team_members']['Row'];
export type TeamMemberInsert = Tables['team_members']['Insert'];
