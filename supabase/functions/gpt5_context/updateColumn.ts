import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

/**
 * Updates a column in a specified table with the analysis result.
 * 
 * Primary use case: Update "gpt_5_context" column in "test_logs" table
 * with the contextual analysis JSON.
 */
export async function updateColumn(
  supabase: SupabaseClient,
  params: {
    table: string;
    id_column: string;
    id_value: string | number;
    target_column: string;
    value: unknown;
  }
) {
  const { error } = await supabase
    .from(params.table)
    .update({ [params.target_column]: params.value })
    .eq(params.id_column, params.id_value);

  if (error) {
    console.error(`Failed to update ${params.table}.${params.target_column}:`, error);
    throw error;
  }

  console.log(
    `✓ Updated ${params.table}.${params.target_column} for ${params.id_column}=${params.id_value}`
  );
}

