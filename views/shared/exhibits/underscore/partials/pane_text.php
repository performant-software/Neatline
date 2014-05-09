<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<legend>Text Description</legend>

<?php echo common('neatline/input', array(
    'name'  => 'slug',
    'modal' => 'slug',
    'label' => 'Slug',
    'bind'  => 'record:slug'
)); ?>

<?php echo common('neatline/textarea', array(
    'id'    => 'title',
    'name'  => 'title',
    'modal' => 'title',
    'label' => 'Title',
    'bind'  => 'record:title',
    'editHtml' => 'title'
)); ?>

<?php echo common('neatline/textarea', array(
    'id'    => 'body',
    'name'  => 'body',
    'modal' => 'body',
    'label' => 'Body',
    'bind'  => 'record:body',
    'editHtml' => 'body'
)); ?>
