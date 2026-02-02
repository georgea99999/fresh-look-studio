-- Create stock_items table for inventory
CREATE TABLE public.stock_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  box TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usage_history table for tracking stock usage
CREATE TABLE public.usage_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  box TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom_boxes table for user-defined box names
CREATE TABLE public.custom_boxes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_boxes ENABLE ROW LEVEL SECURITY;

-- Create public read/write policies (no auth required for this inventory app)
-- Stock items policies
CREATE POLICY "Allow public read access to stock_items"
  ON public.stock_items FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to stock_items"
  ON public.stock_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to stock_items"
  ON public.stock_items FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access to stock_items"
  ON public.stock_items FOR DELETE
  USING (true);

-- Usage history policies
CREATE POLICY "Allow public read access to usage_history"
  ON public.usage_history FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to usage_history"
  ON public.usage_history FOR INSERT
  WITH CHECK (true);

-- Custom boxes policies
CREATE POLICY "Allow public read access to custom_boxes"
  ON public.custom_boxes FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to custom_boxes"
  ON public.custom_boxes FOR INSERT
  WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on stock_items
CREATE TRIGGER update_stock_items_updated_at
  BEFORE UPDATE ON public.stock_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for stock_items so changes sync across devices
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_items;