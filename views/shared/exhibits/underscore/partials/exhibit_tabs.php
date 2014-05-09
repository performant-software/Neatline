<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php $tabs = nl_getExhibitTabs(nl_getExhibit());
  if (count($tabs) > 0): ?>

  <li class="dropdown plugins">

    <!-- Dropdown. -->
    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
      Plugins <b class="caret"></b>
    </a>

    <ul class="dropdown-menu">
      <?php foreach ($tabs as $label => $slug): ?>

        <!-- Tabs. -->
        <li class="tab" data-slug="<?php echo $slug; ?>">
          <a href="#<?php echo $slug; ?>"><?php echo $label; ?></a>
        </li>

      <?php endforeach; ?>
    </ul>

  </li>

<?php endif; ?>
