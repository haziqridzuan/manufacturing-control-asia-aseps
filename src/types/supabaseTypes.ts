
import { Database } from '@/integrations/supabase/types';

// Define types from the Database type
export type TablesInsert = Database['public']['Tables']['Insert'];
export type TablesRow = Database['public']['Tables']['Row'];

// Suppliers
export type SupplierRow = TablesRow['suppliers'];
export type SupplierInsert = TablesInsert['suppliers'];

// Projects
export type ProjectRow = TablesRow['projects'];
export type ProjectInsert = TablesInsert['projects'];

// Purchase Orders
export type PurchaseOrderRow = TablesRow['purchase_orders'];
export type PurchaseOrderInsert = TablesInsert['purchase_orders'];

// Milestones
export type MilestoneRow = TablesRow['milestones'];
export type MilestoneInsert = TablesInsert['milestones'];

// Supplier Comments
export type SupplierCommentRow = TablesRow['supplier_comments'];
export type SupplierCommentInsert = TablesInsert['supplier_comments'];

// External Links
export type ExternalLinkRow = TablesRow['external_links'];
export type ExternalLinkInsert = TablesInsert['external_links'];

// Clients
export type ClientRow = TablesRow['clients'];
export type ClientInsert = TablesInsert['clients'];

// Team Members
export type TeamMemberRow = TablesRow['team_members'];
export type TeamMemberInsert = TablesInsert['team_members'];
