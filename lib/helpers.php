<?php
/**
 *
 * Helper functions
 *
 * @package Tofino
 * @since 1.0.0
 */

namespace Tofino\Helpers;

/**
 * Gets the page name
 *
 * Looks up the pagename (slug). If not found in the query_var it uses the $page_id
 * if passed or falls back to the get_the_ID() function. Used by templates.
 *
 * @since 1.0.0
 *
 * @global string $pagename The pagename string (slug) from the query_var
 *
 * @param integer $page_id The id of the page
 * @return string pagename (slug)
 */
function get_page_name($page_id = null) {
  global $pagename;
  if (!$pagename) { // Not found in the query_var. Permalinks is probably not enabled.
    global $wp_query;
    $page_id  = ($page_id ? $page_id : get_the_ID());
    $post     = $wp_query->get_queried_object();
    $pagename = $post->post_name;
  }
  return $pagename;
}
