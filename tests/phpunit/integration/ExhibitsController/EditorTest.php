<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for editor action in the exhibits controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ExhibitsControllerTest_Editor
    extends Neatline_Test_AppTestCase
{


    /**
     * When an exhibit does not have any enabled widgets, the "Plugins"
     * dropdown should not be present and no panels should be added.
     */
    public function testNoWidgets()
    {

        $exhibit = $this->__exhibit();

        // Open editor, capture raw response.
        $this->dispatch('neatline/editor/'.$exhibit->id);
        $body = $this->getResponse()->getBody();

        // Should not add "Plugins" dropdown.
        $this->assertNotContains('class="dropdown plugins"', $body);

        // Should not add widget panels.
        $this->assertNotContains('id="record-widget-', $body);

    }


    /**
     * When an exhibit does have enabled widgets, the widget tabs and
     * panels should be added to the form.
     */
    public function testWidgets()
    {

        $exhibit = $this->__exhibit();
        $exhibit->widgets = 'Widget1,Widget2';
        $exhibit->save();

        // Open editor, capture raw response.
        $this->dispatch('neatline/editor/'.$exhibit->id);
        $body = $this->getResponse()->getBody();

        // Should add tabs for enabled widgets.
        $this->assertNotContains('href="#record-widget-3"', $body);
        $this->assertContains('href="#record-widget-1"', $body);
        $this->assertContains('href="#record-widget-2"', $body);

        // Should add panels for enabled widgets.
        $this->assertNotContains('id="record-widget-3"', $body);
        $this->assertContains('id="record-widget-1"', $body);
        $this->assertContains('id="record-widget-2"', $body);

    }


}
