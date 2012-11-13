<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Javascript templates.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<!-- Listing for individual record. -->
<script id="record-listing" type="text/templates">
  <span class="record-title"><%= title %></span>
</script>


<!-- Record edito form. -->
<script id="edit-form" type="text/templates">

  <div class="form">

    <form class="form-stacked">

      <ul class="tabs-header">
        <li><a href="#tabs-1"><?php echo __('Text'); ?></a></li>
        <li><a href="#tabs-2"><?php echo __('Spatial'); ?></a></li>
        <li><a href="#tabs-3"><?php echo __('Styling'); ?></a></li>
      </ul>

      <div id="tabs-1">

        <div class="control-group">
          <label for="title"><?php echo __('Title'); ?></label>
          <div class="controls">
            <textarea name="title"><%= title %></textarea>
          </div>
        </div>

        <div class="control-group">
          <label for="description"><?php echo __('Body'); ?></label>
          <div class="controls">
            <textarea name="description"><%= description %></textarea>
          </div>
        </div>

      </div>

      <div id="tabs-2">

        <table class="map-styles">
          <tr>
            <td>
              <label><?php echo __('Shape Color'); ?></label>
              <div class="controls">
                <div class="inline-inputs">
                  <input type="text" name="vector-color" value="<%= vectorColor %>" />
                </div>
              </div>
            </td>
            <td>
              <label><?php echo __('Line Color'); ?></label>
              <div class="controls">
                <div class="inline-inputs">
                  <input type="text" name="stroke-color" />
                </div>
              </div>
            </td>
            <td>
              <label><?php echo __('Selected Color'); ?></label>
              <div class="controls">
                <div class="inline-inputs">
                  <input type="text" name="highlight-color" value="<%= highlightColor %>" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <label><?php echo __('Shape Opacity'); ?></label>
              <div class="controls">
                <div class="inline-inputs">
                  <input type="text" name="vector-opacity" value="<%= vectorOpacity %>" />
                </div>
              </div>
            </td>
            <td>
              <label><?php echo __('Selected Opacity'); ?></label>
              <div class="controls">
                <div class="inline-inputs">
                  <input type="text" name="select-opacity" value="<%= selectOpacity %>" />
                </div>
              </div>
            </td>
            <td>
              <label><?php echo __('Line Opacity'); ?></label>
              <div class="controls">
                <div class="inline-inputs">
                  <input type="text" name="stroke-opacity" value="<%= strokeOpacity %>" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <label><?php echo __('Graphic Opacity'); ?></label>
              <div class="controls">
                <div class="inline-inputs">
                  <input type="text" name="graphic-opacity" value="<%= graphicOpacity %>" />
                </div>
              </div>
            </td>
            <td>
              <label><?php echo __('Line Width'); ?></label>
              <div class="controls">
                <div class="inline-inputs">
                  <input type="text" name="stroke-width" value="<%= strokeWidth %>" />
                </div>
              </div>
            </td>
            <td>
              <label><?php echo __('Point Radius'); ?></label>
              <div class="controls">
                <div class="inline-inputs">
                  <input type="text" name="point-radius" value="<%= pointRadius %>" />
                </div>
              </div>
            </td>
          </tr>
        </table>

        <div class="control-group">
          <label><?php echo __('Point Graphic'); ?></label>
          <div class="controls">
            <div class="inline-inputs">
              <input name="point-image" type="text" value="<%= pointImage %>" />
            </div>
          </div>
        </div>

        <div class="control-group">
          <div class="controls">
            <div class="inline-inputs">
              <button name="reset-styles"><?php echo __('Reset Item Styles'); ?></button>
            </div>
          </div>
        </div>

        <div class="control-group">
          <div class="controls">
            <div class="inline-inputs">
              <button name="map-focus"><?php echo __('Set Map Focus'); ?></button>
            </div>
          </div>
        </div>

      </div>

      <div class="fieldset">
          <div class="form-actions">
              <button name="save"><?php echo __('Save'); ?></button>
              <button name="close"><?php echo __('Close'); ?></button>
              <button name="delete"><?php echo __('Delete'); ?></button>
          </div>
      </div>

    </form>

  </div>

</script>
