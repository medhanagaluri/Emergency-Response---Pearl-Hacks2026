-- EcoPulse Database Schema
-- Emergency Response Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- INCIDENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('fire', 'flood', 'earthquake', 'storm', 'accident', 'other')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'in-progress', 'resolved', 'rejected')),
    location TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT NOT NULL,
    reported_by VARCHAR(255),
    verified_by VARCHAR(255),
    media TEXT[], -- Array of media URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_incidents_type ON incidents(type);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX idx_incidents_location ON incidents USING GIST (
    ll_to_earth(latitude::float8, longitude::float8)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- =====================================================
-- ALERTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    area TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_alerts_is_active ON alerts(is_active);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);

-- =====================================================
-- RESOURCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    steps TEXT[] NOT NULL, -- Array of safety steps
    external_links JSONB DEFAULT '[]', -- Array of {title, url} objects
    downloadable_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_resources_type ON resources(type);

-- =====================================================
-- USERS TABLE (optional - for authentication)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    phone VARCHAR(20),
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    notification_preferences JSONB DEFAULT '{"push": true, "email": true, "sms": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- NOTIFICATIONS TABLE (optional - for tracking sent notifications)
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('push', 'email', 'sms')),
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_incidents_updated_at
    BEFORE UPDATE ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on tables
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read access to incidents and alerts (adjust as needed)
CREATE POLICY "Public incidents read access" ON incidents
    FOR SELECT USING (true);

CREATE POLICY "Public alerts read access" ON alerts
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public resources read access" ON resources
    FOR SELECT USING (true);

-- Users can insert incidents (reporting)
CREATE POLICY "Users can report incidents" ON incidents
    FOR INSERT WITH CHECK (true);

-- Only admins can update/delete (you'll need to implement auth)
-- CREATE POLICY "Admins can update incidents" ON incidents
--     FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- SEED DATA - Safety Resources
-- =====================================================

INSERT INTO resources (type, title, description, steps, external_links) VALUES
('fire', 'Fire Safety Guidelines', 'Essential steps to take during a fire emergency', 
    ARRAY[
        'Alert others and activate fire alarm',
        'If fire is small, use fire extinguisher (P.A.S.S. method)',
        'Evacuate immediately if fire is spreading',
        'Stay low to avoid smoke inhalation',
        'Feel doors before opening - if hot, use alternate exit',
        'Never use elevators during fire',
        'Meet at designated assembly point',
        'Call 911 once safely outside'
    ],
    '[{"title": "Red Cross Fire Safety", "url": "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/fire.html"}]'::jsonb
),
('flood', 'Flood Safety Guidelines', 'Critical actions during flood situations',
    ARRAY[
        'Move to higher ground immediately',
        'Avoid walking through moving water',
        'Do not drive through flooded areas',
        'Turn off utilities if instructed',
        'Monitor weather alerts continuously',
        'Prepare emergency kit with essentials',
        'Stay away from electrical equipment if wet',
        'Wait for official all-clear before returning'
    ],
    '[{"title": "FEMA Flood Safety", "url": "https://www.fema.gov/disaster/how-to-prepare/floods"}]'::jsonb
),
('earthquake', 'Earthquake Safety Guidelines', 'How to protect yourself during an earthquake',
    ARRAY[
        'DROP, COVER, and HOLD ON',
        'If indoors, stay inside - get under sturdy furniture',
        'If outdoors, move away from buildings and power lines',
        'If in vehicle, pull over and stay inside',
        'Stay away from windows and heavy objects',
        'After shaking stops, check for injuries',
        'Expect aftershocks',
        'Exit building only if safe - use stairs, not elevators'
    ],
    '[{"title": "USGS Earthquake Safety", "url": "https://www.usgs.gov/natural-hazards/earthquake-hazards/science/earthquake-safety"}]'::jsonb
),
('general', 'Emergency Preparedness', 'General emergency preparedness tips',
    ARRAY[
        'Create an emergency kit with water, food, and supplies',
        'Make a family communication plan',
        'Know evacuation routes in your area',
        'Keep important documents in waterproof container',
        'Maintain list of emergency contacts',
        'Stay informed through local news and alerts',
        'Practice emergency drills regularly',
        'Help neighbors who may need assistance'
    ],
    '[{"title": "Ready.gov", "url": "https://www.ready.gov"}]'::jsonb
);

-- =====================================================
-- VIEWS FOR ANALYTICS (optional)
-- =====================================================

CREATE OR REPLACE VIEW incident_stats AS
SELECT 
    type,
    severity,
    status,
    COUNT(*) as count,
    MIN(created_at) as first_reported,
    MAX(created_at) as last_reported
FROM incidents
GROUP BY type, severity, status;

CREATE OR REPLACE VIEW daily_incidents AS
SELECT 
    DATE(created_at) as date,
    type,
    COUNT(*) as count
FROM incidents
GROUP BY DATE(created_at), type
ORDER BY date DESC;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE incidents IS 'Stores reported emergency incidents';
COMMENT ON TABLE alerts IS 'System-wide emergency alerts';
COMMENT ON TABLE resources IS 'Safety resources and guidelines';
COMMENT ON TABLE users IS 'User accounts and preferences';
COMMENT ON TABLE notifications IS 'Notification tracking';
