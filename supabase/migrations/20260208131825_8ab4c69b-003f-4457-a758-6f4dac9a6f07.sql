-- Add user_id column to stock_items
ALTER TABLE public.stock_items 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to usage_history
ALTER TABLE public.usage_history 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to custom_boxes
ALTER TABLE public.custom_boxes 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing public policies on stock_items
DROP POLICY IF EXISTS "Allow public read access to stock_items" ON public.stock_items;
DROP POLICY IF EXISTS "Allow public insert access to stock_items" ON public.stock_items;
DROP POLICY IF EXISTS "Allow public update access to stock_items" ON public.stock_items;
DROP POLICY IF EXISTS "Allow public delete access to stock_items" ON public.stock_items;

-- Create user-scoped policies for stock_items
CREATE POLICY "Users can view their own stock items"
ON public.stock_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stock items"
ON public.stock_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stock items"
ON public.stock_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stock items"
ON public.stock_items FOR DELETE
USING (auth.uid() = user_id);

-- Drop existing public policies on usage_history
DROP POLICY IF EXISTS "Allow public read access to usage_history" ON public.usage_history;
DROP POLICY IF EXISTS "Allow public insert access to usage_history" ON public.usage_history;

-- Create user-scoped policies for usage_history
CREATE POLICY "Users can view their own usage history"
ON public.usage_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage history"
ON public.usage_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Drop existing public policies on custom_boxes
DROP POLICY IF EXISTS "Allow public read access to custom_boxes" ON public.custom_boxes;
DROP POLICY IF EXISTS "Allow public insert access to custom_boxes" ON public.custom_boxes;

-- Create user-scoped policies for custom_boxes
CREATE POLICY "Users can view their own custom boxes"
ON public.custom_boxes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom boxes"
ON public.custom_boxes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom boxes"
ON public.custom_boxes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom boxes"
ON public.custom_boxes FOR DELETE
USING (auth.uid() = user_id);