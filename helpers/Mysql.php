<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Form the database expression to set a coverage field, reverting to the de-
 * factor null `POINT(0 0)` if the WKT string is null.
 *
 * @param string $coverage The raw WKT value.
 * @return Zend_Db_Expr The expression.
 */
function nl_setGeometry($coverage)
{
	$coverage_or_default = $coverage ?: "POINT(0 0)";
    return new Zend_Db_Expr("COALESCE(
        GeomFromText('{$coverage_or_default}'), GeomFromText('POINT(0 0)')
    )");
}


/**
 * Form the database expression to select a GEOMETRY field as plain-text.
 *
 * @param string $column The table column.
 * @return Zend_Db_Expr The expression.
 */
function nl_getGeometry($column)
{
    return new Zend_Db_Expr('NULLIF(AsText(coverage), "POINT(0 0)")');
}
