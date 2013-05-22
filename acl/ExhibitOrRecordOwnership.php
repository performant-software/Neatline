<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Acl_Assert_ExhibitOrRecordOwnership
    implements Zend_Acl_Assert_Interface
{


    /**
     * Grant access if the user owns the record or the parent exhibit.
     */
    public function assert(
        Zend_Acl $acl,
        Zend_Acl_Role_Interface $role = null,
        Zend_Acl_Resource_Interface $resource = null,
        $privilege = null
    )
    {

        $allPriv = $privilege . 'All';
        $selfPriv = $privilege . 'Self';

        if (!($role instanceof User)) return false;

        else {
            return $acl->isAllowed($role, $resource, $allPriv) || (
                $acl->isAllowed($role, $resource, $selfPriv) &&
                $this->_userOwnsRecord($role, $resource)
            );
        }
        
    }

    /**
     * Does the user own the record or the exhibit?
     */
    private function _userOwnsRecord($user, $record)
    {
        return $record->getExhibit()->isOwnedBy($user) ||
            $record->isOwnedBy($user);
    }


}
