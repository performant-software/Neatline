<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php
  echo head(array(
    'title' => __('Neatline | Browse Exhibits')
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
          __('Exhibit') => 'title',
          __('Created') => 'added',
          __('# Items') => null,
          __('Public')  => null
        ), array('link_tag' => 'th scope="col"')); ?>
      </tr>
    </thead>

  <!-- Top pagination. -->
  <div class="pagination"><?php echo pagination_links(); ?></div>

    <tbody>

      <?php foreach (loop('NeatlineExhibit') as $e): ?>
        <tr>

          <td class="title">

            <!-- Title. -->
            <?php if (is_allowed($e, 'editor')) {
                echo nl_getExhibitLink(
                  $e, 'editor', null,
                  array('class' => 'editor'), false
                );
              } else {
                echo nl_getExhibitField('title');
              }
            ?>

            <ul class="action-links group">

              <!-- Public View. -->
              <li>
                <?php echo nl_getExhibitLink(
                  $e, 'show', __('Public View'),
                  array('class' => 'public'), true
                ); ?>
              </li>

              <!-- Fullscreen View. -->
              <li>
                <?php echo nl_getExhibitLink(
                  $e, 'fullscreen', __('Fullscreen View'),
                  array('class' => 'fullscreen'), true
                ); ?>
              </li>

              <!-- Exhibit Settings. -->
              <?php if (is_allowed($e, 'edit')): ?>
                <li>
                  <?php echo nl_getExhibitLink(
                    $e, 'edit', __('Exhibit Settings'),
                    array('class' => 'edit'), false
                  ); ?>
                </li>
              <?php endif; ?>

              <!-- Import Omeka Items. -->
              <?php if (is_allowed($e, 'import')): ?>
                <li>
                  <?php echo nl_getExhibitLink(
                    $e, 'import', __('Import Items'),
                    array('class' => 'import'), false
                  ); ?>
                </li>
              <?php endif; ?>

              <!-- Duplicate. -->
              <?php if (is_allowed($e, 'duplicate')): ?>
                <li>
                  <?php echo nl_getExhibitLink(
                    $e, 'duplicate', __('Duplicate'),
                    array('class' => 'duplicate'), false
                  ); ?>
                </li>
              <?php endif; ?>

              <!-- Delete. -->
              <?php if (is_allowed($e, 'delete')): ?>
                <li>
                  <?php echo nl_getExhibitLink(
                    $e, 'delete-confirm', __('Delete'),
                    array('class' => 'delete-confirm'), false
                  );?>
                </li>
              <?php endif; ?>

            </ul>
          </td>

          <!-- Created. -->
          <td>
            <?php echo format_date(nl_getExhibitField('added')); ?>
          </td>

          <!-- # Items. -->
          <td>
            <?php echo nl_getExhibitRecordCount(); ?>
          </td>

          <!-- Public. -->
          <td>
            <?php echo nl_getExhibitField('public') ?
              __('Yes') : __('No'); ?>
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
