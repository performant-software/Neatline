<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Acl_Assert_RecordOwnership implements Zend_Acl_Assert_Interface
{


    /**
     * Grant access if the user owns the record or the parent exhibit.
     */
    public function assert(
        Zend_Acl $acl,
        Zend_Acl_Role_Interface $role = null,
        Zend_Acl_Resource_Interface $resource = null,
        $privilege = null
    ) {

        if (!($role instanceof User)) {
            return false;
        }

        $selfPriv = $privilege . 'Self';
        $allPriv  = $privilege . 'All';

        $allowedSelf = $acl->isAllowed($role, $resource, $selfPriv);
        $allowedAll  = $acl->isAllowed($role, $resource, $allPriv);

        // If the resource is a model instance, check that the user is allowed
        // to edit any instance, or, if not, that they own the instance.

        if ($resource instanceof Omeka_Record_AbstractRecord) {
            $ownsRecord = $this->_userOwnsRecord($role, $resource);
            return $allowedAll || ($allowedSelf && $ownsRecord);
        }

        // Otherwise, fall back on the generic privileges.

        else {
            return $allowedAll || $allowedSelf;
        }

    }


    /**
     * Does the user own the record?
     *
     * @param User $user The user.
     * @param NeatlineRecord $record The record.
     * @return boolean
     */
    private function _userOwnsRecord($user, $record)
    {
        $ownsRecord  = $record->isOwnedBy($user);
        $ownsExhibit = $record->getExhibit()->isOwnedBy($user);
        return $ownsRecord || $ownsExhibit;
    }


}
