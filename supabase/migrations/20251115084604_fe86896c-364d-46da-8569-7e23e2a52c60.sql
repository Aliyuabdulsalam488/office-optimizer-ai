-- Fix function search path security warning
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;

-- Recreate triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_payments_updated_at BEFORE UPDATE ON public.customer_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_finance_updated_at BEFORE UPDATE ON public.purchase_orders_finance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_currency_rates_updated_at BEFORE UPDATE ON public.currency_rates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();