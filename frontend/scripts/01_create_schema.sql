-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  role VARCHAR(20) DEFAULT 'student', -- 'student' or 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sleep entries table
CREATE TABLE sleep_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_jour DATE NOT NULL,
  heure_coucher TIME NOT NULL,
  heure_reveil TIME NOT NULL,
  humeur VARCHAR(20), -- 'excellent', 'bon', 'moyen', 'mauvais'
  fatigue INT, -- 1-10 scale
  commentaire TEXT,
  duree_heures DECIMAL(4,2), -- calculated: (heure_reveil - heure_coucher)
  qualite_score DECIMAL(5,2), -- calculated quality score
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT duree_valid CHECK (duree_heures >= 1 AND duree_heures <= 16),
  UNIQUE(user_id, date_jour)
);

-- Alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50), -- 'short_sleep', 'irregular', 'high_fatigue', etc.
  message TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'warning', -- 'info', 'warning', 'critical'
  is_viewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Advice Rules table
CREATE TABLE advice_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  condition_type VARCHAR(50), -- 'short_sleep', 'low_quality', 'high_fatigue', etc.
  message TEXT NOT NULL,
  priorite INT, -- priority level (1=highest)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_sleep_entries_user_date ON sleep_entries(user_id, date_jour);
CREATE INDEX idx_alerts_user_viewed ON alerts(user_id, is_viewed);
CREATE INDEX idx_alerts_created ON alerts(created_at);
