<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Define a two-tiered ACL:
 *
 *  - Contributors can create/update/delete their own exhibits and records
 *  inside their own exhibits. They can also update and delete records in
 *  their own exhibits that were created by other users.
 *
 *  - Supers and Admins can do everything.
 *
 * @param string $list A comma-delimited list.
 */
function nl_defineAcl($acl)
{


    // Register resources.
    if (!$acl->has('Neatline_Exhibits')) {
        $acl->addResource('Neatline_Exhibits');
    }
    if (!$acl->has('Neatline_Records')) {
        $acl->addResource('Neatline_Records');
    }


    // Public:
    // --------------------------------------------------------------------

    // Anyone can view exhibits.
    $acl->allow(null, 'Neatline_Exhibits', array(
        'index',
        'show',
        'browse',
        'get'
    ));

    // Anyone can view records.
    $acl->allow(null, 'Neatline_Records', array(
        'index',
        'list',
        'get'
    ));


    // Contributor:
    // --------------------------------------------------------------------

    // Contributors can add and delete-confirm exhibits.
    $acl->allow('contributor', 'Neatline_Exhibits', array(
        'add', 'delete-confirm'
    ));

    // Contributors can edit their own exhibits.
    $acl->allow('contributor', 'Neatline_Exhibits', array(
        'showNotPublic',
        'editSelf',
        'editorSelf',
        'putSelf',
        'importSelf',
        'deleteSelf'
    ));
    $acl->allow('contributor', 'Neatline_Exhibits', array(
        'edit',
        'editor',
        'put',
        'import',
        'delete'
    ), new Omeka_Acl_Assert_Ownership);

    // Contributors can create their own records.
    $acl->allow('contributor', 'Neatline_Records', 'post');

    // Contributors can edit/elete their own records.
    $acl->allow('contributor', 'Neatline_Records', array(
        'putSelf',
        'deleteSelf'
    ));
    $acl->allow('contributor', 'Neatline_Records', array(
        'put',
        'delete'
    ), new Neatline_Acl_Assert_RecordOwnership);


    // Super and Admin:
    // --------------------------------------------------------------------

    // Supers and admins can do everything.
    $acl->allow(array('super', 'admin'), 'Neatline_Exhibits');
    $acl->allow(array('super', 'admin'), 'Neatline_Records');

}
