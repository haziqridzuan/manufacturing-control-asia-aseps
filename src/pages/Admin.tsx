
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ManageClients from '@/components/admin/ManageClients';
import ManageProjects from '@/components/admin/ManageProjects';
import ManageSuppliers from '@/components/admin/ManageSuppliers';
import SystemSettings from '@/components/admin/SystemSettings';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('clients');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="clients">Manage Clients</TabsTrigger>
          <TabsTrigger value="projects">Manage Projects</TabsTrigger>
          <TabsTrigger value="suppliers">Manage Suppliers</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Manage Clients</CardTitle>
              <CardDescription>Add, edit, or remove clients from the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <ManageClients />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
              <CardDescription>Add, edit, or remove projects from the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <ManageProjects />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Manage Suppliers</CardTitle>
              <CardDescription>Add, edit, or remove suppliers from the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <ManageSuppliers />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
