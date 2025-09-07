-- Database size monitoring function for auto-migration
CREATE OR REPLACE FUNCTION get_database_size()
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT pg_database_size(current_database())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if database size exceeds threshold (300MB)
CREATE OR REPLACE FUNCTION should_auto_migrate()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT pg_database_size(current_database()) > (300 * 1024 * 1024)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user count for migration planning
CREATE OR REPLACE FUNCTION get_active_users_count()
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT user_id) 
    FROM projects 
    WHERE created_at > NOW() - INTERVAL '30 days'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_database_size() TO authenticated;
GRANT EXECUTE ON FUNCTION should_auto_migrate() TO authenticated;
GRANT EXECUTE ON FUNCTION get_active_users_count() TO authenticated;
