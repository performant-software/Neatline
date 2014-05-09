<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Load and translate strings from `strings.json`.
 *
 * @param string $file The location of the `strings.json` file.
 * @return array An array of strings for the front-end application.
 */
function nl_getStrings($file)
{

    // Load the `strings.json` file.
    $strings = Zend_Json::decode(file_get_contents($file));

    // Translate the string values.
    array_walk_recursive($strings, 'nl_translate');

    return $strings;

}


/**
 * Translate an individual string. Used as a callback to translate all of the
 * strings in the array derived from the `strings.json` file in-place.
 *
 * @param string $string The string to be translated, passed by reference.
 */
function nl_translate(&$string)
{
    $string = __($string);
}


/**
 * Load Markdown content for editor input help modals.
 *
 * @return array An array of name => Markdown.
 */
function nl_getInputModals()
{

    $docs = array();

    // Walk all Markdown files.
    foreach (glob(NL_DIR.'/docs/html/*.html') as $file) {
        $docs[basename($file, '.html')] = file_get_contents($file);
    }

    return $docs;

}
