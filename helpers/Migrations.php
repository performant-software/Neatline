<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Run the 2.0+ migrations.
 *
 * @param string $old The version being upgraded from.
 */
function nl_run2xMigrations($old) {

    if (version_compare($old, '2.0-alpha2', '<')) {
        new Neatline_Migration_20alpha2();
    }

    if (version_compare($old, '2.0-rc1', '<')) {
        new Neatline_Migration_20rc1();
    }

    if (version_compare($old, '2.0-rc3', '<')) {
        new Neatline_Migration_20rc3();
    }

    if (version_compare($old, '2.0-rc4', '<')) {
        new Neatline_Migration_20rc4();
    }

    if (version_compare($old, '2.0.2', '<')) {
        new Neatline_Migration_202();
    }

    if (version_compare($old, '2.1.2', '<')) {
        new Neatline_Migration_212();
    }

    if (version_compare($old, '2.2.0', '<')) {
        new Neatline_Migration_220();
    }

}
