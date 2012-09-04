<?php
/**
 * Create exhibit.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */
?>

<?php
queue_js('slugBuilder');
queue_js('_constructAdd');
queue_js('tiny_mce/tiny_mce');
?>

<?php
$title = __('Neatline | Create an Exhibit');
head(array('content_class' => 'neatline', 'title' => $title));
?>

<div id="primary">
    <?php echo flash(); ?>
    <?php echo $form; ?>
</div>

<script>
jQuery(document).ready(function($){
    Omeka.wysiwyg();
});
</script>

<?php
foot();
?>
