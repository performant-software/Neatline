<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form plugin tabs.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<?php if (_nl_getRecordTabs()): ?>

  <li class="dropdown">

    <!-- Dropdown button. -->
    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
      Plugins <b class="caret"></b>
    </a>

    <ul class="dropdown-menu">
      <?php foreach (_nl_getRecordTabs() as $label => $data): ?>

        <!-- Dropdown items. -->
        <li class="tab">
          <a data-slug="<?php echo $data['slug']; ?>"
            href="#record-<?php echo $data['slug']; ?>"
            data-toggle="tab"
          ><?php echo $label; ?></a>
        </li>

      <?php endforeach; ?>
    </ul>

  </li>

<?php endif; ?>
