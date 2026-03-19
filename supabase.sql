-- ============================================================================
-- AURA COSMETOLOGY - SUPABASE DATABASE MIGRATION
-- Complete CMS Backend for Dynamic Content Management
-- ============================================================================

-- =============================================================================
-- STEP 1: CREATE EXTENSIONS
-- =============================================================================
extension if not exists "uuid-ossp";

-- =============================================================================
-- STEP 2: SETTINGS TABLE (Singleton Configuration)
-- =============================================================================
create table if not exists public.settings (
    id integer primary key check (id = 1),
    clinic_name text not null default 'Aura Cosmetology',
    phone text not null default '+1 (555) 123-4567',
    email text not null default 'hello@auracosmetology.com',
    instagram text not null default '@aura.cosmetology',
    address text not null default '123 Beauty Lane, New York, NY 10001',
    working_hours text not null default 'Mon-Fri: 9AM - 7PM | Sat: 10AM - 5PM',
    logo_url text,
    favicon_url text,
    meta_title text default 'Aura Cosmetology | Premium Aesthetic Medicine',
    meta_description text default 'Experience the art of beauty at Aura Cosmetology. Premium aesthetic treatments tailored to your unique beauty.',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert default settings row (singleton pattern)
insert into public.settings (id, clinic_name, phone, email, instagram, address, working_hours)
values (1, 'Aura Cosmetology', '+1 (555) 123-4567', 'hello@auracosmetology.com', '@aura.cosmetology', '123 Beauty Lane, New York, NY 10001', 'Mon-Fri: 9AM - 7PM | Sat: 10AM - 5PM')
on conflict (id) do nothing;

-- =============================================================================
-- STEP 3: SITE_CONTENT TABLE (Dynamic Page Sections)
-- =============================================================================
create table if not exists public.site_content (
    id uuid primary key default uuid_generate_v4(),
    section_key text not null unique,
    title text not null default '',
    subtitle text default '',
    description text not null default '',
    extra_data jsonb default '{}'::jsonb,
    image_url text,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert default content sections
insert into public.site_content (section_key, title, subtitle, description, extra_data, sort_order)
values 
    -- HERO SECTION
    (
        'hero',
        'Reveal Your Natural Beauty',
        'Premium Aesthetic Medicine',
        'Experience the art of beauty with our cutting-edge treatments. Our expert team combines medical precision with artistic vision to enhance your natural glow.',
        '{
            "cta_primary": "Book Consultation",
            "cta_secondary": "Explore Services",
            "stats": [
                {"value": "15+", "label": "Years Experience"},
                {"value": "10K+", "label": "Happy Clients"},
                {"value": "50+", "label": "Expert Treatments"}
            ]
        }'::jsonb,
        1
    ),
    -- ABOUT SECTION
    (
        'about',
        'Where Science Meets Artistry',
        'About Aura Cosmetology',
        'Founded by leading aesthetic physicians, Aura Cosmetology represents the pinnacle of beauty innovation. We believe that true beauty emerges when cutting-edge medical science harmonizes with artistic vision. Our state-of-the-art facility features the latest FDA-approved technologies, administered by board-certified specialists who understand that every face tells a unique story. From subtle enhancements to transformative treatments, we craft personalized experiences that celebrate your individual beauty.',
        '{
            "features": [
                "Board-Certified Specialists",
                "FDA-Approved Technologies", 
                "Personalized Treatment Plans",
                "Luxury Comfort Experience"
            ],
            "quote": "Beauty is not about changing who you are, but revealing the best version of yourself."
        }'::jsonb,
        2
    ),
    -- SERVICES SECTION
    (
        'services',
        'Our Signature Treatments',
        'Premium Services',
        'Discover our comprehensive range of aesthetic treatments, each designed to address your unique beauty goals with precision and care.',
        '{
            "services": [
                {
                    "id": "injectables",
                    "name": "Injectables",
                    "description": "Botox, dermal fillers, and advanced injectable treatments for natural-looking rejuvenation.",
                    "icon": "syringe"
                },
                {
                    "id": "laser",
                    "name": "Laser Treatments",
                    "description": "State-of-the-art laser technology for skin resurfacing, hair removal, and pigmentation correction.",
                    "icon": "zap"
                },
                {
                    "id": "facials",
                    "name": "Medical Facials",
                    "description": "Clinical-grade facials combining medical expertise with spa-like luxury.",
                    "icon": "sparkles"
                },
                {
                    "id": "body",
                    "name": "Body Contouring",
                    "description": "Non-invasive body sculpting treatments for a refined silhouette.",
                    "icon": "target"
                }
            ]
        }'::jsonb,
        3
    ),
    -- CONTACT SECTION
    (
        'contact',
        'Begin Your Transformation',
        'Get In Touch',
        'Ready to discover your best self? Schedule a complimentary consultation with our expert team and start your journey to radiant confidence.',
        '{
            "form_title": "Send Us a Message",
            "form_subtitle": "We will respond within 24 hours",
            "map_embed_url": ""
        }'::jsonb,
        4
    ),
    -- TESTIMONIALS SECTION
    (
        'testimonials',
        'What Our Clients Say',
        'Client Stories',
        'Real results, real stories. Discover why thousands trust Aura Cosmetology with their aesthetic journey.',
        '{
            "testimonials": [
                {
                    "name": "Sarah Mitchell",
                    "role": "Fashion Editor",
                    "quote": "The team at Aura understood exactly what I wanted. Subtle, natural, and absolutely stunning results.",
                    "rating": 5
                },
                {
                    "name": "Jennifer Chen",
                    "role": "Business Executive",
                    "quote": "Professional, caring, and incredibly skilled. My confidence has never been higher.",
                    "rating": 5
                },
                {
                    "name": "Amanda Roberts",
                    "role": "Influencer",
                    "quote": "The attention to detail is unmatched. They truly treat every client like a work of art.",
                    "rating": 5
                }
            ]
        }'::jsonb,
        5
    )
