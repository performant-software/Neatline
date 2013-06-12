<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php
  echo head(array(
    'title' => __('Neatline | Browse Exhibits'),
    'content_class' => 'neatline'
  ));
  echo flash();
?>

<div id="primary">

  <?php if(nl_exhibitsHaveBeenCreated()): ?>

  <a class="add small green button"
    href="<?php echo url('neatline/add'); ?>">
    <?php echo __('Create an Exhibit'); ?>
  </a>

  <table class="neatline">

    <thead>
      <tr>
        <?php echo browse_sort_links(array(
            __('Exhibit')   => null,
            __('Modified')  => null,
            __('# Items')   => null,
            __('Public')    => null
        ), array('link_tag' => 'th scope="col"'
        )); ?>
      </tr>
    </thead>

  <!-- Top pagination. -->
  <div class="pagination"><?php echo pagination_links(); ?></div>

    <tbody>

      <?php foreach (loop('NeatlineExhibit') as $e): ?>
      <tr>

        <!-- Exhibit -->
        <td class="title">

          <?php echo nl_getExhibitLink(
            $e, 'editor', null,
            array('class' => 'editor'), false
          );?>

          <ul class="action-links group">
            <li>
              <?php echo nl_getExhibitLink(
                $e, 'show', __('Public View'),
                array('class' => 'public'), true
              );?>
            </li>
            <li>
              <?php echo nl_getExhibitLink(
                $e, 'edit', __('Exhibit Settings'),
                array('class' => 'edit'), false
              );?>
            </li>
            <li>
              <?php echo nl_getExhibitLink(
                $e, 'import', __('Import Items'),
                array('class' => 'import'), false
              );?>
            </li>
            <li>
              <?php echo nl_getExhibitLink(
                $e, 'delete-confirm', __('Delete'),
                array('class' => 'delete-confirm'), false
              );?>
            </li>
          </ul>
        </td>

        <!-- Modified -->
        <td>
          <?php echo format_date(nl_getExhibitField('modified')); ?>
        </td>

        <!-- # Items -->
        <td>
          <?php echo nl_getExhibitRecordCount(); ?>
        </td>

        <!-- Public -->
        <td>
          <?php echo nl_getExhibitField('public')?__('Yes'):__('No'); ?>
        </td>

      </tr>
      <?php endforeach; ?>

    </tbody>

  </table>

  <!-- Bottom pagination. -->
  <div class="pagination"><?php echo pagination_links(); ?></div>

  <?php else: ?>

    <h2><?php echo __('You have no exhibits.'); ?></h2>
    <p><?php echo __('Get started by creating a new one!'); ?></p>

    <a class="add big green button"
      href="<?php echo url('neatline/add'); ?>">
      <?php echo __('Create an Exhibit'); ?>
    </a>

  <?php endif; ?>

</div>

<?php echo foot(); ?>
