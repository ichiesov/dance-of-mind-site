ALTER TABLE users
ADD COLUMN IF NOT EXISTS completed_quests TEXT[] DEFAULT '{}';

COMMENT ON COLUMN users.completed_quests IS 'Array of completed quest IDs';
