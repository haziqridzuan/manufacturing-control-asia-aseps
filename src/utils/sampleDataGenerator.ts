
import { supabase } from "@/integrations/supabase/client";
import { ProjectInsert, SupplierInsert, MilestoneInsert, PurchaseOrderInsert, 
  SupplierCommentInsert, ExternalLinkInsert, ClientInsert, TeamMemberInsert } from "@/types/supabaseTypes";

export async function generateSampleData() {
  try {
    // Add suppliers
    const suppliers: SupplierInsert[] = [
      {
        name: "Global Manufacturing Inc.",
        country: "United States",
        contact_person: "John Smith",
        email: "john@globalmanufacturing.com",
        phone: "+1-555-123-4567",
        rating: 4,
        on_time_delivery_rate: 92,
        location: "Chicago, IL"
      },
      {
        name: "EuroTech Solutions",
        country: "Germany",
        contact_person: "Anna Mueller",
        email: "anna@eurotech.com",
        phone: "+49-555-234-5678",
        rating: 5,
        on_time_delivery_rate: 98,
        location: "Berlin, Germany"
      },
      {
        name: "Asia Components Ltd",
        country: "Japan",
        contact_person: "Hiroshi Tanaka",
        email: "hiroshi@asiacomponents.com",
        phone: "+81-555-345-6789",
        rating: 3,
        on_time_delivery_rate: 85,
        location: "Tokyo, Japan"
      },
      {
        name: "Quality Parts Co.",
        country: "Canada",
        contact_person: "Sarah Johnson",
        email: "sarah@qualityparts.com",
        phone: "+1-555-456-7890",
        rating: 4,
        on_time_delivery_rate: 90,
        location: "Toronto, Canada"
      }
    ];

    // Insert suppliers and get their IDs
    const { data: supplierData, error: supplierError } = await supabase
      .from('suppliers')
      .insert(suppliers)
      .select();
      
    if (supplierError) throw supplierError;
    
    // Add clients
    const clients: ClientInsert[] = [
      {
        name: "TechCorp Industries",
        contact_person: "Michael Chen",
        email: "michael@techcorp.com",
        phone: "+1-555-987-6543",
        country: "United States",
        address: "123 Innovation Way, Silicon Valley, CA",
        notes: "Major client for aerospace components."
      },
      {
        name: "Automotive Excellence",
        contact_person: "Sophia Rodriguez",
        email: "sophia@autoex.com",
        phone: "+1-555-876-5432",
        country: "United States",
        address: "456 Motors Avenue, Detroit, MI",
        notes: "Specializes in high-performance vehicle parts."
      },
      {
        name: "GreenEnergy Solutions",
        contact_person: "David Park",
        email: "david@greenenergy.com",
        phone: "+1-555-765-4321",
        country: "Canada",
        address: "789 Sustainable Drive, Vancouver, BC",
        notes: "Focused on renewable energy systems."
      }
    ];
    
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert(clients)
      .select();
      
    if (clientError) throw clientError;
    
    // Add team members
    const teamMembers: TeamMemberInsert[] = [
      {
        name: "Alex Johnson",
        role: "Project Manager",
        email: "alex@example.com",
        phone: "+1-555-111-2222",
        department: "Project Management"
      },
      {
        name: "Maria Garcia",
        role: "Manufacturing Manager",
        email: "maria@example.com",
        phone: "+1-555-222-3333",
        department: "Manufacturing"
      },
      {
        name: "Robert Lee",
        role: "Supply Chain Specialist",
        email: "robert@example.com",
        phone: "+1-555-333-4444",
        department: "Supply Chain"
      }
    ];
    
    const { data: teamMemberData, error: teamMemberError } = await supabase
      .from('team_members')
      .insert(teamMembers)
      .select();
      
    if (teamMemberError) throw teamMemberError;

    // Use the created suppliers for projects
    if (!supplierData || supplierData.length === 0) throw new Error("No suppliers created");
    
    const projects: ProjectInsert[] = [
      {
        name: "Aerospace Component X27",
        status: "in-progress",
        progress: 65,
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
        supplier_id: supplierData[0].id,
        location: "Chicago Assembly Plant",
        description: "Custom aerospace component for commercial aircraft navigation systems.",
        budget: 750000,
        project_manager: "Alex Johnson",
        manufacturing_manager: "Maria Garcia"
      },
      {
        name: "Electric Vehicle Battery Casing",
        status: "pending",
        progress: 10,
        start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        supplier_id: supplierData[1].id,
        location: "Berlin Production Facility",
        description: "Next-generation battery casing for electric vehicles with enhanced thermal management.",
        budget: 980000,
        project_manager: "Alex Johnson"
      },
      {
        name: "Precision Medical Devices",
        status: "delayed",
        progress: 40,
        start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        supplier_id: supplierData[2].id,
        location: "Tokyo Medical Manufacturing Center",
        description: "High-precision devices for non-invasive surgical procedures.",
        budget: 520000,
        project_manager: "Alex Johnson",
        manufacturing_manager: "Maria Garcia"
      },
      {
        name: "Industrial Robotics Arm",
        status: "completed",
        progress: 100,
        start_date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
        deadline: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        supplier_id: supplierData[3].id,
        location: "Toronto Automation Facility",
        description: "Advanced robotics arm with 6 degrees of freedom for industrial automation.",
        budget: 650000,
        project_manager: "Alex Johnson",
        manufacturing_manager: "Maria Garcia"
      }
    ];

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert(projects)
      .select();
      
    if (projectError) throw projectError;
    if (!projectData || projectData.length === 0) throw new Error("No projects created");

    // Create milestones for each project
    const milestones: MilestoneInsert[] = [];
    
    projectData.forEach(project => {
      const projectStart = new Date(project.start_date);
      const projectDeadline = new Date(project.deadline);
      const totalDays = (projectDeadline.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24);
      const interval = totalDays / 4; // Create 4 milestones per project
      
      for (let i = 0; i < 4; i++) {
        const dueDate = new Date(projectStart);
        dueDate.setDate(dueDate.getDate() + Math.round(interval * (i + 1)));
        
        milestones.push({
          project_id: project.id,
          title: `Milestone ${i + 1}: ${i === 0 ? "Design" : i === 1 ? "Prototype" : i === 2 ? "Testing" : "Final Approval"}`,
          due_date: dueDate.toISOString(),
          completed: project.status === 'completed' || (project.progress > (i + 1) * 25)
        });
      }
    });
    
    const { error: milestoneError } = await supabase
      .from('milestones')
      .insert(milestones);
      
    if (milestoneError) throw milestoneError;

    // Create purchase orders
    if (!clientData || clientData.length === 0) throw new Error("No clients created");
    
    const purchaseOrders: PurchaseOrderInsert[] = [];
    
    projectData.forEach((project, index) => {
      const parts = [
        "Frame Assembly",
        "Electronic Control Unit",
        "Sensor Array",
        "Power Supply Module",
        "Interface Components"
      ];
      
      // Create 2-3 POs per project
      const numPOs = 2 + (index % 2); // Either 2 or 3
      
      for (let i = 0; i < numPOs; i++) {
        const poCreatedDate = new Date(project.start_date);
        poCreatedDate.setDate(poCreatedDate.getDate() + (7 * i)); // Each PO a week apart
        
        const shipmentDate = project.status === 'completed' 
          ? new Date(poCreatedDate.getTime() + (30 * 24 * 60 * 60 * 1000)) 
          : project.status === 'in-progress' && i === 0 
          ? new Date(poCreatedDate.getTime() + (25 * 24 * 60 * 60 * 1000))
          : null;
        
        purchaseOrders.push({
          project_id: project.id,
          po_number: `PO-${project.id.substring(0, 8)}-${i + 1}`,
          part_name: parts[i % parts.length],
          quantity: 10 * (i + 1),
          supplier_id: project.supplier_id,
          client_id: clientData[index % clientData.length].id,
          client_name: clientData[index % clientData.length].name,
          placed_by: teamMemberData ? teamMemberData[i % teamMemberData.length].name : "System",
          status: project.status === 'completed' ? 'completed' : i === 0 ? 'active' : 'active',
          shipment_date: shipmentDate?.toISOString(),
          progress: project.status === 'completed' ? 100 : i === 0 ? 75 : 25,
          notes: `Order for ${parts[i % parts.length]} components`
        });
      }
    });
    
    const { error: poError } = await supabase
      .from('purchase_orders')
      .insert(purchaseOrders);
      
    if (poError) throw poError;

    // Create supplier comments
    const supplierComments: SupplierCommentInsert[] = [];
    
    supplierData.forEach(supplier => {
      // Add 2-4 comments per supplier
      const numComments = 2 + (Math.floor(Math.random() * 3));
      const commentTypes: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral'];
      
      for (let i = 0; i < numComments; i++) {
        const commentDate = new Date();
        commentDate.setDate(commentDate.getDate() - i * 15); // Each comment 15 days apart
        
        const commentType = commentTypes[i % commentTypes.length];
        let commentText = '';
        
        switch (commentType) {
          case 'positive':
            commentText = `Excellent quality and on-time delivery for recent order. ${supplier.name} consistently meets our expectations.`;
            break;
          case 'negative':
            commentText = `Delays in recent shipment caused production issues. Need to address quality control concerns with ${supplier.name}.`;
            break;
          case 'neutral':
            commentText = `Standard performance from ${supplier.name}. No significant issues but room for improvement in communication.`;
            break;
        }
        
        supplierComments.push({
          supplier_id: supplier.id,
          text: commentText,
          type: commentType,
          author: teamMemberData ? teamMemberData[i % teamMemberData.length].name : "System",
          date: commentDate.toISOString()
        });
      }
    });
    
    const { error: commentError } = await supabase
      .from('supplier_comments')
      .insert(supplierComments);
      
    if (commentError) throw commentError;

    // Create external links
    const externalLinks: ExternalLinkInsert[] = [];
    
    // Add some general links
    externalLinks.push({
      title: "Weekly Manufacturing Report - May 2025",
      url: "https://example.com/reports/manufacturing-may-2025",
      type: "weekly-report",
      description: "Comprehensive overview of manufacturing operations for May 2025",
      date_added: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    });
    
    externalLinks.push({
      title: "Supply Chain Analytics Dashboard",
      url: "https://example.com/analytics/supply-chain",
      type: "manufacturing-control",
      description: "Real-time analytics for supply chain management",
      date_added: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() // 12 days ago
    });
    
    // Add project-specific links
    projectData.forEach((project, index) => {
      const linkDate = new Date(project.start_date);
      linkDate.setDate(linkDate.getDate() + 7); // A week after project start
      
      externalLinks.push({
        title: `${project.name} - Design Specifications`,
        url: `https://example.com/projects/${project.id}/specs`,
        type: "manufacturing-control",
        project_id: project.id,
        description: "Detailed design specifications and technical requirements",
        date_added: linkDate.toISOString()
      });
      
      // Add a shipment tracking link for completed projects
      if (project.status === 'completed' || project.status === 'in-progress') {
        const shipmentDate = new Date(project.start_date);
        shipmentDate.setDate(shipmentDate.getDate() + 30); // 30 days after project start
        
        externalLinks.push({
          title: `${project.name} - Shipment Tracking`,
          url: `https://example.com/shipment/${project.id}`,
          type: "shipment",
          project_id: project.id,
          description: "Real-time tracking information for component shipment",
          date_added: shipmentDate.toISOString()
        });
      }
      
      // Add weekly report for each project
      const reportDate = new Date(project.start_date);
      reportDate.setDate(reportDate.getDate() + 14); // Two weeks after project start
      
      externalLinks.push({
        title: `${project.name} - Weekly Status Report`,
        url: `https://example.com/reports/weekly/${project.id}`,
        type: "weekly-report",
        project_id: project.id,
        description: "Weekly progress report with status updates and milestones",
        date_added: reportDate.toISOString()
      });
    });
    
    const { error: linkError } = await supabase
      .from('external_links')
      .insert(externalLinks);
      
    if (linkError) throw linkError;

    return { 
      success: true, 
      message: "Sample data generated successfully",
      counts: {
        suppliers: supplierData.length,
        clients: clientData.length,
        team_members: teamMemberData?.length || 0,
        projects: projectData.length,
        milestones: milestones.length,
        purchase_orders: purchaseOrders.length,
        supplier_comments: supplierComments.length,
        external_links: externalLinks.length
      }
    };
  } catch (error: any) {
    console.error("Error generating sample data:", error);
    return { success: false, message: error.message };
  }
}
