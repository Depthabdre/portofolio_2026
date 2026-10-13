type DatabaseError = { code?: string };

export function isSchemaSetupError(error: DatabaseError) {
  return ["PGRST205", "42P01", "PGRST204", "42703"].includes(error.code || "");
}

export function schemaSetupMessage(errors: DatabaseError[]) {
  if (
    errors.some((error) => ["PGRST205", "42P01"].includes(error.code || ""))
  ) {
    return "The journal tables are not available. Run supabase/schema.sql in the Supabase project configured for this site. If the tables already exist, reload the API schema cache and refresh.";
  }
  return "The journal database needs an update. Run supabase/migrations/202610210001_journal_studio.sql, then refresh.";
}
