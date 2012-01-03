<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Create a demo exhibit.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

/**
 * Create a demo exhibit.
 *
 * @return void.
 */
function neatline_createDemoExhibit()
{

    // Create the exhibit.
    $exhibit = new NeatlineExhibit;

    // Populate.
    $exhibit->name =                   '(Sample Exhibit): NYC Parks';
    $exhibit->added =                  '2012-01-01 00:00:00';
    $exhibit->is_map =                 1;
    $exhibit->is_timeline =            0;
    $exhibit->is_items =               1;
    $exhibit->top_element =            'map';
    $exhibit->items_h_pos =            'right';
    $exhibit->items_v_pos =            'bottom';
    $exhibit->items_height =           'full';
    $exhibit->default_map_zoom =       14;
    $exhibit->default_map_bounds =     '-8255563.3238613,4944376.9470808,-8210847.6623207,5001551.8442302';
    $exhibit->default_vector_opacity = 8;
    $exhibit->default_stroke_opacity = 100;
    $exhibit->default_stroke_color =   '#281ee6';
    $exhibit->save();

    // ** CENTRAL PARK
    $centralPark = new NeatlineDataRecord(null, $exhibit);
    $centralPark->title =               'Central Park';
    $centralPark->description =         "(From Wikipedia): Central Park is a public park in the center of Manhattan in New York City, United States. The park initially opened in 1857, on 843 acres (3.41 km2) of city-owned land. In 1858, Frederick Law Olmsted and Calvert Vaux won a design competition to improve and expand the park with a plan they entitled the Greensward Plan. Construction began the same year and was completed in 1873.<br /><br />The park, which receives approximately thirty-five million visitors annually, is the most visited urban park in the United States. It was opened on 770 acres (3.1 km2) of city-owned land and was expanded to 843 acres (3.41 km2; 1.317 sq mi). It is 2.5 miles (4 km) long between 59th Street (Central Park South) and 110th Street (Central Park North), and is 0.5 miles (0.8 km) wide between Fifth Avenue and Central Park West. It is similar in size to San Francisco's Golden Gate Park, Vancouver's Stanley Park, and Munich's Englischer Garten.";
    $centralPark->geocoverage =         'POLYGON((-8234679.294542971 4977670.050208597,-8235653.8666535 4978214.6640351,-8232978.5706639 4982963.3144166,-8231994.4439248 4982437.8098473,-8234679.294542971 4977670.050208597))';
    $centralPark->display_order =       0;
    $centralPark->space_active =        1;
    $centralPark->save();

    // ** PROSPECT PARK
    $prospectPark = new NeatlineDataRecord(null, $exhibit);
    $prospectPark->title =              'Prospect Park';
    $prospectPark->description =        "(From Wikipedia): Prospect Park is a 585-acre (2.37 km2) (237 ha) public park in the New York City borough of Brooklyn located between Park Slope, Prospect-Lefferts Gardens, Kensington, Windsor Terrace and Flatbush Avenue, Grand Army Plaza and the Brooklyn Botanic Garden. It is run and operated by the New York City Department of Parks and Recreation and is part of the Brooklyn-Queens Greenway.<br /><br />The park was designed by Frederick Law Olmsted and Calvert Vaux after they completed Manhattan's Central Park. Attractions include the Long Meadow, a 90-acre (36 ha) meadow, the Picnic House, which houses offices and a hall that can accommodate parties with up to 175 guests; Litchfield Villa, the pre-existing home of Edwin Clark Litchfield, an early developer of the neighborhood and a former owner of a southern section of the Park; Prospect Park Zoo; a large nature conservancy managed by the Wildlife Conservation Society; The Boathouse, housing a visitors center and the first urban Audubon Center; Brooklyn's only lake, covering 60 acres (24 ha); the Prospect Park Bandshell that hosts free outdoor concerts in the summertime. The park also has sports facilities including seven baseball fields in the Long Meadow, and the Prospect Park Tennis Center, basketball courts, baseball fields, soccer fields, and the New York Pétanque Club in the Parade Ground. There is also a private Society of Friends cemetery on Quaker Hill near the ball fields, where actor Montgomery Clift is interred.";
    $prospectPark->geocoverage =        'POLYGON((-8234559.8616859 4960999.6120734,-8234793.9500849 4962093.6170406,-8235395.8916826 4962471.0248677,-8234344.8825438 4964152.6394897,-8234158.5672874 4964214.7445752,-8234010.4705451 4964195.6353181,-8233695.1678035 4964066.6478329,-8233757.272889 4963846.8913766,-8233437.1928331 4963741.7904627,-8233308.2053479 4962819.7688092,-8233446.7474616 4962805.4368664,-8233513.6298613 4962733.7771524,-8233537.5164327 4962652.5628098,-8233532.7391184 4962542.6845817,-8233418.083576 4961577.6670997,-8234559.8616859 4960999.6120734))';
    $prospectPark->display_order =      1;
    $prospectPark->space_active =       1;
    $prospectPark->save();

    // ** WASHINGTON SQUARE PARK 
    $washingtonPark = new NeatlineDataRecord(null, $exhibit);
    $washingtonPark->title =            'Washington Square Park';
    $washingtonPark->description =      "(From Wikipedia): Washington Square Park is one of the best-known of New York City's 1,900 public parks. At 9.75 acres (39,500 m2), it is a landmark in the Manhattan neighborhood of Greenwich Village, as well as a meeting place and center for cultural activity. It is operated by the New York City Department of Parks and Recreation.<br /><br />An open space with a tradition of nonconformity, the park's fountain area has long been one of the city's popular spots for residents and tourists. Most of the buildings surrounding the park now belong to New York University, but many have at one time served as homes and studios for artists. Some of the buildings have been built by NYU, others have been converted from their former uses into academic and residential buildings.";
    $washingtonPark->geocoverage =      'POLYGON((-8237147.6731081 4972700.7476243,-8237488.0567496 4972922.8927377,-8237595.5463206 4972752.1037527,-8237252.7740219 4972534.7359535,-8237147.6731081 4972700.7476243))';
    $washingtonPark->display_order =    2;
    $washingtonPark->space_active =     1;
    $washingtonPark->save();

    // ** TOMPKINS SQUARE PARK 
    $tompkinsPark = new NeatlineDataRecord(null, $exhibit);
    $tompkinsPark->title =              'Tompkins Square Park';
    $tompkinsPark->description =        "(From Wikipedia): Tompkins Square Park is a 10.5 acre (42,000 m²) public park in the Alphabet City section of the East Village neighborhood in the borough of Manhattan in New York City. It is square in shape, and is bounded on the north by East 10th Street, on the east by Avenue B, on the south by East 7th Street, and on the west by Avenue A. St. Marks Place abuts the park to the west.<br /><br />In the middle 19th century the 'Square' included a large parade ground for drilling the New York National Guard. The modern layout of the park by Robert Moses in 1936 is said to be intended to divide and manage crowds that have gathered there in protest since the 1870s. That tradition was rekindled as the park became the nursery of demonstrations against the Vietnam War in the 1960s.<br /><br />By the 1980s Tompkins Square Park had become for many New Yorkers synonymous with the city's increased social problems. The park at that time was a high-crime area that contained encampments of homeless people, and it was a center for illegal drug dealing and heroin use.";
    $tompkinsPark->geocoverage =        'POLYGON((-8235550.5572324 4971882.3339739,-8235414.4037757 4972133.142973,-8235667.6014319 4972271.6850867,-8235810.9208599 4972025.653402,-8235550.5572324 4971882.3339739))';
    $tompkinsPark->display_order =      3;
    $tompkinsPark->space_active =       1;
    $tompkinsPark->save();

    // ** CLOISTERS
    $cloisters = new NeatlineDataRecord(null, $exhibit);
    $cloisters->title =                 'The Cloisters';
    $cloisters->description =           "(From Wikipedia): The Cloisters is a museum located in Fort Tryon Park, New York City. The building, which is a branch of the Metropolitan Museum of Art, was built in the 1930s resembling architectural elements of several European medieval abbeys. It is used to exhibit art and architecture from Medieval Europe.<br /><br />The Cloisters, which is near the northern tip of Manhattan island on a hill overlooking the Hudson River, incorporates parts from five French cloistered abbeys. Buildings at Saint-Michel-de-Cuxa, Saint-Guilhem-le-Désert, Bonnefont-en-Comminges, Trie-en-Bigorre, and Froville were all disassembled brick-by-brick before being shipped to New York. Between 1934 and 1938, the features were reassembled in Fort Tryon Park.<br /><br />The area around The Cloisters was landscaped with gardens planted according to horticultural information obtained from medieval manuscripts and artifacts, and the structure includes multiple medieval-style cloistered herb gardens.";
    $cloisters->geocoverage =           'POLYGON((-8230120.840985331 4992287.138955334,-8230151.296363772 4992306.845376715,-8230162.642485056 4992339.092248013,-8230166.225470455 4992383.282404984,-8230126.215463606 4992505.103918852,-8230090.982771491 4992566.6118399715,-8230031.863506966 4992589.304082775,-8229966.772600485 4992571.986318586,-8229926.762593264 4992530.184818719,-8229914.222143413 4992463.302419019,-8229923.179607561 4992388.656883564,-8229960.800957283 4992298.485076748,-8230012.157086018 4992257.280741161,-8230051.5699282205 4992259.072234046,-8230120.840985331 4992287.138955334))';
    $cloisters->display_order =         4;
    $cloisters->space_active =          1;
    $cloisters->save();

    // ** SARA ROOSEVELT
    $saraRoosevelt = new NeatlineDataRecord(null, $exhibit);
    $saraRoosevelt->title =             'Sara Roosevelt Park';
    $saraRoosevelt->description =       "(From Wikipedia): Sara Delano Roosevelt Park is a 7.8-acre (32,000 m2) park in the Lower East Side of the New York City borough of Manhattan. The park, named after Sara Roosevelt, the mother of President Franklin Delano Roosevelt, stretches north-south between East Houston Street on the Lower East Side and Canal Street in Chinatown, between Chrystie Street on the west and Forsyth Street on the east. The park is operated and maintained by the New York City Department of Parks and Recreation.<br /><br />The park cuts off Stanton, Rivington, Broome and Hester Streets between Chrystie and Forsyth streets, but is interrupted at Delancey and Grand Streets.<br /><br />The park offers playing surfaces for several sports, including a basketball court, roller skating rink and a soccer field.";
    $saraRoosevelt->geocoverage =       'POLYGON((-8237007.3395015 4970485.8652971,-8237067.0559298 4970510.946197,-8237073.0275727 4970550.3590397,-8236644.2636172 4971664.667592532,-8236561.854946067 4971634.8093783995,-8237007.3395015 4970485.8652971))';
    $saraRoosevelt->display_order =     5;
    $saraRoosevelt->space_active =      1;
    $saraRoosevelt->save();

    // ** BRONX ZOO
    $bronxZoo = new NeatlineDataRecord(null, $exhibit);
    $bronxZoo->title =                  'Bronx Zoo';
    $bronxZoo->description =            "(From Wikipedia): The Bronx Zoo is located in the Bronx borough of New York City, within Bronx Park. It is the largest metropolitan zoo in the United States, comprising 265 acres (107 ha) of park lands and naturalistic habitats, through which the Bronx River flows.<br /><br />The Bronx Zoo is part of an integrated system of four zoos and one aquarium managed by the Wildlife Conservation Society (WCS), and is accredited by the Association of Zoos and Aquariums (AZA).";
    $bronxZoo->geocoverage =            'POLYGON((-8223675.9454566 4988995.8680075,-8223838.3741417 4989091.4142929,-8223981.6935697 4989153.5193784,-8224065.2965694 4989165.462664,-8223964.9729698 4989363.7212061,-8224581.2465102 4989929.8329468,-8224562.1372532 4990030.1565464,-8224590.8011388 4990097.0389461,-8224349.5467683 4991217.3191418,-8224084.4058265 4991050.1131424,-8224015.1347696 4991023.8379139,-8223926.7544556 4991021.4492568,-8223718.941285 4991064.4450852,-8223644.8929139 4991066.8337423,-8223601.8970855 4991052.5017995,-8223525.4600572 4990985.6193998,-8223437.0797433 4990885.2958002,-8223406.0272005 4990830.3566861,-8223365.4200293 4990622.5435155,-8223341.5334579 4990314.4067453,-8223343.922115 4989667.0806621,-8223394.0839149 4989313.5594063,-8223515.9054287 4989246.6770066,-8223621.0063425 4989115.3008642,-8223649.6702281 4989057.973093,-8223675.9454566 4988995.8680075))';
    $bronxZoo->display_order =          6;
    $bronxZoo->space_active =           1;
    $bronxZoo->save();

    // ** MARCUS GARVEY PARK
    $marcusGarvey = new NeatlineDataRecord(null, $exhibit);
    $marcusGarvey->title =              'Marcus Garvey Park';
    $marcusGarvey->description =        "(From Wikipedia): Marcus Garvey Park, or Mount Morris Park as it is referred to by the people in the neighborhood, is located in Harlem in the New York City borough of Manhattan. The 20.17-acre (81,600 m2) park interrupts the flow of Fifth Avenue, which is routed around the park via Mount Morris Park West. The park is bounded by 120th Street and 124th Street and by Madison Avenue on its east side. The park is operated and maintained by the New York City Department of Parks and Recreation.<br /><br />Originally named Mount Morris Park (and still part of the Mount Morris Park Historic District), in 1973 the park was renamed for Marcus Garvey. The name change did not arise from a grass-roots movement in the community, but rather, it was political maneuvering by Mayor John Lindsay to ingratiate himself with the communities of upper Manhattan. The name has changed on maps but not in the parlance of the people in the neighborhood. The new name for the park honored Garvey, a publisher, journalist, entrepreneur, crusader for black nationalism, and founder of the Universal Negro Improvement Association and African Communities League (UNIA-ACL). The park was opened to the public in 1840. In the summer of 1969 the park was the site of the Harlem Cultural Festival, a series of concerts that came to be known as 'Black Woodstock.'";
    $marcusGarvey->geocoverage =        'POLYGON((-8231296.358877003 4983263.6880512,-8231645.102819003 4983460.7522647,-8231443.261290997 4983827.4111347,-8231094.517348997 4983633.9299069,-8231296.358877003 4983263.6880512))';
    $marcusGarvey->display_order =      7;
    $marcusGarvey->space_active =       1;
    $marcusGarvey->save();

}
