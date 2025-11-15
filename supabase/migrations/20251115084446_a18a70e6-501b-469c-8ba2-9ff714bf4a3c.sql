-- Global Finance System Database Schema

-- Currency exchange rates table
CREATE TABLE IF NOT EXISTS public.currency_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate NUMERIC(20, 6) NOT NULL,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_currency, to_currency, effective_date)
);

-- Organization settings
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  display_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  currency TEXT NOT NULL DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  tax_enabled BOOLEAN DEFAULT false,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  customer_type TEXT NOT NULL CHECK (customer_type IN ('business', 'individual', 'walk-in')),
  name TEXT NOT NULL,
  display_name TEXT,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_terms INTEGER DEFAULT 30,
  opening_balance NUMERIC(20, 2) DEFAULT 0,
  tax_id TEXT,
  portal_enabled BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  account_code TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'income', 'expense')),
  parent_account_id UUID REFERENCES public.chart_of_accounts(id),
  currency TEXT NOT NULL DEFAULT 'USD',
  opening_balance NUMERIC(20, 2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, account_code)
);

-- Items/Products
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  sku TEXT,
  category TEXT,
  description TEXT,
  unit_price NUMERIC(20, 2) NOT NULL DEFAULT 0,
  cost_price NUMERIC(20, 2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  tax_enabled BOOLEAN DEFAULT false,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  opening_stock NUMERIC(20, 2) DEFAULT 0,
  current_stock NUMERIC(20, 2) DEFAULT 0,
  reorder_level NUMERIC(20, 2) DEFAULT 0,
  warehouse TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock movements
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity NUMERIC(20, 2) NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  invoice_number TEXT NOT NULL,
  invoice_type TEXT NOT NULL CHECK (invoice_type IN ('business', 'individual', 'walk-in')),
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  subtotal NUMERIC(20, 2) DEFAULT 0,
  tax_amount NUMERIC(20, 2) DEFAULT 0,
  discount NUMERIC(20, 2) DEFAULT 0,
  transport_fee NUMERIC(20, 2) DEFAULT 0,
  other_charges NUMERIC(20, 2) DEFAULT 0,
  total NUMERIC(20, 2) DEFAULT 0,
  paid_amount NUMERIC(20, 2) DEFAULT 0,
  balance NUMERIC(20, 2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'partially_paid', 'paid', 'overdue', 'void')),
  notes TEXT,
  terms TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, invoice_number)
);

-- Invoice line items
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.items(id),
  description TEXT NOT NULL,
  quantity NUMERIC(20, 2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(20, 2) NOT NULL DEFAULT 0,
  tax_enabled BOOLEAN DEFAULT false,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  tax_amount NUMERIC(20, 2) DEFAULT 0,
  total NUMERIC(20, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.customer_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  invoice_id UUID REFERENCES public.invoices(id),
  payment_number TEXT NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(20, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'card', 'mobile_money')),
  reference TEXT,
  proof_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, payment_number)
);

-- Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_terms INTEGER DEFAULT 30,
  opening_balance NUMERIC(20, 2) DEFAULT 0,
  tax_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS public.purchase_orders_finance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  po_number TEXT NOT NULL,
  po_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_date DATE,
  currency TEXT NOT NULL DEFAULT 'USD',
  subtotal NUMERIC(20, 2) DEFAULT 0,
  tax_amount NUMERIC(20, 2) DEFAULT 0,
  total NUMERIC(20, 2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'received', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, po_number)
);

-- Purchase Order Items
CREATE TABLE IF NOT EXISTS public.po_items_finance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID NOT NULL REFERENCES public.purchase_orders_finance(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.items(id),
  description TEXT NOT NULL,
  quantity NUMERIC(20, 2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(20, 2) NOT NULL DEFAULT 0,
  tax_enabled BOOLEAN DEFAULT false,
  tax_rate NUMERIC(5, 2) DEFAULT 0,
  tax_amount NUMERIC(20, 2) DEFAULT 0,
  total NUMERIC(20, 2) DEFAULT 0,
  received_quantity NUMERIC(20, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- General Ledger
CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  account_id UUID NOT NULL REFERENCES public.chart_of_accounts(id),
  debit NUMERIC(20, 2) DEFAULT 0,
  credit NUMERIC(20, 2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  reference_type TEXT,
  reference_id UUID,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approval workflows
CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finance audit log
CREATE TABLE IF NOT EXISTS public.finance_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders_finance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_items_finance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own currency rates" ON public.currency_rates FOR ALL USING (true);

CREATE POLICY "Users can manage their organization" ON public.organizations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their customers" ON public.customers FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their chart of accounts" ON public.chart_of_accounts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their items" ON public.items FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their stock movements" ON public.stock_movements FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Users can manage their invoices" ON public.invoices FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage invoice items" ON public.invoice_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid())
);

CREATE POLICY "Users can manage their payments" ON public.customer_payments FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their suppliers" ON public.suppliers FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their purchase orders" ON public.purchase_orders_finance FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage PO items" ON public.po_items_finance FOR ALL USING (
  EXISTS (SELECT 1 FROM public.purchase_orders_finance WHERE purchase_orders_finance.id = po_items_finance.po_id AND purchase_orders_finance.user_id = auth.uid())
);

CREATE POLICY "Users can manage their ledger" ON public.ledger_entries FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their approvals" ON public.approvals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their audit logs" ON public.finance_audit_logs FOR SELECT USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_payments_updated_at BEFORE UPDATE ON public.customer_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_finance_updated_at BEFORE UPDATE ON public.purchase_orders_finance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_customers_currency ON public.customers(currency);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX idx_items_user_id ON public.items(user_id);
CREATE INDEX idx_items_currency ON public.items(currency);
CREATE INDEX idx_ledger_entries_user_id ON public.ledger_entries(user_id);
CREATE INDEX idx_ledger_entries_account_id ON public.ledger_entries(account_id);
CREATE INDEX idx_customer_payments_user_id ON public.customer_payments(user_id);
CREATE INDEX idx_customer_payments_invoice_id ON public.customer_payments(invoice_id);