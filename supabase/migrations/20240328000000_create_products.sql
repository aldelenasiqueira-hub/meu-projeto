-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  badge TEXT,
  cost DECIMAL(10, 2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read products
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Create policy to allow all users to insert/update/delete (for demo purposes)
-- In a real app, you'd restrict this to authenticated users or specific roles
CREATE POLICY "Allow public full access" ON products
  FOR ALL USING (true) WITH CHECK (true);
