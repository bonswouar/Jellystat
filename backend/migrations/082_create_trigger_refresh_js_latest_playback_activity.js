exports.up = async function (knex) {
  try {
    await knex.schema.raw(`
      DROP TRIGGER IF EXISTS refresh_js_latest_playback_activity_trigger ON public.jf_playback_activity;

      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'refresh_js_latest_playback_activity') THEN
          CREATE TRIGGER refresh_js_latest_playback_activity_trigger
          AFTER INSERT OR UPDATE OR DELETE ON public.jf_playback_activity
          FOR EACH STATEMENT
          EXECUTE FUNCTION refresh_js_latest_playback_activity();
        END IF;
      END
      $$ LANGUAGE plpgsql;
    `);
  } catch (error) {
    console.error(error);
  }
};

exports.down = async function (knex) {
  try {
    await knex.schema.raw(`
    DROP TRIGGER IF EXISTS refresh_js_latest_playback_activity_trigger ON public.jf_playback_activity;`);
  } catch (error) {
    console.error(error);
  }
};
