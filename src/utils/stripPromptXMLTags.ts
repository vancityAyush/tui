const STRIPPED_TAGS_RE =
  /<(commit_analysis|context|function_analysis|pr_analysis)>.*?<\/\1>\n?/gs

/**
 * Strips Claude-internal XML wrapper tags from prompt content before rendering.
 * Safe on plain text — returns input trimmed when no tags present.
 */
export function stripPromptXMLTags(content: string): string {
  return content.replace(STRIPPED_TAGS_RE, '').trim()
}
