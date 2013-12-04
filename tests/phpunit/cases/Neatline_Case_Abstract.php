<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


abstract class Neatline_Case_Abstract extends Omeka_Test_AppTestCase
{


    /**
     * Log in, install Neatline.
     */
    public function setUp()
    {

        parent::setUp();

        // Authenticate and set the current user.
        $this->user = $this->db->getTable('User')->find(1);
        $this->_authenticateUser($this->user);

        // Install Neatline.
        $this->helper = new Omeka_Test_Helper_Plugin;
        $this->helper->setUp('Neatline');

    }


    // STATE MANAGEMENT
    // ------------------------------------------------------------------------


    /**
     * Get the Jasmine fixtures directory.
     *
     * @return string The directory.
     */
    abstract protected function _getFixturesPath();


    /**
     * Clear testing records. This needs to be done manually since the records
     * table is MyISAM (for spatial/fulltext indexes), and doesn't get cleared
     * with the rest of the tables when the transaction is rolled back.
     */
    public function tearDown()
    {
        $records = <<<SQL
        DELETE FROM {$this->db->prefix}neatline_records WHERE 1=1
SQL;
        $this->db->query($records);
        parent::tearDown();
    }


    /**
     * Install the passed plugin. If the installation fails, skip the test.
     *
     * @param string $pluginName The plugin name.
     */
    protected function _installPluginOrSkip($pluginName)
    {
        try {
            $this->helper->setUp($pluginName);
        } catch (Exception $e) {
            $this->markTestSkipped("Plugin $pluginName can't be installed.");
        }
    }


    /**
     * If the passed plugin is installed/active, skip the test.
     *
     * @param string $pluginName The plugin name.
     */
    protected function _skipIfPlugin($pluginName)
    {
        if (plugin_is_active($pluginName)) $this->markTestSkipped();
    }


    /**
     * If the passed plugin is not installed/active, skip the test.
     *
     * @param string $pluginName The plugin name.
     */
    protected function _skipIfNotPlugin($pluginName)
    {
        if (!plugin_is_active($pluginName)) $this->markTestSkipped();
    }


    // RECORD MOCKS
    // ------------------------------------------------------------------------


    /**
     * Create a User.
     *
     * @param string $name An identifier.
     * @param string $role The user's role.
     * @return User $item The item.
     */
    protected function _user($name='user', $role='super')
    {

        $user = new User;
        $user->setArray(array(
            'name'      => $name,
            'email'     => $name.'@test.org',
            'username'  => $name,
            'role'      => $role,
            'active'    => 1
        ));

        $user->setPassword('password');
        $user->save();

        return $user;

    }


