<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php

    $header = head(array(
      'title' => nl_getExhibitField('title'),
      'bodyclass' => 'neatline fullscreen'
      ));

    preg_match('/.*<body.*>/simU', $header, $matches);
    echo $matches[0];
?>

<?php fire_plugin_hook('public_content_top', array('view'=>$this)); ?>

<?php echo nl_getExhibitMarkup(); ?>

</body>
</html>
