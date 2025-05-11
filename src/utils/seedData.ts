
import { supabase } from '@/integrations/supabase/client';
import { 
  projects, 
  suppliers, 
  purchaseOrders, 
  clients, 
  milestones,
  externalLinks,
  teamMembers
} from '@/data/mockData';

// This file provides utility functions to seed the Supabase database with our mock data

// Convert field names from camelCase to snake_case for Supabase
function convertToSnakeCase(data: any) {
  const result: any = {};
  
  Object.keys(data).forEach(key => {
    // Convert key from camelCase to snake_case
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = data[key];
  });
  
  return result;
}

// Special field mappings for each data type
const projectFields = {
  startDate: 'start_date',
  supplierId: 'supplier_id',
  clientId: 'client_id',
  projectManager: 'project_manager',
  manufacturingManager: 'manufacturing_manager',
  budgetSpent: 'budget_spent'
};

const supplierFields = {
  contactPerson: 'contact_person',
  onTimeDeliveryRate: 'on_time_delivery_rate'
};

const purchaseOrderFields = {
  poNumber: 'po_number',
  projectId: 'project_id',
  partName: 'part_name',
  supplierId: 'supplier_id',
  clientId: 'client_id',
  clientName: 'client_name',
  dateCreated: 'date_created',
  contractualDeadline: 'contractual_deadline',
  placedBy: 'placed_by',
  shipmentDate: 'shipment_date',
  budgetSpent: 'budget_spent'
};

const milestoneFields = {
  dueDate: 'due_date',
  projectId: 'project_id',
  poId: 'po_id'
};

const clientFields = {
  contactPerson: 'contact_person'
};

const teamMemberFields = {
};

const externalLinkFields = {
  projectId: 'project_id',
  poId: 'po_id',
  supplierId: 'supplier_id',
  clientId: 'client_id',
  dateAdded: 'date_added'
};

// Convert data objects with special field mappings
function convertData(data: any[], fieldMappings: any) {
  return data.map(item => {
    const result: any = { ...item };
    
    // Apply special field mappings
    Object.keys(fieldMappings).forEach(key => {
      if (key in item) {
        result[fieldMappings[key]] = item[key];
        delete result[key];
      }
    });
    
    return result;
  });
}

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Convert and seed clients first (they're referenced by projects)
    const convertedClients = convertData(clients, clientFields);
    const { error: clientsError } = await supabase.from('clients').upsert(convertedClients);
    
    if (clientsError) {
      throw new Error(`Error seeding clients: ${clientsError.message}`);
    }
    console.log("✅ Clients seeded successfully");

    // Convert and seed suppliers
    const convertedSuppliers = convertData(suppliers, supplierFields);
    const { error: suppliersError } = await supabase.from('suppliers').upsert(convertedSuppliers);
    
    if (suppliersError) {
      throw new Error(`Error seeding suppliers: ${suppliersError.message}`);
    }
    console.log("✅ Suppliers seeded successfully");

    // Convert and seed projects
    const convertedProjects = convertData(projects, projectFields);
    const { error: projectsError } = await supabase.from('projects').upsert(convertedProjects);
    
    if (projectsError) {
      throw new Error(`Error seeding projects: ${projectsError.message}`);
    }
    console.log("✅ Projects seeded successfully");

    // Convert and seed purchase orders
    const convertedPOs = convertData(purchaseOrders, purchaseOrderFields);
    const { error: posError } = await supabase.from('purchase_orders').upsert(convertedPOs);
    
    if (posError) {
      throw new Error(`Error seeding purchase orders: ${posError.message}`);
    }
    console.log("✅ Purchase orders seeded successfully");

    // Convert and seed milestones
    const convertedMilestones = convertData(milestones, milestoneFields);
    const { error: milestonesError } = await supabase.from('milestones').upsert(convertedMilestones);
    
    if (milestonesError) {
      throw new Error(`Error seeding milestones: ${milestonesError.message}`);
    }
    console.log("✅ Milestones seeded successfully");

    // Convert and seed team members
    const convertedTeamMembers = convertData(teamMembers, teamMemberFields);
    const { error: teamMembersError } = await supabase.from('team_members').upsert(convertedTeamMembers);
    
    if (teamMembersError) {
      throw new Error(`Error seeding team members: ${teamMembersError.message}`);
    }
    console.log("✅ Team members seeded successfully");

    // Convert and seed external links
    const convertedLinks = convertData(externalLinks, externalLinkFields);
    const { error: linksError } = await supabase.from('external_links').upsert(convertedLinks);
    
    if (linksError) {
      throw new Error(`Error seeding external links: ${linksError.message}`);
    }
    console.log("✅ External links seeded successfully");

    console.log("✅ All data seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
}
