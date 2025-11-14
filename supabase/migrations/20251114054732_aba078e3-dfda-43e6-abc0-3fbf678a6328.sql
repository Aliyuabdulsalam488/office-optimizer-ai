-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  tin TEXT,
  bank_details JSONB,
  category TEXT,
  status TEXT DEFAULT 'active',
  performance_rating INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vendors" ON public.vendors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Finance and procurement can manage vendors" ON public.vendors FOR ALL TO authenticated 
USING (has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create vendor attachments table
CREATE TABLE public.vendor_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.vendor_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view vendor attachments" ON public.vendor_attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Finance and procurement can manage attachments" ON public.vendor_attachments FOR ALL TO authenticated 
USING (has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create purchase requests table
CREATE TABLE public.purchase_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pr_number TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  requested_by UUID REFERENCES auth.users(id),
  requested_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'draft',
  description TEXT,
  justification TEXT,
  total_amount NUMERIC(15,2) DEFAULT 0,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own PRs" ON public.purchase_requests FOR SELECT TO authenticated USING (requested_by = auth.uid() OR has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create PRs" ON public.purchase_requests FOR INSERT TO authenticated WITH CHECK (requested_by = auth.uid());
CREATE POLICY "Users can update their draft PRs" ON public.purchase_requests FOR UPDATE TO authenticated USING (requested_by = auth.uid() AND status = 'draft');
CREATE POLICY "Procurement can manage all PRs" ON public.purchase_requests FOR ALL TO authenticated USING (has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create PR items table
CREATE TABLE public.pr_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pr_id UUID REFERENCES public.purchase_requests(id) ON DELETE CASCADE,
  item_description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  estimated_unit_price NUMERIC(15,2),
  estimated_total NUMERIC(15,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pr_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view PR items" ON public.pr_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.purchase_requests WHERE id = pr_items.pr_id AND 
    (requested_by = auth.uid() OR has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role)))
);
CREATE POLICY "Users can manage their PR items" ON public.pr_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.purchase_requests WHERE id = pr_items.pr_id AND 
    (requested_by = auth.uid() OR has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role)))
);

-- Create purchase orders table
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  pr_id UUID REFERENCES public.purchase_requests(id),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  po_date DATE DEFAULT CURRENT_DATE,
  delivery_date DATE,
  status TEXT DEFAULT 'draft',
  subtotal NUMERIC(15,2) DEFAULT 0,
  tax NUMERIC(15,2) DEFAULT 0,
  discount NUMERIC(15,2) DEFAULT 0,
  total NUMERIC(15,2) DEFAULT 0,
  notes TEXT,
  terms_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view POs" ON public.purchase_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Procurement can manage POs" ON public.purchase_orders FOR ALL TO authenticated 
USING (has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create PO items table
CREATE TABLE public.po_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  item_description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(15,2) NOT NULL,
  total NUMERIC(15,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.po_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view PO items" ON public.po_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Procurement can manage PO items" ON public.po_items FOR ALL TO authenticated 
USING (has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create goods received notes table
CREATE TABLE public.goods_received_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grn_number TEXT UNIQUE NOT NULL,
  po_id UUID REFERENCES public.purchase_orders(id),
  received_date DATE DEFAULT CURRENT_DATE,
  received_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.goods_received_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view GRNs" ON public.goods_received_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Procurement can manage GRNs" ON public.goods_received_notes FOR ALL TO authenticated 
USING (has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create GRN items table
CREATE TABLE public.grn_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grn_id UUID REFERENCES public.goods_received_notes(id) ON DELETE CASCADE,
  po_item_id UUID REFERENCES public.po_items(id),
  received_quantity NUMERIC(10,2) NOT NULL,
  qa_status TEXT DEFAULT 'pending',
  qa_notes TEXT,
  inspector_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.grn_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view GRN items" ON public.grn_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Procurement can manage GRN items" ON public.grn_items FOR ALL TO authenticated 
USING (has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create supplier invoices table
CREATE TABLE public.supplier_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  po_id UUID REFERENCES public.purchase_orders(id),
  vendor_id UUID REFERENCES public.vendors(id),
  invoice_date DATE NOT NULL,
  due_date DATE,
  amount NUMERIC(15,2) NOT NULL,
  tax NUMERIC(15,2) DEFAULT 0,
  total NUMERIC(15,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  uploaded_file_url TEXT,
  validated_by UUID REFERENCES auth.users(id),
  validated_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.supplier_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view invoices" ON public.supplier_invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Finance can manage invoices" ON public.supplier_invoices FOR ALL TO authenticated 
USING (has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'procurement_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT UNIQUE NOT NULL,
  invoice_id UUID REFERENCES public.supplier_invoices(id),
  vendor_id UUID REFERENCES public.vendors(id),
  payment_date DATE NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  payment_method TEXT,
  bank_reference TEXT,
  paid_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view payments" ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Finance can manage payments" ON public.payments FOR ALL TO authenticated 
USING (has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create budgets table
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department TEXT NOT NULL,
  fiscal_year INTEGER NOT NULL,
  total_budget NUMERIC(15,2) NOT NULL,
  committed_spend NUMERIC(15,2) DEFAULT 0,
  actual_spend NUMERIC(15,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(department, fiscal_year)
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view budgets" ON public.budgets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Finance can manage budgets" ON public.budgets FOR ALL TO authenticated 
USING (has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create budget items table
CREATE TABLE public.budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES public.budgets(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  allocated_amount NUMERIC(15,2) NOT NULL,
  spent_amount NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view budget items" ON public.budget_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Finance can manage budget items" ON public.budget_items FOR ALL TO authenticated 
USING (has_role(auth.uid(), 'finance_manager'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create procurement audit logs table
CREATE TABLE public.procurement_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.procurement_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON public.procurement_audit_logs FOR SELECT TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'finance_manager'::app_role));
CREATE POLICY "System can insert audit logs" ON public.procurement_audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_purchase_requests_updated_at BEFORE UPDATE ON public.purchase_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_supplier_invoices_updated_at BEFORE UPDATE ON public.supplier_invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_vendors_status ON public.vendors(status);
CREATE INDEX idx_purchase_requests_status ON public.purchase_requests(status);
CREATE INDEX idx_purchase_requests_requested_by ON public.purchase_requests(requested_by);
CREATE INDEX idx_purchase_orders_status ON public.purchase_orders(status);
CREATE INDEX idx_purchase_orders_vendor_id ON public.purchase_orders(vendor_id);
CREATE INDEX idx_supplier_invoices_status ON public.supplier_invoices(status);
CREATE INDEX idx_supplier_invoices_vendor_id ON public.supplier_invoices(vendor_id);
CREATE INDEX idx_payments_vendor_id ON public.payments(vendor_id);