on conflict (section_key) do nothing;

-- =============================================================================
-- STEP 4: ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on settings table
alter table public.settings enable row level security;

-- Enable RLS on site_content table
alter table public.site_content enable row level security;

-- =============================================================================
-- SETTINGS TABLE POLICIES
-- =============================================================================

-- Policy: Allow public SELECT (read-only for visitors)
create policy "Allow public read access on settings"
    on public.settings
    for select
    to anon, authenticated
    using (true);

-- Policy: Allow authenticated users to UPDATE (admin only)
create policy "Allow authenticated users to update settings"
    on public.settings
    for update
    to authenticated
    using (true)
    with check (true);

-- Policy: Prevent insert/delete (singleton pattern)
create policy "Prevent insert on settings"
    on public.settings
    for insert
    to authenticated
    with check (false);

create policy "Prevent delete on settings"
    on public.settings
    for delete
    to authenticated
    using (false);

-- =============================================================================
-- SITE_CONTENT TABLE POLICIES
-- =============================================================================

-- Policy: Allow public SELECT (read-only for visitors)
create policy "Allow public read access on site_content"
    on public.site_content
    for select
    to anon, authenticated
    using (true);

-- Policy: Allow authenticated users to UPDATE (admin only)
create policy "Allow authenticated users to update site_content"
    on public.site_content
    for update
    to authenticated
    using (true)
    with check (true);

-- Policy: Allow authenticated users to INSERT (admin only)
create policy "Allow authenticated users to insert site_content"
    on public.site_content
    for insert
    to authenticated
    with check (true);

-- Policy: Allow authenticated users to DELETE (admin only)
create policy "Allow authenticated users to delete site_content"
    on public.site_content
    for delete
    to authenticated
    using (true);

-- =============================================================================
-- STEP 5: AUTO-UPDATE TRIGGER FOR updated_at
-- =============================================================================
-- Function to auto-update the updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Trigger for settings table
drop trigger if exists update_settings_updated_at on public.settings;
create trigger update_settings_updated_at
    before update on public.settings
    for each row
    execute function public.update_updated_at_column();

-- Trigger for site_content table
drop trigger if exists update_site_content_updated_at on public.site_content;
create trigger update_site_content_updated_at
    before update on public.site_content
    for each row
    execute function public.update_updated_at_column();

-- =============================================================================
-- STEP 6: CREATE ADMIN USER (Run this after enabling Email auth in Supabase)
-- =============================================================================
-- Note: This should be run in Supabase Dashboard SQL Editor after setting up Email provider
-- The admin user credentials:
-- Email: andriimykolyshyn@gmail.com
-- Password: Andretanks2497!

-- To create the admin user via SQL (requires supabase_auth_admin privileges):
-- select auth.sign_up(
--     'andriimykolyshyn@gmail.com',
--     'Andretanks2497!'
-- );

-- Or use the Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Enter email: andriimykolyshyn@gmail.com
-- 4. Enter password: Andretanks2497!
-- 5. Click "Create User"

-- =============================================================================
-- VERIFICATION QUERIES (Run these to verify setup)
-- =============================================================================

-- Verify settings table
-- select * from public.settings;

-- Verify site_content table
-- select section_key, title, subtitle from public.site_content order by sort_order;

-- Verify RLS policies
-- select tablename, policyname, permissive, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename in ('settings', 'site_content');
