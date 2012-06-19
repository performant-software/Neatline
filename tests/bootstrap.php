<?php

if (!($omekaDir = getenv('OMEKA_DIR'))) {
    $omekaDir = dirname(dirname(dirname(dirname(__FILE__))));
}

require_once $omekaDir . '/application/tests/bootstrap.php';
require_once 'Neatline_Test_AppTestCase.php';

