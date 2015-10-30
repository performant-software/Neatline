<?php
/**
 * MultiLineString: A collection of LineStrings
 */
class MultiLineString extends geoPHP_Collection
{
  protected $geom_type = 'MultiLineString';

  // MultiLineString is closed if all it's components are closed
  public function isClosed() {
    foreach ($this->components as $line) {
      if (!$line->isClosed()) {
        return FALSE;
      }
    }
    return TRUE;
  }

}

