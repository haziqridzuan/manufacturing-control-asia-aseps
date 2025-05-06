
-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create default policies to allow all operations for now
-- These can be refined later for proper access control
CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations on external_links" ON public.external_links FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations on milestones" ON public.milestones FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations on projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations on purchase_orders" ON public.purchase_orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations on supplier_comments" ON public.supplier_comments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations on suppliers" ON public.suppliers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations on team_members" ON public.team_members FOR ALL TO authenticated USING (true);

-- Also allow public read access for now
CREATE POLICY "Allow public read on clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public read on external_links" ON public.external_links FOR SELECT USING (true);
CREATE POLICY "Allow public read on milestones" ON public.milestones FOR SELECT USING (true);
CREATE POLICY "Allow public read on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on purchase_orders" ON public.purchase_orders FOR SELECT USING (true);
CREATE POLICY "Allow public read on supplier_comments" ON public.supplier_comments FOR SELECT USING (true);
CREATE POLICY "Allow public read on suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Allow public read on team_members" ON public.team_members FOR SELECT USING (true);
