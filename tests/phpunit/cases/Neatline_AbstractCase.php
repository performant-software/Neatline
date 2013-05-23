<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_AbstractCase extends Omeka_Test_AppTestCase
{


    /**
     * Clear the database.
     */
    public function tearDown()
    {
        $p = $this->db->prefix;
        $this->db->query("DELETE FROM `{$p}neatline_records` WHERE 1=1");
        $this->db->query("DELETE FROM `{$p}neatline_exhibits` WHERE 1=1");
        parent::tearDown();
    }


    /**
     * Create an Item.
     *
     * @param string $title The exhibit title.
     * @return Omeka_record $item The item.
     */
    public function __item($title='Test Title')
    {
        return $item = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => $title, 'html' => false)
                )
            )
        ));
    }


    /**
     * Create a Neatline exhibit.
     *
     * @param string $slug The exhibit slug.
     * @return Omeka_record $neatline The exhibit.
     */
    public function __exhibit($slug='test-slug')
    {
        $exhibit = new NeatlineExhibit;
        $exhibit->slug = $slug;
        $exhibit->save();
        return $exhibit;
    }


    /**
     * Create a data record.
     *
     * @param NeatlineExhibit $exhibit The parent exhibit.
     * @param Item $item The parent item.
     * @return NeatlineRecord $record The record.
     */
    public function __record($exhibit=null, $item=null)
    {

        // Get parent exhibit.
        if (is_null($exhibit)) $exhibit = $this->__exhibit();

        // Create record.
        $record = new NeatlineRecord($exhibit, $item);
        $record->__save();
        return $record;

    }


    /**
     * Write a fixture file.
     *
     * @param string $body The fixture body.
     * @param string $file The name of the fixture file.
     */
    public function writeFixture($body, $file)
    {

        // Open the fixture file.
        $fixture = fopen($this->getFixturesPath() . $file, 'w');

        // Write fixture.
        fwrite($fixture, $body);
        fclose($fixture);

    }


    /**
     * Write the response body from a route to a fixture file.
     *
     * @param string $route The resource location.
     * @param string $file The name of the fixture file.
     */
    public function writeFixtureFromRoute($route, $file)
    {
        $this->dispatch($route);
        $response = $this->getResponseBody();
        $this->writeFixture($response, $file);
    }


    /**
     * Mock out PUT data before a request.
     *
     * @param array $data Key-value pairs.
     */
    public function writePut($data = array())
    {

        // Open the file.
        $mockPath = NL_DIR . '/tests/phpunit/mocks/put.txt';
        $fileIn = fopen($mockPath, 'w');

        // Write data.
        fwrite($fileIn, json_encode($data));
        fclose($fileIn);

        // Set global fileIn.
        Zend_Registry::set('fileIn', $mockPath);
        $this->request->setMethod('PUT');

    }


    /**
     * Inject and return a mock `Omeka_Job_Dispatcher_Default`.
     *
     * @return Omeka_Job_Dispatcher_Default PHPUnit mock.
     */
    public function mockJobDispatcher()
    {

        // Create a testing-double job dispatcher.
        $jobs = $this->getMockBuilder('Omeka_Job_Dispatcher_Default')
            ->disableOriginalConstructor()
            ->getMock();

        // Inject the mock.
        Zend_Registry::set('job_dispatcher', $jobs);

        return $jobs;

    }


    /**
     * Register mock exhibit widgets filter callback.
     */
    public function mockExhibitWidgets()
    {
        add_filter('neatline_exhibit_widgets', 'nl_mockWidgets');
    }


    /**
     * Register mock record widgets filter callback.
     */
    public function mockRecordWidgets()
    {
        add_filter('neatline_record_widgets', 'nl_mockWidgets');
    }


    /**
     * Register mock presenters filter callback.
     */
    public function mockPresenters()
    {
        add_filter('neatline_presenters', 'nl_mockPresenters');
    }


    /**
     * Register the mock layers JSON.
     */
    public function mockLayers()
    {
        Zend_Registry::set('layers',
            NL_DIR . '/tests/phpunit/mocks/layers.json'
        );
    }


    /**
     * Register the mock theme scripts.
     */
    public function mockTheme()
    {
        get_view()->addScriptPath(
            NL_DIR . '/tests/phpunit/mocks/theme/neatline'
        );
    }


    /**
     * Query all records in an exhibit.
     *
     * @param NeatlineExhibit $exhibit The parent exhibit.
     * @param boolean $findOne If true, return only first record.
     * @return array The child records.
     */
    public function getRecordsByExhibit($exhibit, $findOne=false)
    {
        return $this->__records->findBySql(
            'exhibit_id=?', array($exhibit->id), $findOne
        );
    }


    /**
     * Get the body of the last response.
     *
     * @return array The response body.
     */
    public function getResponseBody()
    {
        return $this->getResponse()->getBody('default');
    }


    /**
     * Get the body of the last response as an array.
     *
     * @return array The response data.
     */
    public function getResponseArray()
    {
        return json_decode($this->getResponseBody());
    }


    /**
     * Reload a record.
     *
     * @param Omeka_Record_AbstractRecord $record A record to reload.
     * @return Omeka_Record_AbstractRecord The reloaded record.
     */
    public function reload($record)
    {
        return $record->getTable()->find($record->id);
    }


    /**
     * Get the last record in a table.
     *
     * @param Omeka_Db_Table $table A table.
     * @return Neatline_AbstractRecord The last record.
     */
    public function getLastRow($table)
    {
        return end($table->findAll());
    }


    /**
     * Log out the currently-authenticated user.
     */
    public function logout()
    {

        // Clear out user on the bootstrap.
        $bootstrap = $this->application->getBootstrap();
        $bootstrap->auth->getStorage()->write(null);
        $bootstrap->getContainer()->currentuser = null;
        $bootstrap->currentUser = null;

        // Clear out the current user.
        Zend_Controller_Action_HelperBroker::getStaticHelper('Acl')
            ->setCurrentUser(null);

    }


    /**
     * Log in as a "Researcher" user.
     *
     * @param $name An identifier for the user.
     */
    public function loginAsResearcher($name='user')
    {

        $this->user             = new User;
        $this->user->name       = $name;
        $this->user->email      = $name.'@test.org';
        $this->user->username   = $name;
        $this->user->role       = 'researcher';
        $this->user->active     = 1;

        $this->user->setPassword('password');
        $this->user->save();

        $this->_authenticateUser($this->user);

    }


}
