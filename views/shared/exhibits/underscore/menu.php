<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="exhibit-menu-template" type="text/template">

  <!-- Back to Omeka. -->
  <a class="back" href="<?php echo url('neatline');?>">
    &larr; Back to Omeka
  </a>

  <!-- Exhibit title. -->
  <p class="lead"><?php echo nl_getExhibitField('title'); ?></p>

  <!-- Main navigation. -->
  <ul class="nav nav-pills">

    <li class="tab" data-slug="records">
      <a href="#browse">
        <span class="glyphicon glyphicon-list"></span>
        Records
      </a>
    </li>
    <li class="tab" data-slug="styles">
      <a href="#styles">
        <span class="glyphicon glyphicon-cog"></span>
        Styles
      </a>
    </li>

    <!-- Widget tabs. -->
    <?php echo $this->partial(
      'exhibits/underscore/partials/exhibit_tabs.php'
    ); ?>

  </ul>

</script>
