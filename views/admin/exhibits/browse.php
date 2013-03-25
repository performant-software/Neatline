<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Browse exhibits.
 *
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
?>

<p class="add-button">
  <a class="add green button" href="<?php echo url('neatline/add'); ?>">
    <?php echo __('Create an Exhibit'); ?>
  </a>
</p>

<div id="primary">

  <?php echo flash(); ?>

  <?php if(_nl_areExhibits()): ?>
  <div class="pagination"><?php echo pagination_links(); ?></div>
    <table class="neatline">

      <thead>
        <tr>
          <?php echo browse_sort_links(array(
              __('Exhibit')   => 'title',
              __('Modified')  => 'modified',
              __('# Items')   => 'added',
              __('Public')    => 'public'
          ), array(
              'link_tag'      => 'th scope="col"'
          )); ?>
        </tr>
      </thead>

      <tbody>

        <!-- Exhibit listings. -->
        <?php foreach(loop('NeatlineExhibit') as $e): ?>
        <tr>

          <td class="title">
            <?php echo _nl_link($e, 'editor', null,
              array('class' => 'editor'), false);
            ?>
            <ul class="action-links group">
              <li>
                <?php echo _nl_link($e, 'show', __('Public View'),
                  array('class' => 'public'), true);
                ?>
              </li>
              <li>
                <?php echo _nl_link($e, 'edit', __('Exhibit Settings'),
                  array('class' => 'edit'), false);
                ?>
              </li>
              <li>
                <?php echo _nl_link($e, 'import', __('Import Items'),
                  array('class' => 'import'), false);
                ?>
              </li>
              <li>
                <?php echo _nl_link($e, 'delete-confirm', __('Delete'),
                  array('class' => 'delete-confirm'), false);
                ?>
              </li>
            </ul>
          </td>

          <td><?php echo format_date(_nl_field('modified')); ?></td>
          <td><?php echo _nl_totalRecords(); ?></td>
          <td><?php echo _nl_field('public')?__('Yes'):__('No'); ?></td>

        </tr>
        <?php endforeach; ?>

      </tbody>

    </table>

  <!-- Pagination. -->
  <div class="pagination"><?php echo pagination_links(); ?></div>

  <?php else: ?>
    <p class="neatline-alert">
      <?php echo __('There are no Neatline exhibits yet.'); ?>
      <a href="<?php echo url('neatline/add'); ?>">
        <?php echo __('Create one!'); ?>
      </a>
    </p>
  <?php endif; ?>

</div>

<?php echo foot(); ?>
