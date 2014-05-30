<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_QueueDistJs extends Neatline_Case_Default
{


    /**
     * `nl_queueDistJs` should enqueue files from `/dist/development` when
     * `APPLICATION_ENV` is set to `development`.
     */
    public function testQueueDevelopmentAssets()
    {
        // TODO
    }


    /**
     * `nl_queueDistJs` should enqueue files from `/dist/production` when
     * `APPLICATION_ENV` is set to anything other than `development`.
     */
    public function testQueueProductionAssets()
    {
        // TODO
    }


}
