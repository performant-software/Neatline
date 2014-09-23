<?php

/**
 * Helper classes for validations
 *
 * @category   Utilities
 * @package    Omeka
 * @subpackage Neatline
 * @author     Scholars' Lab <scholarslab@virginia.edu>
 * @copyright  2014 Rector and Board of Visitors, University of Virginia
 * @license    http://www.apache.org/licenses/LICENSE-2.0.html Apache 2
 */
class Validator
{

    /**
     * Tests if a given string contains valid WKT
     *
     * @param string $coverage Coverage string to test.
     * @return boolean True if the coverage is WKT.
     */
    static function isValidWkt($coverage)
    {

        $parts = array(
            'point',
            'linestring',
            'polygon',
            'multipoint',
            'multilinestring',
            'multipolygon',
            'geometrycollection'
        );

        return (bool) preg_match(
            '/^\s*('.implode('|', $parts).')/',
            strtolower($coverage)
        );

    }


}
