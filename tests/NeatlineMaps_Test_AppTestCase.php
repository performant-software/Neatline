<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**
 * Application test case for BagIt plugin.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package omeka
 * @subpackage BagIt
 * @author Scholars' Lab
 * @author David McClure (david.mcclure@virginia.edu)
 * @copyright 2011
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache 2.0
 *
 * PHP version 5
 *
 */
?>

<?php

require_once '../NeatlineMapsPlugin.php';

class NeatlineMaps_Test_AppTestCase extends Omeka_Test_AppTestCase
{

    private $_dbHelper;

    public function setUpPlugin($dropbox = true)
    {

        parent::setUp();

        $this->user = $this->db->getTable('User')->find(1);
        $this->_authenticateUser($this->user);

        // Then set up NeatlineMaps.
        $bagit_plugin_broker = get_plugin_broker();
        $this->_addBagItPluginHooksAndFilters($bagit_plugin_broker, 'NeatlineMaps');

        $bagit_plugin_helper = new Omeka_Test_Helper_Plugin;
        $bagit_plugin_helper->setUp('NeatlineMaps');

        $this->_dbHelper = Omeka_Test_Helper_Db::factory($this->core);

    }

    public function _addBagItPluginHooksAndFilters($plugin_broker, $plugin_name)
    {

        $plugin_broker->setCurrentPluginDirName($plugin_name);

        new NeatlineMapsPlugin;

    }

    public function _createServers($number)
    {

        $i = 0;
        while ($i < $number) {
            $this->_createServer('Test Server' . $i, 'http://www.test.org', 'admin', 'password');
            $i++;
        }

    }

    public function _createServer($name, $url, $username, $password)
    {

        $server = new NeatlineMapsServer;
        $server->name = $name;
        $server->url = $url;
        $server->username = $username;
        $server->password = $password;
        $server->save();

        return $server;

    }

    public function _createMap(
        $serverName = 'Test Server',
        $serverUrl = 'http://www.test.com',
        $serverUsername = 'admin',
        $serverPassword = 'password',
        $item = null,
        $mapName = 'Test Map',
        $mapNamespace = 'Test_Namespace')
    {

        $server = $this->_createServer($serverName, $serverUrl, $serverUsername, $serverPassword);
        $files = $this->_createFiles(5);

        if ($item == null) {
            $item = $this->_createItem('Test Item');
        }

        $map = new NeatlineMapsMap;
        $map->item_id = $item->id;
        $map->server_id = $server->id;
        $map->name = $mapName;
        $map->namespace = $mapNamespace;
        $map->save();

        $i = 1;
        while ($i <= 5) {
            $mapFile = new NeatlineMapsMapFile;
            $mapFile->file_id = $i;
            $mapFile->map_id = $map->id;
            $mapFile->save();
            $i++;
        }

        return $map;

    }

    public function _createMapForServer($server)
    {

        $files = $this->_createFiles(5);
        $item = $this->_createItem('Test Item');

        $map = new NeatlineMapsMap;
        $map->item_id = $item->id;
        $map->server_id = $server->id;
        $map->name = 'Test Map';
        $map->namespace = 'Test_Namespace';
        $map->save();

        $i = 1;
        while ($i <= 5) {
            $mapFile = new NeatlineMapsMapFile;
            $mapFile->file_id = $i;
            $mapFile->map_id = $map->id;
            $mapFile->save();
            $i++;
        }

        return $map;

    }

    public function _createMapFile(
        $serverName = 'Test Server',
        $serverUrl = 'http://www.test.com',
        $serverUsername = 'admin',
        $serverPassword = 'password',
        $item = null,
        $mapName = 'Test Map',
        $mapNamespace = 'Test_Namespace')
    {

        $server = $this->_createServer($serverName, $serverUrl, $serverUsername, $serverPassword);
        $this->_createFiles(1);

        if ($item == null) {
            $item = $this->_createItem('Test Item');
        }

        $map = new NeatlineMapsMap;
        $map->item_id = $item->id;
        $map->server_id = $server->id;
        $map->name = $mapName;
        $map->namespace = $mapNamespace;
        $map->save();

        $mapFile = new NeatlineMapsMapFile;
        $mapFile->file_id = 1;
        $mapFile->map_id = $map->id;
        $mapFile->save();

        return $mapFile;

    }


    public function _createMaps($number)
    {

        $maps = array();

        $i = 0;
        while ($i < $number) {
            $item = $this->_createItem('Test Item ' . $i);
            $maps[] = $this->_createMap(
                $serverName = 'Test Server ' . $i,
                $serverUrl = 'http://www.test.com',
                $serverUsername = 'admin',
                $serverPassword = 'password',
                $item = $item,
                $mapName = 'Test Map ' . $i,
                $mapNamespace = 'Test_Namespace ' . $i);
            $i++;
        }

        return $maps;

    }

    public function _createItem($name, $type_id = null, $creator = null)
    {

        $item = new Item;
        $item->featured = 0;
        $item->public = 1;

        if ($type_id != null) {
            $item->item_type_id = $type_id;
        }

        $item->save();

        $title = new ElementText;
        $title->record_id = $item->id;
        $title->record_type_id = 2;
        $title->element_id = 50;
        $title->html = 0;
        $title->text = $name;
        $title->save();

        if ($creator != null) {
            $creator_element = new ElementText;
            $creator_element->record_id = $item->id;
            $creator_element->record_type_id = 2;
            $creator_element->element_id = 39;
            $creator_element->html = 0;
            $creator_element->text = $creator;
            $creator_element->save();
        }

        return $item;

    }


    public function _createItems($number)
    {

        $items = array();

        $i = 0;
        while ($i < $number) {
            $item = $this->_createItem('Test Item ' . $i);
            $i++;
        }

        return $items;

    }

    public function _createFiles($number)
    {

        $i = 0;
        while ($i < $number) {
            $db = get_db();
            $sql = 'INSERT INTO omeka_files 
                (item_id, size, has_derivative_image, archive_filename, original_filename) 
                VALUES (1, 5000, 0, "ArchiveTestFile' . $i . '.jpg", "TestFile' . $i . '.jpg")';
            $db->query($sql);
            $i++;
        }

    }

}
