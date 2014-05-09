<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<a class="btn btn-default btn-xs"

  <?php if (isset($name)): ?>
    name="<?php echo $name; ?>"
  <?php endif; ?>

>
  <?php echo $text; ?>
</a>

<!-- Help modal link. -->
<?php if (isset($modal)): ?>
  <?php echo common('neatline/help', array(
    'modal' => $modal, 'text' => '?'
  )); ?>
<?php endif; ?>
