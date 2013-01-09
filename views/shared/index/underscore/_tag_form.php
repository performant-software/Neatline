<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tag form underscore template.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<!-- Record edit form. -->
<script id="tag-form-template" type="text/templates">

  <!-- Close button. -->
  <?php echo $this->partial(
    'index/underscore/partials/_close_button.php'
  ); ?>

  <p class="lead" data-text="tag.tag | title"></p>

  <?php echo $this->partial(
    'index/underscore/helpers/_text_input.php', array(
      'name'  => 'tag',
      'label' => 'Name',
      'bind'  => 'tag.tag'
  )); ?>

  <fieldset class="properties">
    <legend>Active Properties</legend>
    <?php foreach (neatline_getStyles() as $col => $label): ?>
      <?php echo $this->partial(
        'index/underscore/helpers/_checkbox.php', array(
          'name'  => $col,
          'label' => $label,
          'bind'  => 'tag.'.$col
      )); ?>
    <?php endforeach; ?>
  </fieldset>

  <?php echo $this->partial(
    'index/underscore/partials/_form_menu.php'
  ); ?>

</script>