    /**
     * Create an Item.
     *
     * @param string $title The exhibit title.
     * @return Item $item The item.
     */
    protected function _item($title='Test Title')
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
     * @param boolean $public True if the exhibit is public.
     * @return NeatlineExhibit $neatline The exhibit.
     */
    protected function _exhibit($slug='test-slug', $public=true)
    {

        $exhibit = new NeatlineExhibit;

        $exhibit->setArray(array(
            'slug' => $slug, 'public' => $public
        ));

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
    protected function _record($exhibit=null, $item=null)
    {

        // Get parent exhibit.
        if (is_null($exhibit)) $exhibit = $this->_exhibit();

        // Create record.
        $record = new NeatlineRecord($exhibit, $item);
        $record->__save();
        return $record;

    }


    /**
     * Add a Neatline Features feature for an item.
     *
     * @param Item $item The parent item.
     * @param string $coverage The feature coverage.
     */
    protected function _addNeatlineFeature($item, $coverage)
    {
        $this->db->query(
            "INSERT INTO `{$this->db->prefix}neatline_features`
            (item_id, element_text_id, is_map, geo) VALUES (?, ?, ?, ?);",
            array($item->id, 0, 1, $coverage)
        );
    }


    /**
     * Add a Dublin Core "Coverage" element to an item.
     *
     * @param Item $item The parent item.
     * @param string $coverage The feature coverage.
     */
    protected function _addCoverageElement($item, $coverage)
    {
        update_item($item, array(), array(
            'Dublin Core' => array (
                'Coverage' => array(
                    array('text' => $coverage, 'html' => false)
                )
            )
        ));
    }


    // REQUEST MOCKS
    // ------------------------------------------------------------------------


    /**
     * Mock out PUT data before a request.
     *
     * @param array $data Key-value pairs.
     */
    protected function _setPut($data=array())
    {

        // Open the file.
        $mockPath = NL_TEST_DIR.'/mocks/put.txt';
        $fileIn = fopen($mockPath, 'w');

        // Write data.
        fwrite($fileIn, json_encode($data));
        fclose($fileIn);

        // Set global fileIn.
        Zend_Registry::set('fileIn', $mockPath);
        $this->request->setMethod('PUT');

    }


    /**
     * Mock out POST data before a request.
     *
     * @param array $data Key-value pairs.
     */
    protected function _setPost($data=array())
    {
        $this->request->setMethod('POST')->setRawBody(
            Zend_Json::encode($data)
        );
    }


    // FIXTURES
    // ------------------------------------------------------------------------


    /**
     * Write a fixture file.
     *
     * @param string $body The fixture body.
     * @param string $file The name of the fixture file.
     */
    protected function _writeFixture($body, $file)
    {

        // Open the fixture file.
        $fixture = fopen($this->_getFixturesPath() . $file, 'w');

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
    protected function _writeFixtureFromRoute($route, $file)
    {

        // Request the route.
        $this->resetResponse();
        $this->dispatch($route);

        // Write the fixture.
        $response = $this->_getResponseBody();
        $this->_writeFixture($response, $file);

    }


    /**
     * Write a record API fixture.
     *
     * @param NeatlineRecord $record The record to load.
     * @param string $file The name of the fixture file.
     */
    public function _writeRecordApiFixture($record, $file)
    {
        $this->resetRequest();
        $this->_writeFixtureFromRoute('neatline/records/'.$record->id, $file);
    }


    /**
     * Write a records API fixture.
     *
     * @param NeatlineExhibit $exhibit The exhibit to query.
     * @param string $file The name of the fixture file.
     */
    public function _writeRecordsApiFixture($exhibit, $file)
    {
        $this->request->setQuery('exhibit_id', $exhibit->id);
        $this->_writeFixtureFromRoute('neatline/records', $file);
    }


    /**
     * Render an exhibit HTML fixture.
     *
     * @param NeatlineExhibit $exhibit The current exhibit.
     * @param string $file The name of the fixture file.
     */
    protected function _writeExhibitMarkupFixture($exhibit, $file)
    {
        get_view()->neatline_exhibit = $exhibit;
        $html = get_view()->partial('exhibits/partials/exhibit.php');
        $this->_writeFixture($html, $file);
    }


    /**
     * Render an editor HTML fixture.
     *
     * @param NeatlineExhibit $exhibit The current exhibit.
     * @param string $file The name of the fixture file.
     */
    protected function _writeEditorMarkupFixture($exhibit, $file)
    {
        get_view()->neatline_exhibit = $exhibit;
        $html = get_view()->partial('exhibits/partials/editor_core.php');
        $this->_writeFixture($html, $file);
    }


    // DEPENDENCY INJECTIONS
    // ------------------------------------------------------------------------


    /**
     * Inject and return a mock `Omeka_Job_Dispatcher_Default`.
     *
     * @return Omeka_Job_Dispatcher_Default PHPUnit mock.
     */
    protected function _mockJobDispatcher()
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
    protected function _mockExhibitWidgets()
    {
        add_filter('neatline_exhibit_widgets', 'nl_mockWidgets');
    }


    /**
     * Register mock record widgets filter callback.
     */
    protected function _mockRecordWidgets()
    {
        add_filter('neatline_record_widgets', 'nl_mockWidgets');
    }


    /**
     * Register mock presenters filter callback.
     */
    protected function _mockPresenters()
    {
        add_filter('neatline_presenters', 'nl_mockPresenters');
    }


    /**
     * Register the mock layers JSON.
     */
    protected function _mockLayers()
    {
        Zend_Registry::set('layers', array(NL_TEST_DIR.'/mocks/layers'));
    }


    /**
     * Register the mock theme scripts.
     */
    protected function _mockTheme()
    {
        get_view()->addScriptPath(NL_TEST_DIR.'/mocks/theme/neatline');
    }


    // STATE GETTERS
    // ------------------------------------------------------------------------


    /**
     * Query all records in an exhibit.
     *
     * @param NeatlineExhibit $exhibit The parent exhibit.
     * @param boolean $findOne If true, return only first record.
     * @return array The child records.
     */
    protected function _getRecordsByExhibit($exhibit, $findOne=false)
    {
        return $this->_records->findBySql(
            'exhibit_id=?', array($exhibit->id), $findOne
        );
    }


    /**
     * Get the body of the last response.
     *
     * @return array The response body.
     */
    protected function _getResponseBody()
    {
        return $this->getResponse()->getBody('default');
    }


    /**
     * Get the body of the last response as an array.
     *
     * @return array The response data.
     */
    protected function _getResponseArray()
    {
        return json_decode($this->_getResponseBody());
    }


    /**
     * Reload a record.
     *
     * @param Omeka_Record_AbstractRecord $record A record to reload.
     * @return Omeka_Record_AbstractRecord The reloaded record.
     */
    protected function _reload($record)
    {
        return $record->getTable()->find($record->id);
    }


    /**
     * Get the last record in a table.
     *
     * @param Omeka_Db_Table $table A table.
     * @return Neatline_AbstractRecord The last record.
     */
    protected function _getLastRow($table)
    {
        $records = $table->findAll();
        return array_pop($records);
    }


    // ACL
    // ------------------------------------------------------------------------


    /**
     * Log out the currently-authenticated user.
     */
    protected function _logout()
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
     * @return Omeka_User The new user.
     */
    protected function _loginAsResearcher($name='user')
    {
        $user = $this->_user($name, 'researcher');
        $this->_authenticateUser($user);
        return $user;
    }


    /**
     * Log in as a "Contributor" user.
     *
     * @param $name An identifier for the user.
     * @return Omeka_User The new user.
     */
    protected function _loginAsContributor($name='user')
    {
        $user = $this->_user($name, 'contributor');
        $this->_authenticateUser($user);
        return $user;
    }


    /**
     * Register an expected 404 controller exception.
     */
    protected function _expect404()
    {
        $this->setExpectedException('Omeka_Controller_Exception_404');
    }


}
