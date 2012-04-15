<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Array -> Object and Object -> Array converter. Borrowed from mullanaphy
 * at http://php.net/manual/en/language.types.object.php.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

final class Convert {

    static public function object_to_array(stdClass $Class){
        $Class = (array)$Class;
        foreach($Class as $key => $value){
            if(is_object($value)&&get_class($value)==='stdClass'){
                $Class[$key] = self::object_to_array($value);
            }
        }
        return $Class;
    }

    static public function array_to_object(array $array){
        foreach($array as $key => $value){
            if(is_array($value)){
                $array[$key] = self::array_to_object($value);
            }
        }
        return (object)$array;
    }
}
