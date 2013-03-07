<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Widget tabs.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php if (_nl_exhibit()->widgets): ?>
  <li class="dropdown plugins">

    <!-- Dropdown. -->
    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
      Plugins <b class="caret"></b>
    </a>

    <ul class="dropdown-menu">
      <?php foreach (_nl_getWidgets() as $label => $widget): ?>
        <?php if (_nl_exhibit()->hasWidget($widget['id'])): ?>

          <!-- Tabs. -->
          <li class="tab">
            <a
              data-slug="<?php echo $widget['slug']; ?>"
              href="#record-<?php echo $widget['slug']; ?>"
              data-toggle="tab"
            ><?php echo $label; ?></a>
          </li>

        <?php endif; ?>
      <?php endforeach; ?>
    </ul>

  </li>
<?php endif; ?>
